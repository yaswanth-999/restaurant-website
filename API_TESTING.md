# Terra Kitchen - API Testing Guide

## Postman Setup

### Import Collection
1. Open Postman
2. Click **Import** → **Link**
3. Or manually create requests following this guide

---

## Environment Variables (Postman)

Set these in Postman Environment:

```json
{
  "base_url": "http://localhost:5000",
  "admin_token": "your_jwt_token_here"
}
```

After login, update `admin_token` with the token from response.

---

## Public API Endpoints

### 1. Get All Menu Items
```
GET {{base_url}}/api/menu
```

**Response:**
```json
[
  {
    "_id": "64a7c5f3e8f9b2c4d5e6f7g8",
    "name": "Samosa",
    "description": "Crispy pastry with spiced potato filling",
    "price": 80,
    "category": "Appetizers",
    "image": "/uploads/samosa.jpg",
    "prepTime": 10,
    "spicyLevel": "Medium",
    "isVegetarian": true,
    "available": true
  }
]
```

### 2. Get Menu by Category
```
GET {{base_url}}/api/menu?category=Mains
```

**Query Parameters:**
- `category`: Appetizers | Mains | Desserts | Drinks

### 3. Get Single Menu Item
```
GET {{base_url}}/api/menu/64a7c5f3e8f9b2c4d5e6f7g8
```

### 4. Create Reservation
```
POST {{base_url}}/api/reservations
Content-Type: application/json
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "date": "2026-07-10",
  "time": "19:30",
  "guests": 4,
  "specialRequests": "Window seat preferred"
}
```

**Response:**
```json
{
  "_id": "reservation_id",
  "status": "Pending",
  "paymentStatus": "Pending",
  "razorpayOrderId": "order_2YeWEYWu7V97Nx",
  "depositAmount": 500,
  "message": "Reservation created. Complete payment to confirm."
}
```

**Error Cases:**
- 400: Invalid email format
- 400: Phone must be 10 digits
- 400: Date cannot be in the past
- 400: Guests must be between 1 and 20
- 429: Rate limit exceeded (5 per minute)

### 5. Verify Reservation Payment
```
POST {{base_url}}/api/reservations/verify-payment
Content-Type: application/json
```

**Body:**
```json
{
  "razorpayPaymentId": "pay_2YeWEYWu7V97Nx",
  "razorpayOrderId": "order_2YeWEYWu7V97Nx",
  "razorpaySignature": "signature_string_from_payment"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified. Reservation confirmed!",
  "reservation": {
    "_id": "reservation_id",
    "status": "Confirmed",
    "paymentStatus": "Completed"
  }
}
```

### 6. Check Table Availability
```
GET {{base_url}}/api/availability?date=2026-07-10&time=19:30&guests=4
```

**Response:**
```json
{
  "available": true,
  "availableTables": 3,
  "message": "Table available for 4 guests"
}
```

### 7. Submit Contact Form
```
POST {{base_url}}/api/contact
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "9876543211",
  "message": "I would like to know more about your catering services for events."
}
```

**Response:**
```json
{
  "_id": "submission_id",
  "status": "Unread",
  "message": "Thank you for contacting us. We'll get back to you soon!"
}
```

**Error Cases:**
- 400: Message must be at least 10 characters
- 400: Invalid email format
- 429: Rate limit exceeded (3 per minute)

---

## Admin API Endpoints (Protected)

### Authentication Header
All admin endpoints require:
```
Authorization: Bearer {{admin_token}}
```

### 1. Admin Login
```
POST {{base_url}}/api/admin/login
Content-Type: application/json
```

**Body:**
```json
{
  "username": "admin",
  "password": "Change@123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "_id": "admin_id",
    "username": "admin",
    "email": "admin@terrrakitchen.com",
    "role": "admin"
  }
}
```

**Note:** Copy the `token` value and set it as `admin_token` in Postman environment.

**Error Cases:**
- 400: Username and password required
- 401: Invalid credentials
- 429: Too many login attempts (10 per 15 minutes)

---

## Admin Reservation Management

### Get All Reservations
```
GET {{base_url}}/api/admin/reservations
Authorization: Bearer {{admin_token}}
```

**Response:**
```json
{
  "total": 15,
  "reservations": [
    {
      "_id": "id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "date": "2026-07-10",
      "time": "19:30",
      "guests": 4,
      "status": "Pending",
      "paymentStatus": "Completed",
      "createdAt": "2026-07-03T08:00:00Z"
    }
  ]
}
```

### Filter Reservations
```
GET {{base_url}}/api/admin/reservations?date=2026-07-10&status=Pending
Authorization: Bearer {{admin_token}}
```

**Query Parameters:**
- `date`: YYYY-MM-DD format
- `status`: Pending | Confirmed | Cancelled
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

