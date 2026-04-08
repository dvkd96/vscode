# 🔌 Subsync API Documentation

## Base URL

```
Development: http://localhost:3000
Production: https://subsync.example.com
```

## Authentication

Include JWT token in Authorization header:

```
Authorization: Bearer <JWT_TOKEN>
```

All protected endpoints require this header.

---

## 📌 Endpoints

### Authentication Endpoints

#### 1. Sign Up

Create a new user account.

```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@college.edu",
  "name": "John Doe",
  "college": "MIT",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@college.edu",
      "name": "John Doe",
      "college": "MIT",
      "role": "user",
      "verified": false,
      "created_at": "2024-04-08T12:00:00Z"
    }
  },
  "message": "User created successfully"
}
```

**Errors:**
- `400` - Invalid email or password
- `400` - Email already registered
- `400` - Passwords do not match

---

#### 2. Login

Authenticate user and get JWT token.

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@college.edu",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@college.edu",
      "name": "John Doe",
      "college": "MIT",
      "role": "user",
      "verified": true
    }
  },
  "message": "Login successful"
}
```

**Errors:**
- `400` - Invalid email or password
- `401` - Invalid credentials

---

### Subscriptions Endpoints

#### 3. List Subscriptions

Get all available subscriptions with pagination and filtering.

```http
GET /api/subscriptions?category=ai&page=1&limit=10
```

**Query Parameters:**
- `category` (optional) - Filter by: `ai`, `ott`, `music`, `productivity`, `learning`
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 10)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "ChatGPT Pro",
      "description": "AI-powered assistant",
      "icon": "🤖",
      "category": "ai",
      "type": "both",
      "features": ["GPT-4", "Advanced features"],
      "created_at": "2024-04-08T12:00:00Z"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10,
  "hasMore": true
}
```

---

### Groups Endpoints

#### 4. List Groups

Get all available groups (managed subscriptions).

```http
GET /api/groups?status=recruiting&page=1&limit=10
```

**Query Parameters:**
- `status` (optional) - Filter by: `recruiting`, `full`, `active`, `expired`
- `page` (optional) - Page number
- `limit` (optional) - Items per page

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "subscription_id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Netflix Sharing - Feb 2024",
      "type": "managed",
      "total_slots": 4,
      "filled_slots": 2,
      "price_per_user": 250,
      "status": "recruiting",
      "subscription_name": "Netflix",
      "subscription_icon": "🎬",
      "created_at": "2024-04-08T12:00:00Z"
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 10,
  "hasMore": true
}
```

---

#### 5. Create Group

Create a new managed subscription group. **[Protected]**

```http
POST /api/groups
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "subscription_id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Netflix Family Plan",
  "total_slots": 4,
  "price_per_user": 300
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "subscription_id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Netflix Family Plan",
    "type": "managed",
    "total_slots": 4,
    "filled_slots": 0,
    "price_per_user": 300,
    "status": "recruiting",
    "created_at": "2024-04-08T12:00:00Z"
  },
  "message": "Group created successfully"
}
```

**Errors:**
- `400` - Missing required fields
- `404` - Subscription not found
- `401` - Unauthorized

---

#### 6. Join Group

Join an existing group and create payment. **[Protected]**

```http
POST /api/groups/{group_id}/join
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "group_id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "550e8400-e29b-41d4-a716-446655440001",
    "payment_required": 300,
    "status": "pending_payment",
    "payment_id": "pay_123456"
  },
  "message": "Successfully joined group"
}
```

---

### Payments Endpoints

#### 7. Create Payment

Initialize Razorpay payment. **[Protected]**

```http
POST /api/payments
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "group_id": "550e8400-e29b-41d4-a716-446655440000",
  "amount": 300,
  "currency": "INR"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "pay_123456",
    "amount": 300,
    "currency": "INR",
    "razorpay_order_id": "order_123456",
    "status": "pending"
  }
}
```

---

#### 8. Verify Payment

Verify Razorpay payment after successful transaction. **[Protected]**

```http
POST /api/payments/{payment_id}/verify
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "razorpay_payment_id": "pay_123456789",
  "razorpay_order_id": "order_123456789",
  "razorpay_signature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "pay_123456",
    "status": "completed",
    "amount": 300,
    "group_id": "550e8400-e29b-41d4-a716-446655440000",
    "access_granted": true
  },
  "message": "Payment verified successfully"
}
```

---

#### 9. Get User Payments

Get payment history. **[Protected]**

```http
GET /api/payments?page=1&limit=10
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "pay_123456",
      "amount": 300,
      "currency": "INR",
      "status": "completed",
      "transaction_id": "txn_123456",
      "group_id": "550e8400-e29b-41d4-a716-446655440000",
      "created_at": "2024-04-08T12:00:00Z"
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 10,
  "hasMore": false
}
```

---

### User Endpoints

#### 10. Get User Profile

Get current user profile. **[Protected]**

```http
GET /api/users/profile
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@college.edu",
    "name": "John Doe",
    "college": "MIT",
    "role": "user",
    "verified": true,
    "rating": 4.5,
    "interests": ["ai", "ott", "music"],
    "created_at": "2024-04-08T12:00:00Z"
  }
}
```

---

#### 11. Update User Profile

Update user information. **[Protected]**

```http
PUT /api/users/profile
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "name": "John Doe Updated",
  "interests": ["ai", "music", "productivity"]
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe Updated",
    "interests": ["ai", "music", "productivity"],
    "updated_at": "2024-04-08T12:30:00Z"
  },
  "message": "Profile updated successfully"
}
```

---

### Dashboard Endpoints

#### 12. Get Dashboard Stats

Get user overview. **[Protected]**

```http
GET /api/dashboard/stats
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "activeGroups": 3,
    "totalSpentOnSubscriptions": 1200,
    "upcomingExpirations": [
      {
        "id": "group_1",
        "name": "Netflix Group",
        "end_date": "2024-05-08T00:00:00Z"
      }
    ],
    "recentPayments": [
      {
        "id": "pay_123456",
        "amount": 300,
        "status": "completed",
        "created_at": "2024-04-08T12:00:00Z"
      }
    ],
    "notifications": [
      {
        "id": "notif_1",
        "type": "payment",
        "message": "Payment received for Netflix Group",
        "created_at": "2024-04-08T12:00:00Z"
      }
    ]
  }
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": "Invalid input data"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "error": "No authorization token"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "error": "Admin access required"
}
```

### 404 Not Found

```json
{
  "success": false,
  "error": "Group not found"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## Rate Limiting

API implements rate limiting:
- **100 requests** per minute per IP address
- Returns `429 Too Many Requests` when exceeded

---

## Pagination

List endpoints support pagination:

```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 10,
  "hasMore": true
}
```

---

## Response Format

All API responses follow this format:

```json
{
  "success": true/false,
  "data": {...},
  "error": "error message",
  "message": "success message"
}
```

---

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## Testing Endpoints

Use tools like Postman, Insomnia, or curl:

```bash
# Example with curl
curl -X GET http://localhost:3000/api/subscriptions \
  -H "Authorization: Bearer <TOKEN>"
```

---

For more details, refer to the source code in `/app/api/` directory.
