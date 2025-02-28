-- Revoke all permissions from public roles
REVOKE ALL ON users FROM authenticated, anon;
REVOKE ALL ON organizations FROM authenticated, anon;
REVOKE ALL ON members FROM authenticated, anon;

-- Revoke usage on sequences from public roles
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM authenticated, anon;

-- Grant all permissions to postgres and service_role
GRANT ALL ON users TO postgres, service_role;
GRANT ALL ON organizations TO postgres, service_role;
GRANT ALL ON members TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;

-- Enable RLS on tables (as additional security measure)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Users can view members of their organization" ON users;
DROP POLICY IF EXISTS "Users can view organizations" ON organizations;
DROP POLICY IF EXISTS "Users can view members" ON members;
