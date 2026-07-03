# Terra Kitchen - Setup Guide

## Phase 2 & 3 Complete ✓

### What's Been Built

#### Backend (Phase 2) ✓
- **MongoDB Models**: MenuItem, Reservation, Admin, ContactSubmission with full validation
- **Express API**: 20+ endpoints (public + admin)
- **Authentication**: JWT + bcrypt for secure admin login
- **Payment Integration**: Razorpay for INR deposits
- **File Uploads**: Multer for menu item images
- **Rate Limiting**: Spam prevention on public endpoints
- **Error Handling**: Centralized middleware with validation

#### Frontend (Phase 3) ✓
- **Vanilla HTML5/CSS3/JavaScript**: No frameworks
- **Responsive Design**: Mobile-first, tested at 320px - 1440px+
- **Menu System**: Dynamic loading from API with category filtering
- **Reservation Form**: Real-time validation + Razorpay integration
- **Contact Form**: Rate-limited submission
- **Smooth Animations**: Scroll reveal, hover effects
- **Dark Mode Support**: Prefers-color-scheme media query

---

## Quick Start

### 1. MongoDB Setup
```bash
# Create free cluster at https://www.mongodb.com/cloud/atlas
# Get connection string and add to .env:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/terra_kitchen
```

### 2. Razorpay Setup
```bash
# Get test keys from https://dashboard.razorpay.com
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
```

### 3. Install & Run
```bash
cd terra-kitchen
pnpm install
pnpm start
```

Server: http://localhost:5000
Frontend: http://localhost:5000/public/index.html

### 4. Create Admin User
```bash
curl -X POST http://localhost:5000/api/admin/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@terrrakitchen.com",
    "password": "securepass123"
  }'
```

---

## Testing with Postman

### 1. Get All Menu Items
```
GET /api/menu
```

### 2. Create Reservation
```
POST /api/reservations
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "date": "2026-07-15T00:00:00Z",
  "time": "19:30",
  "guests": 4
}
```

### 3. Admin Login
```
POST /api/admin/login
{
  "username": "admin",
  "password": "securepass123"
}
```

---

## Frontend Configuration

Update `public/js/utils.js` with your API URL:

```javascript
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api'
  : 'https://your-api-domain.com/api';
```

Update Razorpay key in `public/js/reservation.js`:

```javascript
this.rzpKey = 'rzp_test_YOUR_KEY_HERE';
```

---

## File Structure

```
terra-kitchen/
├── server/                 # Backend
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   ├── controllers/       # Business logic
│   ├── middleware/        # Auth, validation, errors
│   ├── config/            # DB, Razorpay, Multer
│   ├── uploads/           # Menu item images
│   └── server.js          # Entry point
├── public/                # Frontend
│   ├── index.html         # Home page
│   ├── admin.html         # Admin login (Phase 4)
│   ├── css/               # Styling
│   ├── js/                # JavaScript
│   └── images/            # Static images
├── .env                   # Environment variables
├── package.json
└── README.md
```

---

## What's Next (Phase 4)

### Admin Panel Features
- [ ] Login page with JWT authentication
- [ ] Dashboard with stats (reservations, contacts, menu)
- [ ] Reservation management (view, filter, update status)
- [ ] Menu management (add/edit/delete with image upload)
- [ ] Contact form management (mark read/resolved)
- [ ] Protected routes with token verification
- [ ] Logout functionality

### Implementation Plan
1. Create admin login page (`admin-login.html`)
2. Build admin dashboard (`admin-dashboard.html`)
3. Implement reservation manager component
4. Build menu manager component
5. Create contact management interface
6. Add token verification on page load
7. Setup logout and session management

---

## Key Points

- ✓ All backend routes tested and working
- ✓ MongoDB schemas with validation
- ✓ Razorpay payment integration (test mode)
- ✓ Frontend fully responsive and accessible
- ✓ Error handling with user-friendly messages
- ✓ No hardcoded data - everything from API
- ✓ Rate limiting on public endpoints
- ✓ Secure admin authentication with JWT

---

## Important Notes

1. **Environment Variables**: Always use `.env` file, never commit secrets
2. **Razorpay Keys**: Use test keys for development
3. **CORS**: Currently open to all origins in development (change for production)
4. **Database Indexes**: Already created for common queries
5. **File Uploads**: Stored in `/server/uploads` directory

---

## Troubleshooting

### Port Already in Use
```bash
lsof -i :5000
kill -9 <PID>
```

### MongoDB Connection Error
- Check connection string format
- Ensure IP whitelist includes your IP (0.0.0.0/0 for testing)
- Test connection string directly in MongoDB compass

### Razorpay Error
- Verify keys are from test environment
- Check amounts are in paise (multiply by 100)
- Test with provided test card: 4111 1111 1111 1111

---

**Next Step**: Proceed to Phase 4 for Admin Panel development
