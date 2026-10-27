-- Authentication owns credentials. Application roles cannot be assigned by users.
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create table public.officers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (length(btrim(display_name)) between 1 and 200),
  created_at timestamptz not null default now()
);
alter table public.officers enable row level security;
revoke all on public.officers from anon, authenticated;
grant select on public.officers to authenticated;
create policy own_officer_role on public.officers for select to authenticated using (user_id = (select auth.uid()));

create function private.is_officer() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.officers where user_id = auth.uid());
$$;
revoke all on function private.is_officer() from public;
grant execute on function private.is_officer() to authenticated;

create function private.clean_details(input jsonb) returns jsonb
language plpgsql stable set search_path = '' as $$
declare
  result jsonb := '{}'::jsonb;
  field text;
  value text;
  year_value integer;
begin
  if jsonb_typeof(input) is distinct from 'object' then raise exception 'Invalid alumni information'; end if;
  foreach field in array array['batchYear','firstName','middleName','lastName','section','adviser','mobile','otherProfession','employers'] loop
    if input ? field and jsonb_typeof(input->field) <> 'string' then raise exception 'Invalid alumni information'; end if;
    value := btrim(coalesce(input->>field, ''));
    if length(value) > (case when field = 'employers' then 2000 else 200 end) then raise exception 'Alumni field is too long'; end if;
    result := result || jsonb_build_object(field, value);
  end loop;
  if result->>'firstName' = '' or result->>'lastName' = '' then raise exception 'Enter your first and last name'; end if;
  if (result->>'batchYear') !~ '^[0-9]{4}$' then raise exception 'Enter a valid batch year'; end if;
  year_value := (result->>'batchYear')::integer;
  if year_value < 1922 or year_value > extract(year from now() at time zone 'Asia/Manila') then raise exception 'Enter a valid batch year'; end if;
  if jsonb_typeof(input->'professions') is distinct from 'array' or jsonb_array_length(input->'professions') not between 1 and 8 then raise exception 'Select a profession'; end if;
  if exists(select 1 from jsonb_array_elements(input->'professions') p where jsonb_typeof(p) <> 'string' or p #>> '{}' not in ('Legal','Medical','Engineering','Finance','Information Technology','Entrepreneur','Retired','Other')) then raise exception 'Invalid profession'; end if;
  result := result || jsonb_build_object('professions', (select jsonb_agg(distinct p) from jsonb_array_elements_text(input->'professions') p));
  if (result->'professions') ? 'Other' and result->>'otherProfession' = '' then raise exception 'Specify your other profession'; end if;
  if not ((result->'professions') ? 'Other') then result := result || '{"otherProfession":""}'::jsonb; end if;
  return result;
end;
$$;
revoke all on function private.clean_details(jsonb) from public;

create table public.alumni_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  details jsonb not null,
  verification text not null default 'pending' check (verification in ('pending','needs_information','verified','rejected')),
  photo_path text,
  consent_at timestamptz not null default now(),
  consent_version text not null default '2026-10-26',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version integer not null default 1
);
create index alumni_status_created on public.alumni_profiles(verification, created_at);
alter table public.alumni_profiles enable row level security;
revoke all on public.alumni_profiles from anon, authenticated;
grant select on public.alumni_profiles to authenticated;
create policy own_or_officer_profiles on public.alumni_profiles for select to authenticated
  using (id = (select auth.uid()) or (select private.is_officer()));

create table public.application_reviews (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references public.alumni_profiles(id) on delete cascade,
  status text not null check (status in ('pending','needs_information','verified','rejected')),
  actor text not null check (actor in ('officer','applicant')),
  actor_id uuid references auth.users(id) on delete set null,
  reviewer text not null,
  message text not null default '' check (length(message) <= 1000),
  reviewed_at timestamptz not null default now()
);
create index reviews_by_applicant on public.application_reviews(applicant_id, reviewed_at);
alter table public.application_reviews enable row level security;
revoke all on public.application_reviews from anon, authenticated;
grant select on public.application_reviews to authenticated;
create policy own_or_officer_history on public.application_reviews for select to authenticated
  using (applicant_id = (select auth.uid()) or (select private.is_officer()));

create function private.register_alumnus() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  -- Users created by the operator for officer access need no alumni profile.
  if new.raw_user_meta_data ? 'alumni' then
    if new.raw_user_meta_data->>'graduateConsent' is distinct from 'true' then raise exception 'Graduate declaration and consent are required'; end if;
    insert into public.alumni_profiles(id, email, details)
      values (new.id, lower(new.email), private.clean_details(new.raw_user_meta_data->'alumni'));
  end if;
  return new;
end;
$$;
revoke all on function private.register_alumnus() from public;
create trigger on_alumni_signup after insert on auth.users for each row execute function private.register_alumnus();

create function public.save_alumni_profile(p_details jsonb, p_expected_version integer, p_change_photo boolean default false, p_photo_path text default null)
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

