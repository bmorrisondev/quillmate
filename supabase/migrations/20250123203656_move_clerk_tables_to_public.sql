-- Move tables back to public schema
ALTER TABLE clerk.users SET SCHEMA public;
ALTER TABLE clerk.organizations SET SCHEMA public;
ALTER TABLE clerk.members SET SCHEMA public;

-- Update foreign key references in members table
ALTER TABLE public.members 
    DROP CONSTRAINT members_organization_id_fkey,
    DROP CONSTRAINT members_user_id_fkey,
    ADD CONSTRAINT members_organization_id_fkey 
        FOREIGN KEY (organization_id) 
        REFERENCES public.organizations(id),
    ADD CONSTRAINT members_user_id_fkey 
        FOREIGN KEY (user_id) 
        REFERENCES public.users(id);

-- Update foreign key reference in articles table
ALTER TABLE articles 
    DROP CONSTRAINT IF EXISTS articles_created_by_id_fkey,
    ADD CONSTRAINT articles_created_by_id_fkey 
        FOREIGN KEY (created_by_id) 
        REFERENCES public.users(id);

-- Drop and recreate the view to use public schema
DROP VIEW IF EXISTS articles_with_users;
CREATE VIEW articles_with_users AS
SELECT 
    a.*,
    u.first_name,
    u.last_name,
    u.avatar_url
FROM articles a
LEFT JOIN public.users u ON a.created_by_id = u.id;

-- Enable RLS on the view
ALTER VIEW articles_with_users SET (security_invoker = on);

-- Drop the clerk schema if it's empty
DROP SCHEMA IF EXISTS clerk;
