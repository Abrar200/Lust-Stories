# AI Content Moderation System

## Overview
This platform includes an automated AI-powered content moderation system that uses OpenAI's Moderation API to detect and flag inappropriate content in real-time.

## Features

### Automated Content Flagging
- **Reviews**: All review submissions are automatically scanned for inappropriate language, spam, and harassment
- **Messages**: Private messages are checked before sending with blocking for high-confidence violations
- **Profile Content**: Profile updates can be moderated (integration ready)

### Moderation Thresholds
- **Confidence > 0.9**: Content is blocked immediately and user is notified
- **Confidence > 0.7**: Content is flagged and sent to moderation queue but allowed through
- **Confidence < 0.7**: Content passes without flags

### Detection Categories
The system detects:
- Hate speech
- Harassment
- Self-harm content
- Sexual content (inappropriate)
- Violence
- Spam

## Edge Function Setup

### Prerequisites
1. Add OpenAI API key to Supabase secrets:
   ```bash
   supabase secrets set OPENAI_API_KEY=your_openai_api_key_here
   ```

### Deployment
The edge function is located at: `supabase/functions/moderate-content/index.ts`

To deploy manually:
```bash
supabase functions deploy moderate-content
```

## Usage

### In Review Submissions
```typescript
const { data: moderationData } = await supabase.functions.invoke('moderate-content', {
  body: {
    content: reviewText,
    contentType: 'review',
    userId: user.id,
    referenceId: reviewId
  }
});

if (moderationData?.shouldBlock) {
  // Block submission
}
```

### In Messages
```typescript
const { data: moderationData } = await supabase.functions.invoke('moderate-content', {
  body: {
    content: messageText,
    contentType: 'message',
    userId: user.id,
    referenceId: conversationId
  }
});
```

## Database Integration

### Content Flags Table
Automatically creates entries in `content_flags` table:
- `content_type`: 'review', 'message', 'profile', 'photo'
- `flag_reason`: Comma-separated list of violated categories
- `flag_type`: 'automated' (from AI) or 'user' (user reports)
- `severity`: 'low', 'medium', 'high'
- `ai_confidence`: Score from 0-1
- `status`: 'pending', 'reviewed', 'dismissed'

### Admin Dashboard
Admins can review flagged content at `/admin` in the Content Moderation tab.

## Response Format
```json
{
  "flagged": true,
  "categories": {
    "hate": false,
    "harassment": true,
    "sexual": false,
    ...
  },
  "highestCategory": "harassment",
  "confidence": 0.85,
  "shouldBlock": false
}
```

## Testing
Test the moderation system by submitting content with inappropriate language. The system will automatically flag or block based on confidence levels.
