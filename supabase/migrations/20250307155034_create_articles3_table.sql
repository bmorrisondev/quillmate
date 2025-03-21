create table if not exists public.articles3 (
  id bigint primary key generated always as identity,
  title text not null,
  content text not null,
  owner_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),  
  created_by_id text references users(id) default requesting_user_id()
);

-- Enable RLS
alter table public.articles3 enable row level security;

-- Create policies with null check on request_owner_id
create policy "Anon can view articles if request_owner_id is not null"
  on public.articles3
  for select
  to anon
  using (
    requesting_owner_id() is not null
    and owner_id = requesting_owner_id()
  );

create policy "Anon can create articles if request_owner_id is not null"
  on public.articles3
  for insert
  to anon
  with check (
    requesting_owner_id() is not null
    and owner_id = requesting_owner_id()
  );

create policy "Anon can update articles if request_owner_id is not null"
  on public.articles3
  for update
  to anon
  using (
    requesting_owner_id() is not null
    and owner_id = requesting_owner_id()
  )
  with check (
    requesting_owner_id() is not null
    and owner_id = requesting_owner_id()
  );

create policy "Anon can delete articles if request_owner_id is not null"
  on public.articles3
  for delete
  to anon
  using (
    requesting_owner_id() is not null
    and owner_id = requesting_owner_id()
  );
