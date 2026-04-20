-- DEER Drone: Chatbot & Messenger Config Data schema
-- Run this in your Supabase SQL Editor to support the new Admin Settings module

-- 1. System Settings table for Prompt configs
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Messenger Configuration table
CREATE TABLE IF NOT EXISTS messenger_config (
  id integer PRIMARY KEY DEFAULT 1,
  page_access_token TEXT,
  verify_token TEXT,
  page_id TEXT, 
  is_enabled BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS so they aren't fully public by default
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messenger_config ENABLE ROW LEVEL SECURITY;

-- Expose via policies
CREATE POLICY "Public system_settings are viewable by everyone" ON system_settings FOR SELECT USING (true);
CREATE POLICY "Public messenger_config are viewable by everyone" ON messenger_config FOR SELECT USING (true);

-- Insert starting setup for config
INSERT INTO system_settings (setting_key, setting_value, description)
VALUES (
  'system_prompt', 
  'You are DroneBot — a high-level technical expert and sales consultant for a premium Mongolian drone shop (MongolDrone / DEER Drone).
AVAILABLE DRONES:
{productsContext}
YOUR MISSION: Provide expert-level advice on drones based on technical specs. Help users choose drones... 
OUTPUT FORMAT: Return ONLY a valid JSON object.
', 
  'AI chatbot primary instructions'
) ON CONFLICT (setting_key) DO NOTHING;

INSERT INTO messenger_config (id, is_enabled) VALUES (1, true) ON CONFLICT (id) DO NOTHING;
