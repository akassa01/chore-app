-- Chore Tracker Database Setup Script
-- Run this in your Supabase SQL editor

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chores table
CREATE TABLE IF NOT EXISTS chores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subtasks JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assignments table
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  chore_id UUID REFERENCES chores(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  late BOOLEAN DEFAULT FALSE,
  subtasks_completed JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ratings table
CREATE TABLE IF NOT EXISTS ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rater_id UUID REFERENCES users(id) ON DELETE CASCADE,
  ratee_id UUID REFERENCES users(id) ON DELETE CASCADE,
  chore_id UUID REFERENCES chores(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(rater_id, ratee_id, chore_id, week_start_date)
);

-- Insert themed users
INSERT INTO users (name) VALUES 
  ('Arman'),
  ('Lucas'),
  ('Shanmugam'),
  ('Alejandro')
ON CONFLICT (name) DO NOTHING;

-- Insert sample chores
INSERT INTO chores (name, subtasks) VALUES 
  ('Kitchen', '["Clean microwave", "Wash sink", "Clean stove", "Organize drying rack"]'),
  ('Bathroom', '["Clean toilet", "Wipe sink", "Mop floor", "Restock supplies"]'),
  ('Living Room', '["Vacuum carpet", "Dust surfaces", "Organize cushions", "Empty trash"]'),
  ('Shower', '["Scrub walls", "Clean drain", "Wipe door", "Replace shower curtain"]')
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assignments_week_start ON assignments(week_start_date);
CREATE INDEX IF NOT EXISTS idx_assignments_user_id ON assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_assignments_completed ON assignments(completed);
CREATE INDEX IF NOT EXISTS idx_ratings_week_start ON ratings(week_start_date);
CREATE INDEX IF NOT EXISTS idx_ratings_rater_id ON ratings(rater_id);
