create table if not exists public.articles2 (
  id bigint primary key generated always as identity,
  title text not null,
  content text not null,
  owner_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by text not null
);

-- Enable RLS
alter table public.articles2 enable row level security;

-- Create policies
create policy "Users can view their own articles"
  on public.articles2
  for select
  using (auth.uid()::text = owner_id);

create policy "Users can create their own articles"
  on public.articles2
  for insert
  with check (auth.uid()::text = owner_id);

create policy "Users can update their own articles"
  on public.articles2
  for update
  using (auth.uid()::text = owner_id)
  with check (auth.uid()::text = owner_id);

create policy "Users can delete their own articles"
  on public.articles2
  for delete
  using (auth.uid()::text = owner_id);
