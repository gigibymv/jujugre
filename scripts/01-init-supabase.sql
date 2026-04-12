-- GRE Tutor Database Schema for Supabase

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  weekly_hours_target DECIMAL(3,1) DEFAULT 12,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  target_gre_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Study Plans table
CREATE TABLE IF NOT EXISTS study_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  target_gre_date TIMESTAMP WITH TIME ZONE NOT NULL,
  current_week_number INTEGER DEFAULT 1,
  current_module_id TEXT,
  phase TEXT DEFAULT 'foundation',
  is_late BOOLEAN DEFAULT FALSE,
  lateness_state TEXT DEFAULT 'on_track',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Modules (Topics) table
CREATE TABLE IF NOT EXISTS modules (
  id TEXT PRIMARY KEY,
  week_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  estimated_hours DECIMAL(3,1) DEFAULT 12,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Topic Mastery tracking
CREATE TABLE IF NOT EXISTS topic_mastery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL REFERENCES modules(id),
  practice_accuracy_percent INTEGER DEFAULT 0,
  task_completion_percent INTEGER DEFAULT 0,
  self_rating_average DECIMAL(2,1) DEFAULT 0,
  mastery_level TEXT DEFAULT 'not_started',
  last_review_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);

-- Error Log table
CREATE TABLE IF NOT EXISTS error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_id TEXT REFERENCES modules(id),
  error_category TEXT NOT NULL,
  question_text TEXT,
  user_answer TEXT,
  correct_answer TEXT,
  error_reason TEXT,
  source_material TEXT,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily Check-in tracking
CREATE TABLE IF NOT EXISTS daily_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  checkin_date DATE NOT NULL,
  completion_percent INTEGER DEFAULT 0,
  duration_minutes INTEGER,
  words_learned INTEGER DEFAULT 0,
  emotion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, checkin_date)
);

-- Weak Areas tracking
CREATE TABLE IF NOT EXISTS weak_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL REFERENCES modules(id),
  severity TEXT DEFAULT 'moderate',
  last_identified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE weak_areas ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" 
  ON users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON users FOR UPDATE 
  USING (auth.uid() = id);

-- RLS Policies for study_plans table
CREATE POLICY "Users can view their own study plans" 
  ON study_plans FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own study plans" 
  ON study_plans FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS Policies for topic_mastery table
CREATE POLICY "Users can view their own mastery data" 
  ON topic_mastery FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own mastery data" 
  ON topic_mastery FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS Policies for error_logs table
CREATE POLICY "Users can view their own error logs" 
  ON error_logs FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create error logs" 
  ON error_logs FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for daily_checkins table
CREATE POLICY "Users can view their own checkins" 
  ON daily_checkins FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create checkins" 
  ON daily_checkins FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for weak_areas table
CREATE POLICY "Users can view their own weak areas" 
  ON weak_areas FOR SELECT 
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_study_plans_user_id ON study_plans(user_id);
CREATE INDEX idx_topic_mastery_user_id ON topic_mastery(user_id);
CREATE INDEX idx_error_logs_user_id ON error_logs(user_id);
CREATE INDEX idx_daily_checkins_user_id ON daily_checkins(user_id);
CREATE INDEX idx_weak_areas_user_id ON weak_areas(user_id);
CREATE INDEX idx_daily_checkins_checkin_date ON daily_checkins(checkin_date);
