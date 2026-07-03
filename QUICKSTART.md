# Terra Kitchen - Quick Start Guide

A production-ready restaurant website with reservations, menu management, and admin dashboard.

## Local Development Setup (5 minutes)

### Prerequisites
- Node.js 16+ installed
- MongoDB Atlas account (free tier available)
- Razorpay account (for payment testing)

### Step 1: Clone & Install
```bash
# Navigate to project directory
cd terra-kitchen

# Install dependencies
pnpm install
```

### Step 2: Configure Environment
1. Create `.env` file in root (copy from `.env.example` if exists)
2. Add these variables:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/terra-kitchen?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-key-min-32-characters-long

# Admin credentials (for first setup)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Change@123

# Razorpay (get from dashboard.razorpay.com)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx

# Server
PORT=5000
NODE_ENV=development
```

### Step 3: Start Backend
```bash
# Terminal 1: Start Express server
pnpm start
# Server runs at http://localhost:5000
```

### Step 4: Serve Frontend
```bash
# Terminal 2: Serve static files
# Using Python 3
python -m http.server 8000 --directory public

# OR using Node.js http-server
npx http-server public -p 8000
```

**Frontend runs at http://localhost:8000**

---

## Testing Checklist (10 minutes)

### 1. Test Menu (Public)
- [ ] Visit http://localhost:8000
- [ ] Scroll to menu section
- [ ] Filter by category (Appetizers, Mains, Desserts, Drinks)
- [ ] See menu items load from API

### 2. Test Reservation Form
- [ ] Fill in: Name, Email, Phone, Date, Time, Guests
- [ ] Try past date → should error
- [ ] Try invalid phone (less than 10 digits) → should error
- [ ] Submit valid form → shows Razorpay modal
- [ ] **Test Mode**: Use card `4111 1111 1111 1111`, any future date, any CVV
- [ ] After payment success → see confirmation message

### 3. Test Contact Form
- [ ] Scroll to contact section
- [ ] Fill in: Name, Email, Message (min 10 chars)
- [ ] Submit → see success message
- [ ] Try submitting 4 times in 1 minute → should be rate-limited on 4th attempt

### 4. Test Admin Login
- [ ] Visit http://localhost:8000/admin-login.html
- [ ] Login with:
  - Username: `admin`
  - Password: `Change@123`
- [ ] Should redirect to admin dashboard
- [ ] Token stored in localStorage

### 5. Test Admin Dashboard
- [ ] View reservation statistics
- [ ] View reservations table (filter by date/status)
- [ ] View menu items (add/edit/delete)
- [ ] View contact form submissions
- [ ] Mark reservation as Confirmed/Cancelled
- [ ] Delete old reservations

### 6. Test Responsive Design
- [ ] Desktop (1440px): All sections visible, no overflow
- [ ] Tablet (768px): Menu items in 2 columns, form responsive
- [ ] Mobile (375px): Single column, hamburger menu works
- [ ] Mobile (320px): Text readable, buttons clickable

---

## API Testing with Postman

### Import Collection
Create requests with these endpoints:

**Public Endpoints (no auth needed):**
```
GET  http://localhost:5000/api/menu
GET  http://localhost:5000/api/menu?category=Mains
POST http://localhost:5000/api/reservations
POST http://localhost:5000/api/contact
```

**Admin Endpoints (JWT required):**
```
POST   http://localhost:5000/api/admin/login
GET    http://localhost:5000/api/admin/reservations
PATCH  http://localhost:5000/api/admin/reservations/:id
DELETE http://localhost:5000/api/admin/reservations/:id
POST   http://localhost:5000/api/admin/menu (with image upload)
GET    http://localhost:5000/api/admin/contact-submissions
```

### Sample Requests

**1. Login (Get JWT Token)**
```json
POST /api/admin/login
{
  "username": "admin",
  "password": "Change@123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "admin": { "username": "admin", "email": "..." }
}
```

**2. Create Reservation**
```json
POST /api/reservations
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

**3. Get All Menu Items**
```
GET /api/menu
```

**4. Create Menu Item (Admin, with Image)**
```
POST /api/admin/menu
Authorization: Bearer <TOKEN>
Content-Type: multipart/form-data

Fields:
- name: "Butter Chicken"
- description: "Creamy tomato-based curry"
- price: 350
- category: "Mains"
- image: <file upload>
- prepTime: 20
- spicyLevel: "Medium"
- isVegetarian: false
```

---

## Troubleshooting

### "Cannot GET /api/menu"
- [ ] Backend not running? Run `pnpm start`
- [ ] Check port 5000 is accessible
- [ ] Verify MongoDB connection in console logs

### "CORS error on frontend"
- [ ] Backend CORS configured? Check `server/app.js`
- [ ] Frontend making requests to correct URL? Check `utils.js` API_BASE_URL

### "MongoDB connection failed"
- [ ] MongoDB Atlas cluster running?
- [ ] IP whitelist includes your IP: https://cloud.mongodb.com/v2
- [ ] Connection string correct in `.env`?

### "Razorpay modal not showing"
- [ ] Using test credentials? (`rzp_test_...`)
- [ ] Test card: `4111 1111 1111 1111`
- [ ] Check browser console for errors

### "Admin login not working"
- [ ] Check ADMIN_USERNAME and ADMIN_PASSWORD in `.env`
- [ ] Try creating new admin user via script (see below)
- [ ] JWT_SECRET set in `.env`?

---

## Create Admin User (If Needed)

Create `server/scripts/create-admin.js`:

```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const admin = await Admin.create({
      username: 'admin',
      password: 'Change@123',
      email: 'admin@terrrakitchen.com'
    });
    
    console.log('✅ Admin created:', admin.username);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();
```

Run:
```bash
node server/scripts/create-admin.js
```

---

## Next Steps: Deployment

See `DEPLOYMENT.md` for:
- Deploying backend to Render
- Deploying frontend to GitHub Pages/Netlify
- Setting up MongoDB Atlas
- Configuring Razorpay for production

---

## Project Structure
```
terra-kitchen/
├── server/                 # Backend (Express.js)
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   ├── controllers/        # Business logic
│   ├── middleware/         # Auth, validation, error handling
│   ├── config/            # DB, Razorpay, Multer
│   ├── app.js             # Express setup
│   └── server.js          # Entry point
├── public/                # Frontend (Vanilla HTML/CSS/JS)
│   ├── index.html         # Main website
│   ├── admin-login.html   # Admin login
│   ├── admin-dashboard.html # Admin panel
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript
│   └── images/            # Assets
├── .env                   # Environment variables
├── package.json           # Dependencies
└── README.md              # Full documentation
```

---

## Key Features Summary

✅ **Public Website**
- Dynamic menu from MongoDB
- Real-time reservations with Razorpay payments
- Contact form with rate limiting
- Fully responsive (320px-1440px)
- Dark mode support

✅ **Admin Panel**
- JWT-based authentication
- Reservation management (view, update, delete)
- Menu management (CRUD + image upload)
- Contact message viewer
- Statistics dashboard

✅ **Backend Security**
- Bcrypt password hashing
- JWT tokens (7-day expiration)
- Rate limiting (prevent spam)
- Input validation
- Centralized error handling
- CORS protection

✅ **Database**
- MongoDB with full validation
- Indexes for performance
- No hardcoded data

---

**You're ready to test!** Start with Step 1-4 above. 🚀
