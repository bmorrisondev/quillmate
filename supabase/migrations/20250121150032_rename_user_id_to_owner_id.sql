-- Rename user_id to owner_id and update default value
ALTER TABLE articles 
    RENAME COLUMN user_id TO owner_id;

-- Drop the old default value
ALTER TABLE articles 
    ALTER COLUMN owner_id DROP DEFAULT;

-- Set the new default value using requesting_owner_id()
ALTER TABLE articles 
    ALTER COLUMN owner_id SET DEFAULT requesting_owner_id();

-- Update RLS policies to use owner_id instead of user_id
DROP POLICY IF EXISTS "Users can insert their own articles" ON articles;
DROP POLICY IF EXISTS "Users can update their own articles" ON articles;
DROP POLICY IF EXISTS "Users can delete their own articles" ON articles;
DROP POLICY IF EXISTS "Users can view their own articles" ON articles;

CREATE POLICY "Users can insert their own articles"
ON articles FOR INSERT
TO authenticated
WITH CHECK (owner_id = requesting_owner_id());

CREATE POLICY "Users can update their own articles"
ON articles FOR UPDATE
TO authenticated
USING (owner_id = requesting_owner_id())
WITH CHECK (owner_id = requesting_owner_id());

CREATE POLICY "Users can delete their own articles"
ON articles FOR DELETE
TO authenticated
USING (owner_id = requesting_owner_id());

CREATE POLICY "Users can view their own articles"
ON articles FOR SELECT
TO authenticated
USING (owner_id = requesting_owner_id());
