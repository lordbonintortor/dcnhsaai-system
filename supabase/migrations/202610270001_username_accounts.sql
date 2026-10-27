-- Run after 202610260001_alumni_registry.sql. Existing accounts/passwords stay intact.
begin;

alter table public.alumni_profiles add column username text;
alter table public.alumni_profiles add constraint alumni_username_format
  check (username is null or username ~ '^[a-z][a-z0-9_]{2,29}$');
create unique index alumni_username_unique on public.alumni_profiles(username) where username is not null;

create function private.clean_contact_email(value jsonb) returns text
language plpgsql immutable set search_path = '' as $$
declare result text;
begin
  if value is null then return ''; end if;
  if jsonb_typeof(value) <> 'string' then raise exception 'Enter a valid contact email or leave it blank'; end if;
  result := lower(btrim(value #>> '{}'));
  if length(result) > 200 or (result <> '' and result !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$')
    or result like '%@alumni.dcnhsaai.invalid' then
    raise exception 'Enter a valid contact email or leave it blank';
  end if;
  return result;
end;
$$;
revoke all on function private.clean_contact_email(jsonb) from public;

create or replace function private.register_alumnus() returns trigger
language plpgsql security definer set search_path = '' as $$
declare chosen_username text; contact_email text;
begin
  if new.raw_user_meta_data ? 'alumni' then
    if new.raw_user_meta_data->>'graduateConsent' is distinct from 'true' then raise exception 'Graduate declaration and consent are required'; end if;
    if new.raw_user_meta_data ? 'username' then
      if jsonb_typeof(new.raw_user_meta_data->'username') is distinct from 'string' then raise exception 'Invalid username'; end if;
      chosen_username := lower(btrim(new.raw_user_meta_data->>'username'));
      if chosen_username !~ '^[a-z][a-z0-9_]{2,29}$' then raise exception 'Invalid username'; end if;
      -- A caller cannot reserve a username belonging to another Auth identity.
      if lower(new.email) is distinct from chosen_username || '@alumni.dcnhsaai.invalid' then raise exception 'Username does not match the sign-in account'; end if;
      contact_email := private.clean_contact_email(new.raw_user_meta_data->'alumni'->'email');
    else
      -- Preserve compatibility with registrations already in flight from the old app.
      if lower(new.email) like '%@alumni.dcnhsaai.invalid' then raise exception 'A username is required'; end if;
      contact_email := lower(new.email);
    end if;
    insert into public.alumni_profiles(id, email, username, details)
      values (new.id, contact_email, chosen_username, private.clean_details(new.raw_user_meta_data->'alumni'));
  end if;
  return new;
end;
$$;

create or replace function public.save_alumni_profile(p_details jsonb, p_expected_version integer, p_change_photo boolean default false, p_photo_path text default null)
returns void language plpgsql security definer set search_path = '' as $$
declare
  current_profile public.alumni_profiles;
  cleaned jsonb;
  contact_email text;
  identity_changed boolean;
begin
  select * into current_profile from public.alumni_profiles where id = auth.uid() for update;
  if not found then raise exception 'Sign in to your alumni account'; end if;
  if p_expected_version is distinct from current_profile.version then raise exception 'Your profile changed. Reload the page before saving'; end if;
  cleaned := private.clean_details(p_details);
  contact_email := current_profile.email;
  if current_profile.username is not null and p_details ? 'email' then
    contact_email := private.clean_contact_email(p_details->'email');
  end if;
  if p_change_photo and p_photo_path is not null then
    if p_photo_path not like auth.uid()::text || '/%' or not exists(select 1 from storage.objects where bucket_id = 'alumni-photos' and name = p_photo_path) then raise exception 'Invalid profile photo'; end if;
  end if;
  identity_changed := (cleaned->>'firstName', cleaned->>'middleName', cleaned->>'lastName', cleaned->>'batchYear')
    is distinct from (current_profile.details->>'firstName', current_profile.details->>'middleName', current_profile.details->>'lastName', current_profile.details->>'batchYear');
  update public.alumni_profiles set details = cleaned, email = contact_email, updated_at = clock_timestamp(), version = version + 1,
    photo_path = case when p_change_photo then p_photo_path else photo_path end,
    verification = case when identity_changed and current_profile.verification = 'verified' then 'pending' else verification end
    where id = auth.uid();
  if identity_changed and current_profile.verification = 'verified' then
    insert into public.application_reviews(applicant_id,status,actor,actor_id,reviewer,message)
      values(auth.uid(),'pending','applicant',auth.uid(),cleaned->>'firstName' || ' ' || (cleaned->>'lastName'),'Name or batch year changed. The application has returned to officer review.');
  end if;
end;
$$;

-- Safe capability check: registration fails before Auth signup if this migration is absent.
create function public.username_registration_ready() returns boolean
language sql immutable set search_path = '' as $$ select true; $$;
revoke all on function public.username_registration_ready() from public;
grant execute on function public.username_registration_ready() to anon, authenticated;

commit;
