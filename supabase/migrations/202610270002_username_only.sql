-- Run after the original registry migration. The optional-contact-email migration
-- 202610270001 may be present or skipped. Auth users/passwords are never rewritten.
begin;

alter table public.alumni_profiles add column if not exists username text;
create unique index if not exists alumni_username_unique on public.alumni_profiles(username) where username is not null;

create table public.account_usernames (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique check (username ~ '^[a-z][a-z0-9_]{2,29}$')
);
alter table public.account_usernames enable row level security;
revoke all on public.account_usernames from public, anon, authenticated, service_role;
grant select on public.account_usernames to service_role;
-- No client policies: this lookup is only accessible to the trusted server.

-- Operator-only helper, also used by the signup trigger. Changing a username here
-- leaves the underlying Auth identity/password and application history intact.
create function private.set_account_username(p_user_id uuid, p_username text) returns text
language plpgsql security definer set search_path = '' as $$
declare chosen text := lower(btrim(p_username));
begin
  if chosen is null or chosen !~ '^[a-z][a-z0-9_]{2,29}$' then raise exception 'Invalid username'; end if;
  insert into public.account_usernames(user_id, username) values(p_user_id, chosen)
    on conflict(user_id) do update set username = excluded.username;
  update public.alumni_profiles set username = chosen where id = p_user_id;
  return chosen;
end;
$$;
revoke all on function private.set_account_username(uuid,text) from public, anon, authenticated, service_role;

-- Preserve usernames already chosen in the previous version before generating any.
insert into public.account_usernames(user_id, username)
  select id, username from public.alumni_profiles where username is not null;

do $$
declare account record; base text; chosen text; suffix integer;
begin
  for account in select u.id, exists(select 1 from public.officers o where o.user_id=u.id) as is_officer
    from auth.users u where not exists(select 1 from public.account_usernames n where n.user_id=u.id)
    order by u.id
  loop
    base := case when account.is_officer then 'officer_' else 'member_' end || substr(replace(account.id::text,'-',''),1,12);
    chosen := base;
    suffix := 0;
    while exists(select 1 from public.account_usernames where username=chosen) loop
      suffix := suffix + 1;
      chosen := base || '_' || suffix::text;
    end loop;
    perform private.set_account_username(account.id, chosen);
  end loop;
end;
$$;

create or replace function private.register_alumnus() returns trigger
language plpgsql security definer set search_path = '' as $$
declare chosen text;
begin
  if new.raw_user_meta_data ? 'alumni' then
    if new.raw_user_meta_data->>'graduateConsent' is distinct from 'true' then raise exception 'Graduate declaration and consent are required'; end if;
    if jsonb_typeof(new.raw_user_meta_data->'username') is distinct from 'string' then raise exception 'Invalid username'; end if;
  end if;
  if new.raw_user_meta_data ? 'username' then
    if jsonb_typeof(new.raw_user_meta_data->'username') is distinct from 'string' then raise exception 'Invalid username'; end if;
    chosen := lower(btrim(new.raw_user_meta_data->>'username'));
    if chosen !~ '^[a-z][a-z0-9_]{2,29}$' then raise exception 'Invalid username'; end if;
    if lower(new.email) is distinct from chosen || '@alumni.dcnhsaai.invalid' then raise exception 'Username does not match the sign-in account'; end if;
  else
    -- Dashboard-created officer accounts can be renamed with the operator helper.
    loop
      chosen := 'user_' || substr(replace(gen_random_uuid()::text,'-',''),1,20);
      exit when not exists(select 1 from public.account_usernames where username=chosen);
    end loop;
  end if;
  perform private.set_account_username(new.id, chosen);
  if new.raw_user_meta_data ? 'alumni' then
    insert into public.alumni_profiles(id, username, details)
      values(new.id, chosen, private.clean_details(new.raw_user_meta_data->'alumni'));
  end if;
  return new;
end;
$$;

-- Email is no longer profile data. Auth's private identifier remains in auth.users.
alter table public.alumni_profiles drop column email;
alter table public.alumni_profiles alter column username set not null;

create or replace function public.username_registration_ready() returns boolean
language sql immutable set search_path = '' as $$ select false; $$;
revoke all on function public.username_registration_ready() from public;
grant execute on function public.username_registration_ready() to anon, authenticated;

create function public.username_only_ready() returns boolean
language sql immutable set search_path = '' as $$ select true; $$;
revoke all on function public.username_only_ready() from public;
grant execute on function public.username_only_ready() to anon, authenticated;

-- Profile save implementation below deliberately ignores email and username in input.

create or replace function public.save_alumni_profile(p_details jsonb, p_expected_version integer, p_change_photo boolean default false, p_photo_path text default null)
returns void language plpgsql security definer set search_path = '' as $$
declare
  current_profile public.alumni_profiles;
  cleaned jsonb;
  identity_changed boolean;
begin
  select * into current_profile from public.alumni_profiles where id = auth.uid() for update;
  if not found then raise exception 'Sign in to your alumni account'; end if;
  if p_expected_version is distinct from current_profile.version then raise exception 'Your profile changed. Reload the page before saving'; end if;
  cleaned := private.clean_details(p_details);
  if p_change_photo and p_photo_path is not null then
    if p_photo_path not like auth.uid()::text || '/%' or not exists(select 1 from storage.objects where bucket_id = 'alumni-photos' and name = p_photo_path) then raise exception 'Invalid profile photo'; end if;
  end if;
  identity_changed := (cleaned->>'firstName', cleaned->>'middleName', cleaned->>'lastName', cleaned->>'batchYear')
    is distinct from (current_profile.details->>'firstName', current_profile.details->>'middleName', current_profile.details->>'lastName', current_profile.details->>'batchYear');
  update public.alumni_profiles set details = cleaned, updated_at = clock_timestamp(), version = version + 1,
    photo_path = case when p_change_photo then p_photo_path else photo_path end,
    verification = case when identity_changed and current_profile.verification = 'verified' then 'pending' else verification end
    where id = auth.uid();
  if identity_changed and current_profile.verification = 'verified' then
    insert into public.application_reviews(applicant_id,status,actor,actor_id,reviewer,message)
      values(auth.uid(),'pending','applicant',auth.uid(),cleaned->>'firstName' || ' ' || (cleaned->>'lastName'),'Name or batch year changed. The application has returned to officer review.');
  end if;
end;
$$;

drop function if exists private.clean_contact_email(jsonb);

commit;

-- These are the usernames to use with the existing passwords.
select n.user_id, n.username, coalesce(o.display_name, p.details->>'firstName', 'Account') as account_name,
  case when o.user_id is not null then 'officer' else 'alumni' end as account_type
from public.account_usernames n
left join public.officers o on o.user_id=n.user_id
left join public.alumni_profiles p on p.id=n.user_id
order by account_type, account_name;
