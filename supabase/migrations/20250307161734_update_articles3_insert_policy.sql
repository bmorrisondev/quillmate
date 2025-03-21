drop policy if exists "Anon can create articles if request_owner_id is not null" on public.articles3;

create policy "Users can create articles"
  on public.articles3
  for insert
  to anon, authenticated
  with check (
    owner_id = requesting_owner_id()
  );
