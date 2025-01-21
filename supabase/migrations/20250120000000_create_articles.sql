create table if not exists public.articles (
  id bigint primary key generated always as identity,
  title text not null,
  content text not null,
  user_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.articles enable row level security;

-- Create policies
create policy "Users can view their own articles"
  on public.articles
  for select
  using (auth.uid()::text = user_id);

create policy "Users can create their own articles"
  on public.articles
  for insert
  with check (auth.uid()::text = user_id);

create policy "Users can update their own articles"
  on public.articles
  for update
  using (auth.uid()::text = user_id);

create policy "Users can delete their own articles"
  on public.articles
  for delete
  using (auth.uid()::text = user_id);
