drop policy if exists "Users can view their own articles" on articles;
drop policy if exists "Users can insert their own articles" on articles;
drop policy if exists "Users can update their own articles" on articles;
drop policy if exists "Users can delete their own articles" on articles;

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