### Update Reservation Status
```
PATCH {{base_url}}/api/admin/reservations/reservation_id
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

**Body:**
```json
{
  "status": "Confirmed"
}
```

**Valid Status Values:**
- `Pending`
- `Confirmed`
- `Cancelled`

### Delete Reservation
```
DELETE {{base_url}}/api/admin/reservations/reservation_id
Authorization: Bearer {{admin_token}}
```

---

## Admin Menu Management

### Get All Menu Items (Admin View)
```
GET {{base_url}}/api/admin/menu
Authorization: Bearer {{admin_token}}
```

### Create Menu Item
```
POST {{base_url}}/api/admin/menu
Authorization: Bearer {{admin_token}}
Content-Type: multipart/form-data
```

**Form Data:**
- `name` (text): "Butter Chicken"
- `description` (text): "Creamy tomato-based curry with tender chicken"
- `price` (number): 350
- `category` (text): "Mains" (Appetizers|Mains|Desserts|Drinks)
- `prepTime` (number): 20
- `spicyLevel` (text): "Medium" (Mild|Medium|Spicy)
- `isVegetarian` (text): "false" (true|false)
- `image` (file): Upload JPG/PNG (max 5MB)

**Response:**
```json
{
  "_id": "new_menu_id",
  "name": "Butter Chicken",
  "price": 350,
  "category": "Mains",
  "image": "/uploads/1688391600000-butter-chicken.jpg",
  "message": "Menu item created successfully"
}
```

### Edit Menu Item
```
PATCH {{base_url}}/api/admin/menu/menu_id
Authorization: Bearer {{admin_token}}
Content-Type: multipart/form-data
```

**Form Data:** (send only fields you want to update)
- Same as Create, but optional fields

### Delete Menu Item
```
DELETE {{base_url}}/api/admin/menu/menu_id
Authorization: Bearer {{admin_token}}
```

---

## Admin Contact Management

### Get All Contact Submissions
```
GET {{base_url}}/api/admin/contact-submissions
Authorization: Bearer {{admin_token}}
```

**Response:**
```json
{
  "total": 5,
  "submissions": [
    {
      "_id": "submission_id",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "phone": "9876543211",
      "message": "Interested in catering services",
      "status": "Unread",
      "createdAt": "2026-07-03T08:00:00Z"
    }
  ]
}
```

### Filter by Status
```
GET {{base_url}}/api/admin/contact-submissions?status=Unread
Authorization: Bearer {{admin_token}}
```

**Query Parameters:**
- `status`: Unread | Read | Resolved

### Mark as Read/Resolved
```
PATCH {{base_url}}/api/admin/contact-submissions/submission_id
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

**Body:**
```json
{
  "status": "Read"
}
```

### Delete Submission
```
DELETE {{base_url}}/api/admin/contact-submissions/submission_id
Authorization: Bearer {{admin_token}}
```

---

## Common Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "No token provided" or "Invalid token" or "Token expired"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "message": "Too many requests. Please try again later."
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Testing Workflow

### 1. Test Public Endpoints (No Auth)
```bash
# Get menu
curl http://localhost:5000/api/menu

# Create reservation
curl -X POST http://localhost:5000/api/reservations \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com",...}'

# Submit contact
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com",...}'
```

### 2. Test Admin Endpoints
```bash
# Login and get token
TOKEN=$(curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Change@123"}' \
  | jq -r '.token')

# Use token in subsequent requests
curl http://localhost:5000/api/admin/reservations \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Test Razorpay Integration
1. Create reservation with valid data
2. Copy `razorpayOrderId` from response
3. Use Razorpay test card: `4111 1111 1111 1111`
4. Any future expiry date, any CVV
5. Verify payment using verify endpoint

---

## Troubleshooting

### "401 Unauthorized"
- Check if token is copied correctly
- Verify token format: `Bearer <token>`
- Check token expiration (7 days)
- Try logging in again

### "400 Validation Error"
- Check all required fields are provided
- Verify data formats (email, phone, date)
- Check file size for image uploads (max 5MB)
- Verify date is not in the past

### "429 Too Many Requests"
- Wait and retry after rate limit window expires
- Check rate limits:
  - Reservations: 5 per minute
  - Contact: 3 per minute
  - Login: 10 per 15 minutes

### "MongoDB Connection Error"
- Verify MongoDB URI in `.env`
- Check IP whitelist in MongoDB Atlas
- Verify database exists
- Check connection string format

### "Razorpay Error"
- Verify Razorpay keys in `.env`
- Use test keys for development
- Test card: `4111 1111 1111 1111`
- Check amount is in paise (INR)

---

## Performance Tips

1. **Pagination**: Use `limit` and `page` for large datasets
2. **Filtering**: Filter on server, not client
3. **Caching**: Use browser cache for menu items
4. **Batch Operations**: Don't send many individual requests
5. **Connection Pooling**: MongoDB handles this automatically

---

## Security Best Practices

1. **Never expose token**: Keep admin token private
2. **Use HTTPS**: Always in production
3. **Validate input**: Server validates all data
4. **Secure passwords**: Use strong admin password
5. **Rate limiting**: Built-in to prevent abuse
6. **CORS**: Configured to allow only frontend origin

---

## Ready to Test!

Use this guide with **Postman**, **curl**, or any HTTP client to test all endpoints before deployment.