create function public.review_alumni_application(p_applicant_id uuid, p_expected_version integer, p_status text, p_message text default '')
returns void language plpgsql security definer set search_path = '' as $$
declare
  current_profile public.alumni_profiles;
  officer_name text;
  applicant_message text;
begin
  select display_name into officer_name from public.officers where user_id = auth.uid();
  if not found then raise exception 'Officer access required'; end if;
  if p_status not in ('verified','needs_information','rejected') or p_status is null then raise exception 'Invalid decision'; end if;
  applicant_message := case when p_status = 'verified' then '' else btrim(coalesce(p_message,'')) end;
  if p_status <> 'verified' and length(applicant_message) not between 1 and 1000 then raise exception 'Enter a message using 1–1,000 characters'; end if;
  select * into current_profile from public.alumni_profiles where id = p_applicant_id for update;
  if not found then raise exception 'Application not found'; end if;
  if current_profile.version is distinct from p_expected_version then raise exception 'This application changed. Reopen it before saving your decision'; end if;
  if current_profile.verification = p_status then raise exception 'This application already has that status'; end if;
  update public.alumni_profiles set verification = p_status, updated_at = clock_timestamp(), version = version + 1 where id = p_applicant_id;
  insert into public.application_reviews(applicant_id,status,actor,actor_id,reviewer,message)
    values(p_applicant_id,p_status,'officer',auth.uid(),officer_name,applicant_message);
end;
$$;

create function public.resubmit_alumni_application() returns void
language plpgsql security definer set search_path = '' as $$
declare current_profile public.alumni_profiles;
begin
  select * into current_profile from public.alumni_profiles where id = auth.uid() for update;
  if not found or current_profile.verification <> 'needs_information' then raise exception 'Only applications needing information can be resubmitted'; end if;
  update public.alumni_profiles set verification = 'pending', updated_at = clock_timestamp(), version = version + 1 where id = auth.uid();
  insert into public.application_reviews(applicant_id,status,actor,actor_id,reviewer,message)
    values(auth.uid(),'pending','applicant',auth.uid(),current_profile.details->>'firstName' || ' ' || (current_profile.details->>'lastName'),'The applicant resubmitted their saved details for officer review.');
end;
$$;

-- Public/member access uses explicit field projections, never whole profile rows.
create function public.alumni_directory() returns table(id uuid, name text, "batchYear" text)
language sql stable security definer set search_path = '' as $$
  select id, details->>'firstName' || ' ' || (details->>'lastName'), details->>'batchYear'
  from public.alumni_profiles where verification = 'verified'
  order by details->>'batchYear' desc, details->>'lastName', details->>'firstName', id;
$$;

create function private.is_verified_alumnus() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.alumni_profiles where id = auth.uid() and verification = 'verified');
$$;
revoke all on function private.is_verified_alumnus() from public;
grant execute on function private.is_verified_alumnus() to authenticated;

create function public.alumni_member_profile(p_id uuid) returns table(id uuid, "firstName" text, "lastName" text, "batchYear" text, professions jsonb, "otherProfession" text, photo_path text)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not private.is_verified_alumnus() and p_id is distinct from auth.uid() then raise exception 'An approved alumni account is required to view member profiles'; end if;
  return query select p.id, p.details->>'firstName',p.details->>'lastName',p.details->>'batchYear',p.details->'professions',p.details->>'otherProfession',p.photo_path
    from public.alumni_profiles p where p.id = p_id and (p.verification = 'verified' or p.id = auth.uid());
end;
$$;

revoke all on function public.save_alumni_profile(jsonb,integer,boolean,text) from public, anon;
revoke all on function public.review_alumni_application(uuid,integer,text,text) from public, anon;
revoke all on function public.resubmit_alumni_application() from public, anon;
revoke all on function public.alumni_member_profile(uuid) from public, anon;
revoke all on function public.alumni_directory() from public;
grant execute on function public.save_alumni_profile(jsonb,integer,boolean,text) to authenticated;
grant execute on function public.review_alumni_application(uuid,integer,text,text) to authenticated;
grant execute on function public.resubmit_alumni_application() to authenticated;
grant execute on function public.alumni_member_profile(uuid) to authenticated;
grant execute on function public.alumni_directory() to anon, authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('alumni-photos','alumni-photos',false,150000,array['image/jpeg']);
create policy upload_own_alumni_photo on storage.objects for insert to authenticated
  with check(bucket_id = 'alumni-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy read_alumni_photo on storage.objects for select to authenticated
  using(bucket_id = 'alumni-photos' and (
    (storage.foldername(name))[1] = (select auth.uid())::text or (select private.is_officer())
    or ((select private.is_verified_alumnus()) and exists(select 1 from public.alumni_member_profile(((storage.foldername(name))[1])::uuid) p where p.photo_path = name))
  ));
create policy delete_own_alumni_photo on storage.objects for delete to authenticated
  using(bucket_id = 'alumni-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
