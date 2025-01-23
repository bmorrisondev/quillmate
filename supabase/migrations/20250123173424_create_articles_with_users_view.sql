-- Create view that joins articles with users
CREATE VIEW articles_with_users AS
SELECT 
    a.*,
    u.first_name,
    u.last_name,
    u.avatar_url
FROM articles a
LEFT JOIN users u ON a.owner_id = u.id;

-- Enable RLS on the view
ALTER VIEW articles_with_users SET (security_invoker = on);

-- Create policies for the view
-- CREATE POLICY "Users can view their own articles in view"
--     ON articles_with_users
--     FOR SELECT
--     TO authenticated
--     USING (owner_id = requesting_owner_id());
