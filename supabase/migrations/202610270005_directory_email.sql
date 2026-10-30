begin;

drop function if exists public.alumni_directory();

create function public.alumni_directory()
returns table(id uuid, name text, "batchYear" text, suffix text, country text, email text)
language sql stable security definer set search_path = '' as $$
  select
    id,
    (details->>'firstName') || ' ' || (details->>'lastName') ||
      case when nullif(details->>'suffix', '') is not null then ', ' || (details->>'suffix') else '' end,
    details->>'batchYear',
    details->>'suffix',
    details->>'country',
    details->>'email'
  from public.alumni_profiles
  where verification = 'verified'
  order by details->>'batchYear' desc, details->>'lastName', details->>'firstName', id;
$$;

grant execute on function public.alumni_directory() to anon, authenticated;

drop policy if exists read_alumni_photo on storage.objects;
drop function if exists public.alumni_member_profile(uuid);

create function public.alumni_member_profile(p_id uuid)
returns table(id uuid, "firstName" text, "lastName" text, suffix text, country text, email text, "batchYear" text, professions jsonb, "otherProfession" text, photo_path text)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not private.is_verified_alumnus() and p_id is distinct from auth.uid() then
    raise exception 'An approved alumni account is required to view member profiles';
  end if;
  return query
    select p.id, p.details->>'firstName', p.details->>'lastName',
      p.details->>'suffix', p.details->>'country', p.details->>'email',
      p.details->>'batchYear', p.details->'professions',
      p.details->>'otherProfession', p.photo_path
    from public.alumni_profiles p
    where p.id = p_id and (p.verification = 'verified' or p.id = auth.uid());
end;
$$;

grant execute on function public.alumni_member_profile(uuid) to authenticated;

create policy read_alumni_photo on storage.objects for select to authenticated
  using(bucket_id = 'alumni-photos' and (
    (storage.foldername(name))[1] = (select auth.uid())::text or (select private.is_officer())
    or ((select private.is_verified_alumnus()) and exists(select 1 from public.alumni_member_profile(((storage.foldername(name))[1])::uuid) p where p.photo_path = name))
  ));

commit;
