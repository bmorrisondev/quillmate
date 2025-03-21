alter table public.articles3
  alter column owner_id set default requesting_owner_id();
