-- Drop the existing view and function
DROP VIEW IF EXISTS articles_with_users;
DROP FUNCTION IF EXISTS get_articles_with_users();

-- Create a security definer function to get the data
CREATE OR REPLACE FUNCTION get_articles_with_users()
RETURNS TABLE (
    id bigint,
    title text,
    content text,
    owner_id text,
    created_at timestamptz,
    updated_at timestamptz,
    created_by_id text,
    first_name text,
    last_name text,
    avatar_url text
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE sql
AS $$
    SELECT 
        a.*,
        u.first_name,
        u.last_name,
        u.avatar_url
    FROM articles a
    LEFT JOIN users u ON a.created_by_id = u.id
    WHERE a.owner_id = requesting_owner_id();
$$;

-- Create the view using the security definer function
CREATE VIEW articles_with_users AS
SELECT * FROM get_articles_with_users();

-- Grant permissions
GRANT SELECT ON articles_with_users TO authenticated;
GRANT EXECUTE ON FUNCTION get_articles_with_users() TO authenticated;
