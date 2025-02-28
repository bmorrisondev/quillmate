-- Function to get org_id from JWT claims
CREATE OR REPLACE FUNCTION requesting_org_id()
RETURNS TEXT AS $$
    SELECT NULLIF(
        current_setting('request.jwt.claims', true)::json->>'org_id',
        ''
    )::text;
$$ LANGUAGE SQL STABLE;

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy for users table
-- This policy allows access to users who are members of the same organization
CREATE POLICY "Users can view members of their organization"
    ON users
    FOR SELECT
    TO authenticated
    USING (
        -- If no org_id in claims, only allow access to own user record
        (requesting_org_id() IS NULL AND id = requesting_owner_id())
        OR
        -- If org_id present, allow access to all users who are members of that org
        id IN (
            SELECT user_id 
            FROM members 
            WHERE organization_id = requesting_org_id()
        )
    );
