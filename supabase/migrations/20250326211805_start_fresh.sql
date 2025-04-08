create table if not exists public.articles (
  id bigint primary key generated always as identity,
  title text not null,
  content text not null,
  owner_id text not null,
  created_by_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.articles enable row level security;

-- Create policies
create policy "Users can view their own articles"
on articles for select
using (owner_id = (auth.jwt()->>'sub')::text);

create policy "Users can insert their own articles"
on articles for insert
with check (owner_id = (auth.jwt()->>'sub')::text);

create policy "Users can update their own articles"
on articles for update
using (owner_id = (auth.jwt()->>'sub')::text)
with check (owner_id = (auth.jwt()->>'sub')::text);

create policy "Users can delete their own articles"
on articles for delete
using (owner_id = (auth.jwt()->>'sub')::text);