# Payment System Documentation

## Overview
Complete Stripe-powered payment system for bookings, deposits, tips, and worker payouts with dispute resolution.

## Setup Instructions

### 1. Database Setup
Run the SQL in `payment-schema.sql` in your Supabase SQL Editor to create:
- `payments` - Transaction records
- `worker_wallets` - Worker earnings tracking
- `payout_requests` - Withdrawal requests
- `payment_disputes` - Dispute management
- `bookings` - Booking records

### 2. Stripe Configuration
1. Get your Stripe API keys from https://dashboard.stripe.com/apikeys
2. Add to Supabase Edge Function secrets:
```bash
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
```

### 3. Deploy Edge Functions
```bash
supabase functions deploy create-payment-intent
supabase functions deploy process-refund
```

## Features

### Payment Processing
- **Booking Payments**: Full payment for services
- **Deposits**: Partial upfront payments
- **Tips**: Additional gratuity payments
- **Refunds**: Full or partial refund processing

### Worker Wallet
- Real-time balance tracking
- Pending vs available funds
- Lifetime earnings statistics
- Withdrawal request system

### Payment Disputes
- Client-initiated disputes
- Multiple dispute types
- Admin resolution workflow
- Automatic refund processing

## Usage Examples

### Process a Booking Payment
```typescript
import { PaymentForm } from '@/components/PaymentForm';

<PaymentForm
  amount={150.00}
  paymentType="booking"
  receiverId={workerId}
  onSuccess={() => console.log('Payment successful')}
  onCancel={() => console.log('Payment cancelled')}
/>
```

### Worker Wallet Dashboard
```typescript
import { WorkerWallet } from '@/components/WorkerWallet';

<WorkerWallet />
```

### Request Refund
```typescript
const { data } = await supabase.functions.invoke('process-refund', {
  body: {
    paymentIntentId: 'pi_xxx',
    amount: 50.00,
    reason: 'requested_by_customer'
  }
});
```

## Payment Flow

1. **Client initiates payment** → PaymentForm component
2. **Create payment intent** → create-payment-intent edge function
3. **Process with Stripe** → Stripe API
4. **Record transaction** → payments table
5. **Update wallet** → worker_wallets table
6. **Funds available** → Worker can withdraw

## Security Features

- Stripe PCI compliance
- Secure edge function processing
- Row Level Security policies
- Payment verification
- Dispute resolution system

## Testing

Use Stripe test cards:
- Success: 4242 4242 4242 4242
- Decline: 4000 0000 0000 0002
- 3D Secure: 4000 0025 0000 3155

## Admin Features

- View all transactions
- Process refunds
- Resolve disputes
- Approve payouts
- Monitor wallet balances
