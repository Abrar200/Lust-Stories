-- Create reminders table to track sent reminders and prevent duplicates
CREATE TABLE IF NOT EXISTS reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL,
  reminder_type TEXT NOT NULL, -- '24_hours', '2_hours', 'starting_soon'
  recipient_type TEXT NOT NULL, -- 'worker' or 'client'
  recipient_id UUID NOT NULL,
  sent_via TEXT NOT NULL, -- 'sms', 'email', 'both'
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'sent', -- 'sent', 'failed', 'pending'
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user reminder preferences table
CREATE TABLE IF NOT EXISTS user_reminder_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  sms_enabled BOOLEAN DEFAULT true,
  email_enabled BOOLEAN DEFAULT true,
  reminder_24h_enabled BOOLEAN DEFAULT true,
  reminder_2h_enabled BOOLEAN DEFAULT true,
  reminder_starting_enabled BOOLEAN DEFAULT true,
  phone_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_reminders_booking ON reminders(booking_id);
CREATE INDEX IF NOT EXISTS idx_reminders_recipient ON reminders(recipient_id);
CREATE INDEX IF NOT EXISTS idx_reminders_sent_at ON reminders(sent_at);
CREATE INDEX IF NOT EXISTS idx_user_prefs_user ON user_reminder_preferences(user_id);

-- Enable RLS
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reminder_preferences ENABLE ROW LEVEL SECURITY;

-- RLS policies for reminders
CREATE POLICY "Users can view their own reminders"
  ON reminders FOR SELECT
  USING (recipient_id = auth.uid());

-- RLS policies for preferences
CREATE POLICY "Users can view their own preferences"
  ON user_reminder_preferences FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own preferences"
  ON user_reminder_preferences FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own preferences"
  ON user_reminder_preferences FOR INSERT
  WITH CHECK (user_id = auth.uid());
