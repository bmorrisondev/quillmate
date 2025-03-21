-- Drop the existing view if it exists
DROP VIEW IF EXISTS articles3_with_users;

-- Create a security definer function to get the data
CREATE OR REPLACE FUNCTION get_articles3_with_users()
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
    FROM articles3 a
    LEFT JOIN users u ON a.created_by_id = u.id;
$$;

-- Create the view using the security definer function
CREATE VIEW articles3_with_users AS
SELECT * FROM get_articles3_with_users();

-- Grant permissions
GRANT SELECT ON articles3_with_users TO authenticated;
GRANT EXECUTE ON FUNCTION get_articles3_with_users() TO authenticated;
