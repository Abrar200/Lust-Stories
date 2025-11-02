-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID,
  reviewer_id UUID NOT NULL,
  worker_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  photos TEXT[],
  verified_booking BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  worker_response TEXT,
  worker_response_date TIMESTAMPTZ,
  flagged BOOLEAN DEFAULT false,
  flag_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_worker_id ON reviews(worker_id);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_reviews_flagged ON reviews(flagged);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved reviews" ON reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can insert their own reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "Workers can update their responses" ON reviews FOR UPDATE USING (auth.uid() = worker_id);
CREATE POLICY "Admins have full access" ON reviews FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Content Flags Table
CREATE TABLE IF NOT EXISTS content_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL CHECK (content_type IN ('profile', 'photo', 'review', 'message')),
  content_id UUID NOT NULL,
  user_id UUID NOT NULL,
  flag_type TEXT NOT NULL CHECK (flag_type IN ('inappropriate', 'spam', 'fake', 'harassment', 'other')),
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'actioned', 'dismissed')),
  reviewed_by UUID,
  review_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_content_flags_status ON content_flags(status);
CREATE INDEX idx_content_flags_content ON content_flags(content_type, content_id);

ALTER TABLE content_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can flag content" ON content_flags FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage flags" ON content_flags FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Disputes Table
CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID,
  complainant_id UUID NOT NULL,
  respondent_id UUID NOT NULL,
  dispute_type TEXT NOT NULL CHECK (dispute_type IN ('payment', 'service', 'behavior', 'cancellation', 'other')),
  description TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
  resolution TEXT,
  resolved_by UUID,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_disputes_status ON disputes(status);
CREATE INDEX idx_disputes_priority ON disputes(priority);

ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create disputes" ON disputes FOR INSERT WITH CHECK (auth.uid() IN (complainant_id, respondent_id));
CREATE POLICY "Users can view their disputes" ON disputes FOR SELECT USING (auth.uid() IN (complainant_id, respondent_id));
CREATE POLICY "Admins can manage disputes" ON disputes FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- User Verifications Table
CREATE TABLE IF NOT EXISTS user_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  verification_type TEXT NOT NULL CHECK (verification_type IN ('id', 'background_check', 'address', 'phone', 'email')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  document_url TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  expiry_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_verifications_user_id ON user_verifications(user_id);
CREATE INDEX idx_user_verifications_status ON user_verifications(status);

ALTER TABLE user_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their verification" ON user_verifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can submit verification" ON user_verifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage verifications" ON user_verifications FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Moderation Logs Table
CREATE TABLE IF NOT EXISTS moderation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  moderator_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_moderation_logs_moderator ON moderation_logs(moderator_id);
CREATE INDEX idx_moderation_logs_action ON moderation_logs(action_type);
CREATE INDEX idx_moderation_logs_created ON moderation_logs(created_at);

ALTER TABLE moderation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view logs" ON moderation_logs FOR SELECT USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can insert logs" ON moderation_logs FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));
