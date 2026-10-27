create table if not exists public.activity_reactions (
  activity_slug text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  reaction text not null default 'like' check (reaction = 'like'),
  created_at timestamptz not null default now(),
  primary key (activity_slug, user_id)
);

alter table public.activity_reactions enable row level security;

drop policy if exists "Anyone can view activity reactions" on public.activity_reactions;
create policy "Anyone can view activity reactions"
  on public.activity_reactions for select
  using (true);

drop policy if exists "Users can add their own activity reaction" on public.activity_reactions;
create policy "Users can add their own activity reaction"
  on public.activity_reactions for insert
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can remove their own activity reaction" on public.activity_reactions;
create policy "Users can remove their own activity reaction"
  on public.activity_reactions for delete
  using ((select auth.uid()) = user_id);
