-- Revoke all permissions from all roles except postgres
REVOKE ALL ON users FROM authenticated, anon, service_role;
REVOKE ALL ON organizations FROM authenticated, anon, service_role;
REVOKE ALL ON members FROM authenticated, anon, service_role;

-- Revoke usage on sequences
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM authenticated, anon, service_role;

-- Grant all permissions to postgres role
GRANT ALL ON users TO postgres;
GRANT ALL ON organizations TO postgres;
GRANT ALL ON members TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Enable RLS on tables (as additional security measure)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Users can view members of their organization" ON users;
DROP POLICY IF EXISTS "Users can view organizations" ON organizations;
DROP POLICY IF EXISTS "Users can view members" ON members;
