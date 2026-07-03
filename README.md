# Terra Kitchen - Modern Indian Restaurant Website

A full-stack restaurant website built with **Node.js**, **Express.js**, **MongoDB**, and **Vanilla JavaScript**. Features real reservations, admin dashboard, and Razorpay payment integration for INR deposits.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Admin Panel](#admin-panel)
- [Deployment](#deployment)
- [Future Enhancements](#future-enhancements)

---

## ✨ Features

### Public Features
- **Dynamic Menu System**: Menu items loaded from database, filterable by category (Appetizers, Mains, Desserts, Drinks)
- **Online Reservations**: Book a table with real-time validation and Razorpay payment integration
- **Contact Form**: Submit inquiries directly from the website
- **Responsive Design**: Fully mobile-responsive (tested at 320px, 375px, 768px, 1024px, 1440px)
- **Smooth Animations**: CSS transitions and scroll reveal effects

### Admin Features
- **Admin Dashboard**: Manage all operations from one place
- **Reservation Management**: View, filter, and update reservation status
- **Menu Management**: Add, edit, delete menu items with image uploads
- **Contact Management**: View and respond to customer inquiries
- **Payment Tracking**: Monitor all reservation payments and deposits

### Technical Features
- **JWT Authentication**: Secure admin login with token-based auth
- **Password Hashing**: bcrypt for secure password storage
- **Rate Limiting**: Prevent spam on reservations and contact forms
- **Input Validation**: Express-validator with centralized error handling
- **MongoDB Indexes**: Optimized queries for admin operations
- **Image Upload**: Multer for secure file uploads with validation

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | HTML5, CSS3, Vanilla JavaScript (ES6) | User interface, no dependencies |
| Backend | Node.js + Express.js | REST API server |
| Database | MongoDB | Data persistence |
| Auth | JWT + bcrypt | Secure authentication |
| Payments | Razorpay | INR payment processing |
| File Upload | Multer | Image management |
| Validation | express-validator | Input validation |
| Rate Limit | express-rate-limit | Spam prevention |

---

## 📁 Project Structure

```
terra-kitchen/
├── server/
│   ├── models/                 # MongoDB schemas
│   │   ├── MenuItem.js
│   │   ├── Reservation.js
│   │   ├── Admin.js
│   │   └── ContactSubmission.js
│   ├── routes/                 # API endpoints
│   │   ├── menu.js
│   │   ├── reservations.js
│   │   ├── admin.js
│   │   └── contact.js
│   ├── controllers/            # Business logic
│   │   ├── menuController.js
│   │   ├── reservationController.js
│   │   ├── adminController.js
│   │   └── contactController.js
│   ├── middleware/             # Express middleware
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   └── validation.js
│   ├── config/                 # Configuration files
│   │   ├── db.js
│   │   ├── razorpay.js
│   │   └── multer.js
│   ├── uploads/                # Menu item images
│   ├── app.js                  # Express app setup
│   └── server.js               # Entry point
├── public/
│   ├── index.html              # Home page
│   ├── admin.html              # Admin panel
│   ├── css/
│   │   ├── style.css
│   │   └── responsive.css
│   ├── js/
│   │   ├── main.js
│   │   ├── menu.js
│   │   ├── reservation.js
│   │   ├── contact.js
│   │   ├── admin.js
│   │   ├── auth.js
│   │   └── utils.js
│   ├── images/                 # Static images
│   └── fonts/                  # Custom fonts
├── .env                        # Environment variables
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v14+ and npm/pnpm
- MongoDB Atlas account (or local MongoDB)
- Razorpay account (for payment testing)

### Step 1: Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd terra-kitchen

# Install dependencies
pnpm install
# or
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/terra_kitchen
JWT_SECRET=your_super_secret_jwt_key_change_in_production_32chars_long
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Step 3: MongoDB Setup

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Add it to `.env` as `MONGODB_URI`

### Step 4: Razorpay Setup

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Get your test keys from Settings → API Keys
3. Add them to `.env` as `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`

### Step 5: Create Admin User (First Time Setup)

```bash
# Start the server
pnpm start
# or
npm start

# Server will be running on http://localhost:5000

# Use the POST /api/admin/users endpoint to create the first admin
# (This should be protected by JWT in production - currently open for setup)
```

Send a POST request to create admin:
```bash
curl -X POST http://localhost:5000/api/admin/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@terrrakitchen.com",
    "password": "your_secure_password"
  }'
```

### Step 6: Start Development Server

```bash
pnpm dev
# or
npm run dev
```

Server runs on `http://localhost:5000`

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
Protected routes require JWT token in header:
```
Authorization: Bearer <token>
```

### Menu Endpoints

#### Get All Menu Items
```
GET /menu
Query: category=Appetizers|Mains|Desserts|Drinks (optional)
```

**Response:**
```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "_id": "...",
      "name": "Samosa",
      "description": "Crispy pastry filled with spiced potatoes",
      "price": 120,
      "category": "Appetizers",
      "image": "/uploads/samosa.jpg",
      "available": true,
      "prepTime": 15,
      "spicyLevel": "Medium",
      "isVegetarian": true
    }
  ]
}
```

#### Create Menu Item (Admin)
```
POST /menu
Headers: Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
```
name: Butter Chicken
description: Creamy tomato-based curry with tender chicken
price: 350
category: Mains
image: <file>
prepTime: 25
spicyLevel: Medium
isVegetarian: false
```

---

### Reservation Endpoints

#### Create Reservation
```
POST /reservations
```

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "date": "2026-07-15T00:00:00Z",
  "time": "19:30",
  "guests": 4,
  "specialRequests": "Window seat preferred"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Reservation created. Please complete payment.",
  "data": {
    "reservation": {
      "_id": "...",
      "status": "Pending",
      "paymentStatus": "Pending",
      "depositAmount": 2000
    },
    "razorpayOrder": {
      "orderId": "order_xxx",
      "amount": 200000,
      "currency": "INR"
    }
  }
}
```

#### Verify Payment
```
POST /reservations/verify-payment
```

**Request:**
```json
{
  "razorpayOrderId": "order_xxx",
  "razorpayPaymentId": "pay_xxx",
  "razorpaySignature": "signature_xxx"
}
```

#### Get All Reservations (Admin)
```
GET /reservations
Headers: Authorization: Bearer <token>
Query: status=Confirmed&date=2026-07-15 (optional)
```

---

### Admin Endpoints

#### Login
```
POST /admin/login
```

**Request:**
```json
{
  "username": "admin",
  "password": "your_password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGc...",
  "admin": {
    "id": "...",
    "username": "admin",
    "email": "admin@terrrakitchen.com",
    "role": "admin"
  }
}
```

#### Verify Token
```
POST /admin/verify-token
Headers: Authorization: Bearer <token>
```

---

### Contact Endpoints

#### Submit Contact Form
```
POST /contact
```

**Request:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "9876543210",
  "message": "I'm interested in catering services for my wedding."
}
```

#### Get All Submissions (Admin)
```
GET /contact
Headers: Authorization: Bearer <token>
Query: status=Unread|Read|Resolved (optional)
```

---

## 👨‍💼 Admin Panel

Access the admin panel at `/admin.html` after logging in.

### Features:
- **Dashboard**: Overview of reservations, contacts, and menu stats
- **Reservations**: View, filter by date/status, and update status
- **Menu Manager**: Add/edit/delete menu items with image uploads
- **Contact Messages**: View and mark customer inquiries as read/resolved
- **Settings**: Change password, view profile

---

## 🌍 Deployment

### Deploy Backend to Render

1. **Create Render Account**
   - Sign up at [render.com](https://render.com)

2. **Create Web Service**
   - Connect your GitHub repository
   - Build command: `npm install`
   - Start command: `npm start`

3. **Set Environment Variables**
   - Add all `.env` variables in Render dashboard

4. **Deploy**
   - Render auto-deploys on push to main branch

### Deploy Frontend

Option A: **Static Files on Render**
- Serve `public/` folder as static files

Option B: **Netlify**
- Deploy `public/` folder directly to Netlify

Option C: **GitHub Pages**
- Push `public/` folder to GitHub Pages

---

## 📊 Database Schema

### MenuItem
```javascript
{
  _id: ObjectId,
  name: String (unique),
  description: String,
  price: Number (in INR),
  category: String (Appetizers|Mains|Desserts|Drinks),
  image: String (URL),
  available: Boolean,
  prepTime: Number (minutes),
  spicyLevel: String (Mild|Medium|Spicy),
  isVegetarian: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Reservation
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String (10 digits),
  date: Date (future date),
  time: String (HH:MM),
  guests: Number (1-20),
  specialRequests: String,
  status: String (Pending|Confirmed|Cancelled),
  paymentStatus: String (Pending|Completed|Failed),
  depositAmount: Number (in INR),
  razorpayOrderId: String,
  razorpayPaymentId: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Security Features

- ✅ **Password Hashing**: bcrypt with 10 salt rounds
- ✅ **JWT Tokens**: 7-day expiration for security
- ✅ **CORS Protection**: Configurable origins
- ✅ **Rate Limiting**: Prevent spam on public endpoints
- ✅ **Input Validation**: All inputs sanitized and validated
- ✅ **SQL Injection Prevention**: MongoDB parameterized queries
- ✅ **File Upload Validation**: Only images, max 5MB
- ✅ **Error Handling**: No sensitive data in error messages

---

## 🎯 Future Enhancements

- [ ] Email notifications for reservations and contact submissions
- [ ] SMS alerts for admin on new reservations
- [ ] Online food ordering with delivery
- [ ] Table availability calendar view
- [ ] Customer reviews and ratings
- [ ] Special events and catering packages
- [ ] Multi-language support
- [ ] Analytics dashboard
- [ ] Push notifications
- [ ] Integration with POS system

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Verify MongoDB Atlas connection string
- Check IP whitelist in MongoDB Atlas (allow all: 0.0.0.0/0 for testing)
- Ensure `.env` file is loaded

### Razorpay Payment Fails
- Use test credentials from Razorpay dashboard
- Test card: 4111 1111 1111 1111 with any future expiry

### Image Upload Not Working
- Check `/uploads` directory has write permissions
- Verify file size < 5MB
- Ensure only image files (JPG, PNG, WebP)

### Admin Login Issues
- Verify admin user exists in MongoDB
- Clear browser localStorage and try again
- Check JWT_SECRET in .env matches server

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Open an issue on GitHub
4. Contact: support@terrrakitchen.com

---

## 📝 License

MIT License - See LICENSE file for details

---

**Built with ❤️ for Terra Kitchen**
