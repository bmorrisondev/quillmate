drop policy if exists "Users can create articles" on public.articles3;

create policy "Anon can create articles"
  on public.articles3
  for insert
  to anon
  with check (
    owner_id = requesting_owner_id()
  );
