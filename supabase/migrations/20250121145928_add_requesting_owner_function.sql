-- Add requesting_owner_id function
CREATE OR REPLACE FUNCTION requesting_owner_id()
RETURNS TEXT AS $$
    SELECT COALESCE(
        NULLIF(current_setting('request.jwt.claims', true)::json->>'org_id', ''),
        NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', '')
    )::text;
$$ LANGUAGE SQL STABLE;
