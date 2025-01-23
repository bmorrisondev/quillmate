-- Add created_by_id column to articles table
ALTER TABLE articles
ADD COLUMN created_by_id TEXT REFERENCES users(id) DEFAULT requesting_user_id();

-- Update the view to include the new column
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
