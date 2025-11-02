-- Enhanced Search Schema
-- Run this SQL in Supabase SQL Editor

-- Add full-text search and location columns to user_profiles
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS search_vector tsvector,
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS location_city TEXT,
ADD COLUMN IF NOT EXISTS location_state TEXT,
ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS services TEXT[],
ADD COLUMN IF NOT EXISTS availability_calendar JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3, 2) DEFAULT 0;

-- Create indexes
CREATE INDEX IF NOT EXISTS user_profiles_search_idx ON user_profiles USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS user_profiles_location_idx ON user_profiles(latitude, longitude);

-- Function to update search vector
CREATE OR REPLACE FUNCTION update_user_profiles_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.full_name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.bio, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.services, ' '), '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
DROP TRIGGER IF EXISTS user_profiles_search_vector_update ON user_profiles;
CREATE TRIGGER user_profiles_search_vector_update
  BEFORE INSERT OR UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_user_profiles_search_vector();

-- Saved searches table
CREATE TABLE IF NOT EXISTS saved_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  search_name TEXT NOT NULL,
  filters JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS saved_searches_user_idx ON saved_searches(user_id);
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saved searches" ON saved_searches
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own saved searches" ON saved_searches
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own saved searches" ON saved_searches
  FOR DELETE USING (auth.uid() = user_id);

-- Search history table
CREATE TABLE IF NOT EXISTS search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  search_query TEXT,
  filters JSONB,
  results_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS search_history_user_idx ON search_history(user_id, created_at DESC);
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own search history" ON search_history
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own search history" ON search_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);
