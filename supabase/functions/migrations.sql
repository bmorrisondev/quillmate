-- Function to create migrations table
create or replace function create_migrations_table(sql text)
returns void
language plpgsql
security definer
as $$
begin
  execute sql;
end;
$$;

-- Function to run a migration
create or replace function run_migration(sql text, migration_name text)
returns void
language plpgsql
security definer
as $$
begin
  execute sql;
end;
$$;
