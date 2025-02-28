-- Create clerk schema
CREATE SCHEMA IF NOT EXISTS clerk;

-- Move tables to clerk schema
ALTER TABLE users SET SCHEMA clerk;
ALTER TABLE organizations SET SCHEMA clerk;
ALTER TABLE members SET SCHEMA clerk;

-- Update foreign key references in members table
ALTER TABLE clerk.members 
    DROP CONSTRAINT members_organization_id_fkey,
    DROP CONSTRAINT members_user_id_fkey,
    ADD CONSTRAINT members_organization_id_fkey 
        FOREIGN KEY (organization_id) 
        REFERENCES clerk.organizations(id),
    ADD CONSTRAINT members_user_id_fkey 
        FOREIGN KEY (user_id) 
        REFERENCES clerk.users(id);

-- Update foreign key reference in articles table
ALTER TABLE articles 
    DROP CONSTRAINT IF EXISTS articles_created_by_id_fkey,
    ADD CONSTRAINT articles_created_by_id_fkey 
        FOREIGN KEY (created_by_id) 
        REFERENCES clerk.users(id);

-- Drop and recreate the view to use new schema
DROP VIEW IF EXISTS articles_with_users;
CREATE VIEW articles_with_users AS
SELECT 
    a.*,
    u.first_name,
    u.last_name,
    u.avatar_url
FROM articles a
LEFT JOIN clerk.users u ON a.created_by_id = u.id;

-- Enable RLS on the view
ALTER VIEW articles_with_users SET (security_invoker = on);

-- Update the RLS policy on users to use new schema
DROP POLICY IF EXISTS "Users can view members of their organization" ON clerk.users;
-- CREATE POLICY "Users can view members of their organization"
--     ON clerk.users
--     FOR SELECT
--     TO authenticated
--     USING (
--         (requesting_org_id() IS NULL AND id = requesting_owner_id())
--         OR
--         id IN (
--             SELECT user_id 
--             FROM clerk.members 
--             WHERE organization_id = requesting_org_id()
--         )
--     );
