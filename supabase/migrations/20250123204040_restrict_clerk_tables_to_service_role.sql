-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Revoke all permissions from public and authenticated roles
REVOKE ALL ON users FROM public, authenticated;
REVOKE ALL ON organizations FROM public, authenticated;
REVOKE ALL ON members FROM public, authenticated;

-- Revoke usage on sequences if they exist
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM public, authenticated;

-- Create view for authenticated access to user data
DROP VIEW IF EXISTS articles_with_users;
CREATE VIEW articles_with_users AS
SELECT 
    a.*,
    u.first_name,
    u.last_name,
    u.avatar_url
FROM articles a
LEFT JOIN users u ON a.created_by_id = u.id;

-- Enable RLS on the view
ALTER VIEW articles_with_users SET (security_invoker = on);

-- Grant select on the view to authenticated users
GRANT SELECT ON articles_with_users TO authenticated;
