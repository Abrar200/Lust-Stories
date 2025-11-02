-- Payment System Database Schema
-- Run this SQL in Supabase SQL Editor to set up payment tables

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payer_id UUID REFERENCES auth.users(id),
  receiver_id UUID REFERENCES auth.users(id),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  payment_type VARCHAR(20) NOT NULL, -- 'booking', 'deposit', 'tip', 'refund'
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'succeeded', 'failed', 'refunded'
  stripe_payment_intent_id VARCHAR(255),
  stripe_charge_id VARCHAR(255),
  payment_method_id VARCHAR(255),
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create worker_wallets table
CREATE TABLE IF NOT EXISTS worker_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID REFERENCES auth.users(id) UNIQUE,
  available_balance DECIMAL(10, 2) DEFAULT 0,
  pending_balance DECIMAL(10, 2) DEFAULT 0,
  total_earned DECIMAL(10, 2) DEFAULT 0,
  total_withdrawn DECIMAL(10, 2) DEFAULT 0,
  stripe_account_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payout_requests table
CREATE TABLE IF NOT EXISTS payout_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID REFERENCES auth.users(id),
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  stripe_payout_id VARCHAR(255),
  bank_account_last4 VARCHAR(4),
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payment_disputes table
CREATE TABLE IF NOT EXISTS payment_disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID REFERENCES payments(id),
  raised_by UUID REFERENCES auth.users(id),
  dispute_type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'open',
  resolution TEXT,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES auth.users(id),
  worker_id UUID REFERENCES auth.users(id),
  service_type VARCHAR(100),
  booking_date TIMESTAMP WITH TIME ZONE,
  duration_hours DECIMAL(4, 2),
  total_amount DECIMAL(10, 2),
  deposit_amount DECIMAL(10, 2),
  status VARCHAR(20) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_payments_payer ON payments(payer_id);
CREATE INDEX idx_payments_receiver ON payments(receiver_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_worker_wallets_worker ON worker_wallets(worker_id);
CREATE INDEX idx_payout_requests_worker ON payout_requests(worker_id);
