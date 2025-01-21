-- Update user_id column to use requesting_user_id() as default
ALTER TABLE public.articles 
ALTER COLUMN user_id SET DEFAULT requesting_user_id();

-- Update RLS policies to use requesting_user_id() instead of auth.uid()
DROP POLICY IF EXISTS "Users can view their own articles" ON public.articles;
DROP POLICY IF EXISTS "Users can create their own articles" ON public.articles;
DROP POLICY IF EXISTS "Users can update their own articles" ON public.articles;
DROP POLICY IF EXISTS "Users can delete their own articles" ON public.articles;

CREATE POLICY "Users can view their own articles"
  ON public.articles
  FOR SELECT
  USING (requesting_user_id() = user_id);

CREATE POLICY "Users can create their own articles"
  ON public.articles
  FOR INSERT
  WITH CHECK (requesting_user_id() = user_id);

CREATE POLICY "Users can update their own articles"
  ON public.articles
  FOR UPDATE
  USING (requesting_user_id() = user_id);

CREATE POLICY "Users can delete their own articles"
  ON public.articles
  FOR DELETE
  USING (requesting_user_id() = user_id);
