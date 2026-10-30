begin;

drop function if exists public.alumni_directory();

create function public.alumni_directory()
returns table(id uuid, name text, "batchYear" text, suffix text)
language sql stable security definer set search_path = '' as $$
  select
    id,
    (details->>'firstName') || ' ' || (details->>'lastName') ||
      case when nullif(details->>'suffix', '') is not null then ', ' || (details->>'suffix') else '' end,
    details->>'batchYear',
    details->>'suffix'
  from public.alumni_profiles
  where verification = 'verified'
  order by details->>'batchYear' desc, details->>'lastName', details->>'firstName', id;
$$;

grant execute on function public.alumni_directory() to anon, authenticated;

commit;
