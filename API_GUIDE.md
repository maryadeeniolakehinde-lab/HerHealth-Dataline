# API Implementation Guide

## 🔌 API Endpoints Overview

All endpoints handle JSON and return JSON responses.

---

## Authentication API

### Create New User
**POST** `/api/auth/create-user`

Request:
```json
{
  "ageRange": "16-18",
  "state": "Lagos"
}
```

Response:
```json
{
  "user_id": "HHD-A7F9K2",
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

### Get User Profile
**POST** `/api/auth/get-profile`

Request:
```json
{
  "user_id": "HHD-A7F9K2"
}
```

Response:
```json
{
  "user_id": "HHD-A7F9K2",
  "age_range": "16-18",
  "state": "Lagos",
  "created_at": "2024-01-15T10:30:00Z",
  "last_login": "2024-01-16T14:20:00Z"
}
```

---

## Chat API

### Send Message & Get Response
**POST** `/api/chat`

Request:
```json
{
  "user_id": "HHD-A7F9K2",
  "message": "What should I do about period pain?",
  "age_range": "16-18",
  "state": "Lagos",
  "chat_history": [
    {
      "role": "user",
      "content": "Previous message..."
    },
    {
      "role": "assistant",
      "content": "Previous response..."
    }
  ]
}
```

Response (AI):
```json
{
  "is_emergency": false,
  "routed_to": "ai",
  "message": "Period pain is very common and there are several ways to manage it..."
}
```

Response (Consultant):
```json
{
  "is_emergency": false,
  "routed_to": "consultant",
  "consultant_id": "consultant-123",
  "message": "Connected to a live consultant. They will respond shortly."
}
```

Response (Emergency):
```json
{
  "is_emergency": true,
  "routed_to": "emergency",
  "emergency_message": "🚨 URGENT: This sounds like a severe medical emergency...",
  "requires_human": true
}
```

---

## Consultant API

### Consultant Login
**POST** `/api/consultant/login`

Request:
```json
{
  "email": "doctor@herhealth.org",
  "password": "secure_password"
}
```

Response:
```json
{
  "token": "eyJhbGc...",
  "consultant_id": "consultant-123",
  "email": "doctor@herhealth.org"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "status": 400,
  "timestamp": "2024-01-16T14:20:00Z"
}
```

Common status codes:
- `400` - Bad request (missing fields)
- `401` - Unauthorized
- `404` - Not found
- `429` - Rate limited
- `500` - Server error

---

## Rate Limiting

- 10 messages per minute per user
- 100 requests per hour per IP
- Contact support for higher limits

---

## Webhook Events (Coming Soon)

Subscribe to events:
- `message.created`
- `emergency.detected`
- `consultant.assigned`
- `appointment.scheduled`

---

## SDK Usage

### JavaScript/TypeScript
```typescript
import { HerHealthAPI } from '@herhealth/sdk';

const api = new HerHealthAPI({
  baseURL: 'https://api.herhealth.org',
});

// Create user
const user = await api.auth.createUser({
  ageRange: '16-18',
  state: 'Lagos',
});

// Send message
const response = await api.chat.sendMessage({
  userId: user.user_id,
  message: 'I have a question...',
  ageRange: user.age_range,
  state: user.state,
});
```

### Python
```python
from herhealth import HerHealthClient

client = HerHealthClient(api_key='your_api_key')

# Create user
user = client.auth.create_user(
    age_range='16-18',
    state='Lagos'
)

# Send message
response = client.chat.send_message(
    user_id=user['user_id'],
    message='I have a question...',
    age_range=user['age_range'],
    state=user['state']
)
```

---

## Webhook Signature Verification

All webhook events include a signature header:

```
X-HerHealth-Signature: sha256=...
```

Verify with:
```javascript
const crypto = require('crypto');

function verifySignature(payload, signature, secret) {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return hash === signature;
}
```

---

See [README.md](./README.md) for more details.
