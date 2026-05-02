-- ============================================================
-- DeerDrone — conversations table
-- Run this in Supabase SQL Editor once.
-- ============================================================

CREATE TABLE IF NOT EXISTS conversations (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id  TEXT        NOT NULL,
  role        TEXT        NOT NULL CHECK (role IN ('user', 'bot', 'admin')),
  content     TEXT        NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_conversations_session_id ON conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at DESC);

-- Allow service-role key to do everything (chatbot service uses service role)
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access"
  ON conversations
  USING (true)
  WITH CHECK (true);

-- Enable Realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
