-- Create tasks table
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  user_id UUID NOT NULL
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow users to view their own tasks
CREATE POLICY "Users can view own tasks" ON tasks
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own tasks
CREATE POLICY "Users can insert own tasks" ON tasks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own tasks
CREATE POLICY "Users can update own tasks" ON tasks
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow users to delete their own tasks
CREATE POLICY "Users can delete own tasks" ON tasks
  FOR DELETE
  USING (auth.uid() = user_id);
