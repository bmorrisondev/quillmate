-- Migration: Create article_chats table for chat history associated with articles
CREATE TABLE IF NOT EXISTS article_chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id bigint REFERENCES articles(id) ON DELETE CASCADE,
  user_id text REFERENCES users(id) ON DELETE SET NULL,
  message text NOT NULL,
  role text CHECK (role IN ('user', 'assistant')) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_article_chats_article_id ON article_chats(article_id);
