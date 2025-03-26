-- Create the requesting_owner_id function
create or replace function requesting_owner_id()
returns text
language sql
stable
as $$
  select 
    coalesce(
      (auth.jwt()->>'org_id')::text,
      (auth.jwt()->>'sub')::text
    );
$$;

-- Update the policies to use requesting_owner_id()
drop policy if exists "Users can view their own articles" on articles;
drop policy if exists "Users can insert their own articles" on articles;
drop policy if exists "Users can update their own articles" on articles;
drop policy if exists "Users can delete their own articles" on articles;

create policy "Users can view their own articles"
on articles for select
using (owner_id = requesting_owner_id());

create policy "Users can insert their own articles"
on articles for insert
with check (owner_id = requesting_owner_id());

create policy "Users can update their own articles"
on articles for update
using (owner_id = requesting_owner_id())
with check (owner_id = requesting_owner_id());

create policy "Users can delete their own articles"
on articles for delete
using (owner_id = requesting_owner_id());