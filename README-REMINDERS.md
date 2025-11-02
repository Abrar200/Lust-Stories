# Automated Booking Reminder System

## Overview
Automated reminder system that sends SMS and email notifications to workers and clients before bookings using Twilio and SendGrid.

## Features
- **SMS Reminders** via Twilio
- **Email Reminders** via SendGrid
- **Customizable Timing**: 24 hours, 2 hours, and at booking start
- **User Preferences**: Enable/disable reminder types and channels
- **Duplicate Prevention**: Tracks sent reminders in database
- **Scheduled Cron Jobs**: Automatic checking for upcoming bookings

## Database Setup

Run the SQL script to create required tables:
```bash
psql -h your-db-host -U postgres -d postgres -f database-reminders-setup.sql
```

Tables created:
- `reminders` - Tracks all sent reminders
- `user_reminder_preferences` - Stores user notification preferences

## Edge Functions

### 1. send-booking-reminder
Sends SMS and email reminders for a specific booking.

**Deploy:**
```bash
supabase functions deploy send-booking-reminder
```

**Usage:**
```typescript
await supabase.functions.invoke('send-booking-reminder', {
  body: {
    bookingId: 'uuid',
    reminderType: '24_hours' | '2_hours' | 'starting_soon',
    recipientType: 'worker' | 'client'
  }
});
```

### 2. check-booking-reminders
Cron job that runs every 15 minutes to check for upcoming bookings and send reminders.

**Deploy:**
```bash
supabase functions deploy check-booking-reminders
```

**Set up cron schedule in Supabase dashboard:**
- Function: check-booking-reminders
- Schedule: */15 * * * * (every 15 minutes)

## User Settings

Users can customize reminder preferences in Settings:
- Enable/disable SMS reminders
- Enable/disable email reminders
- Toggle 24-hour reminders
- Toggle 2-hour reminders
- Toggle start-time reminders
- Customize timing (12h/24h/48h for advance, 1h/2h/4h for soon)

## Environment Variables

Required secrets (already configured):
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `SENDGRID_API_KEY`

## Integration

The reminder service is integrated into:
- Settings component for user preferences
- Worker calendar for booking management
- Booking system for automatic scheduling
