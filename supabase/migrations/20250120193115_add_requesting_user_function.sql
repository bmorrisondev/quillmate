-- add requesting_user_id function
create or replace function requesting_user_id()
returns text as $$
    select nullif(
        current_setting('request.jwt.claims', true)::json->>'sub',
        ''
    )::text;
$$ language sql stable;
