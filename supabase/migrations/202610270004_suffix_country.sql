begin;

create or replace function private.clean_details(input jsonb) returns jsonb
language plpgsql stable set search_path = '' as $$
declare
  result jsonb := '{}'::jsonb;
  field text;
  value text;
  year_value integer;
begin
  if jsonb_typeof(input) is distinct from 'object' then raise exception 'Invalid alumni information'; end if;
  foreach field in array array['batchYear','firstName','middleName','lastName','suffix','country','email','section','adviser','mobile','otherProfession','employers'] loop
    if input ? field and jsonb_typeof(input->field) <> 'string' then raise exception 'Invalid alumni information'; end if;
    value := btrim(coalesce(input->>field, ''));
    if length(value) > (case when field = 'employers' then 2000 else 200 end) then raise exception 'Alumni field is too long'; end if;
    result := result || jsonb_build_object(field, value);
  end loop;
  if result->>'firstName' = '' or result->>'lastName' = '' then raise exception 'Enter your first and last name'; end if;
  if result->>'country' = '' then raise exception 'Enter your current country of residence'; end if;
  if result->>'email' <> '' and result->>'email' !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then raise exception 'Enter a valid email address'; end if;
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

drop function if exists public.alumni_directory();
create function public.alumni_directory() returns table(id uuid, name text, "batchYear" text, suffix text, country text)
language sql stable security definer set search_path = '' as $$
  select id, (details->>'firstName') || ' ' || (details->>'lastName') ||
    case when nullif(details->>'suffix', '') is not null then ', ' || (details->>'suffix') else '' end,
    details->>'batchYear', details->>'suffix', details->>'country'
  from public.alumni_profiles where verification = 'verified'
  order by details->>'batchYear' desc, details->>'lastName', details->>'firstName', id;
$$;
grant execute on function public.alumni_directory() to anon, authenticated;

commit;
