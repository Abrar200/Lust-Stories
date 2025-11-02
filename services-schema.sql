-- Service Categories Table
CREATE TABLE IF NOT EXISTS service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  discount_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services Table
CREATE TABLE IF NOT EXISTS worker_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES service_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  is_public BOOLEAN DEFAULT true,
  popularity_percentage INTEGER DEFAULT 0,
  booking_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_services ENABLE ROW LEVEL SECURITY;

-- Policies for service_categories
CREATE POLICY "Workers can view own categories" ON service_categories FOR SELECT USING (auth.uid() = worker_id);
CREATE POLICY "Workers can insert own categories" ON service_categories FOR INSERT WITH CHECK (auth.uid() = worker_id);
CREATE POLICY "Workers can update own categories" ON service_categories FOR UPDATE USING (auth.uid() = worker_id);
CREATE POLICY "Workers can delete own categories" ON service_categories FOR DELETE USING (auth.uid() = worker_id);

-- Policies for worker_services
CREATE POLICY "Workers can view own services" ON worker_services FOR SELECT USING (auth.uid() = worker_id);
CREATE POLICY "Workers can insert own services" ON worker_services FOR INSERT WITH CHECK (auth.uid() = worker_id);
CREATE POLICY "Workers can update own services" ON worker_services FOR UPDATE USING (auth.uid() = worker_id);
CREATE POLICY "Workers can delete own services" ON worker_services FOR DELETE USING (auth.uid() = worker_id);
CREATE POLICY "Public can view public services" ON worker_services FOR SELECT USING (is_public = true);
