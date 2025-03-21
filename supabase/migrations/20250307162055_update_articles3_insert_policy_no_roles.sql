drop policy if exists "Users can create articles" on public.articles3;

create policy "Users can create articles"
  on public.articles3
  for insert
  with check (
    owner_id = requesting_owner_id()
  );
