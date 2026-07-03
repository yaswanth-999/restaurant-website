# Terra Kitchen - Architecture & System Design

A comprehensive guide to understanding the project's technical architecture and how all components work together.

---

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                          │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Public Frontend (Vanilla JS)                  │ │
│  │  - index.html (Menu, Reservations, Contact, About)        │ │
│  │  - admin-login.html (Admin authentication)                │ │
│  │  - admin-dashboard.html (Admin control panel)             │ │
│  │                                                            │ │
│  │  CSS: style.css + responsive.css                         │ │
│  │  JS: menu.js, reservation.js, contact.js, auth.js        │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
    ┌──────────────────┐       ┌──────────────────┐
    │  API Requests    │       │  Static Files    │
    │  (JSON)          │       │  (CSS, JS, IMG)  │
    └────────┬─────────┘       └────────┬─────────┘
             │                          │
             └──────────────┬───────────┘
                            │
            ┌───────────────▼───────────────┐
            │                               │
    ┌───────▼────────────────────────┐     │
    │   Express.js Server            │     │
    │   (Node.js Backend)            │     │
    │   Port: 5000                   │     │
    └───────┬────────────────────────┘     │
            │                              │
    ┌───────▼─────────────────────────────┴─────┐
    │         Express Middleware Stack          │
    │  ┌──────────────────────────────────────┐ │
    │  │  1. Static File Middleware           │ │
    │  │  2. JSON Body Parser                 │ │
    │  │  3. URL Encoder                      │ │
    │  │  4. CORS Handler                     │ │
    │  │  5. Rate Limiter (public routes)     │ │
    │  │  6. Validation Middleware            │ │
    │  │  7. Auth Middleware (admin routes)   │ │
    │  │  8. Error Handler                    │ │
    │  └──────────────────────────────────────┘ │
    └────────┬────────────────────────────────────┘
             │
    ┌────────▼───────────────┐
    │   Route Handlers       │
    │  ┌──────────────────┐  │
    │  │ /api/menu        │  │
    │  │ /api/reservations│  │
    │  │ /api/contact     │  │
    │  │ /api/admin/*     │  │
    │  └──────────────────┘  │
    └────────┬───────────────┘
             │
    ┌────────▼──────────────────────────┐
    │   Controllers (Business Logic)    │
    │  ┌──────────────────────────────┐ │
    │  │ - menuController.js          │ │
    │  │ - reservationController.js   │ │
    │  │ - adminController.js         │ │
    │  │ - contactController.js       │ │
    │  └──────────────────────────────┘ │
    └────────┬──────────────────────────┘
             │
    ┌────────▼──────────────────────────┐
    │   Models (Data Schemas)           │
    │  ┌──────────────────────────────┐ │
    │  │ - MenuItem.js                │ │
    │  │ - Reservation.js             │ │
    │  │ - Admin.js                   │ │
    │  │ - ContactSubmission.js       │ │
    │  └──────────────────────────────┘ │
    └────────┬──────────────────────────┘
             │
    ┌────────▼──────────────────────────┐
    │   External Services               │
    │  ┌──────────────────────────────┐ │
    │  │ - MongoDB (Data)             │ │
    │  │ - Razorpay (Payments)        │ │
    │  │ - Multer (File Upload)       │ │
    │  └──────────────────────────────┘ │
    └──────────────────────────────────┘
```

---

## 📁 Detailed Component Breakdown

### 1. Frontend Layer (Client-Side)

#### Static HTML Files
```
public/
├── index.html                 # Main restaurant website
│   ├── Navigation (sticky header with logo)
│   ├── Hero Section (large food image + CTA)
│   ├── Menu Section (dynamic, loaded via API)
│   ├── About Section (restaurant info + image)
│   ├── Location Section (embedded Google Map)
│   ├── Reservations Form (date/time/guests picker)
│   ├── Contact Form (name/email/message)
│   └── Footer (links + hours)
│
├── admin-login.html           # Admin authentication page
│   ├── Login form (username/password)
│   ├── Error messages
│   └── JWT token handling
│
└── admin-dashboard.html       # Admin control panel
    ├── Sidebar Navigation
    ├── Dashboard Tab (statistics, recent reservations)
    ├── Reservations Tab (table, filters, actions)
    ├── Menu Tab (CRUD operations + image upload)
    ├── Messages Tab (contact form submissions)
    └── Settings Tab (logout, profile)
```

#### Styling Layer
```
css/
├── style.css                  # Main stylesheet
│   ├── CSS Variables (colors, spacing, fonts)
│   ├── Base styles (HTML, body, fonts)
│   ├── Component styles (buttons, forms, cards)
│   ├── Layout styles (grid, flexbox)
│   ├── Animation keyframes
│   └── Dark mode support
│
└── responsive.css             # Mobile-first responsive
    ├── Mobile (320px+)
    ├── Tablet (768px+)
    ├── Desktop (1024px+)
    └── Large screens (1440px+)
```

#### JavaScript Layer
```
js/
├── utils.js                   # Helper functions
│   ├── API base URL constant
│   ├── formatCurrency() for INR
│   ├── formatDate() for reservations
│   ├── showNotification() for alerts
│   └── makeRequest() for API calls
│
├── auth.js                    # Authentication helpers
│   ├── getToken() from localStorage
│   ├── setToken() to localStorage
│   ├── isTokenExpired() check
│   ├── logout() function
│   └── apiCall() with Authorization header
│
├── menu.js                    # Menu system
│   ├── fetchMenuItems() from API
│   ├── renderMenuItems() in DOM
│   ├── filterByCategory() logic
│   └── Event listeners for filters
│
├── reservation.js             # Reservation system
│   ├── validateForm() real-time validation
│   ├── createReservation() API call
│   ├── initRazorpay() payment modal
│   ├── verifyPayment() confirmation
│   └── Event listeners for form submission
│
├── contact.js                 # Contact form
│   ├── validateForm() input validation
│   ├── submitForm() to API
│   ├── showSuccess() message
│   └── Event listeners
│
├── admin-dashboard.js         # Admin panel
│   ├── checkAuth() and redirect if not logged in
│   ├── loadReservations() from API
│   ├── renderReservationTable() in UI
│   ├── updateStatus() API call
│   ├── deleteReservation() API call
│   ├── loadMenuItems() from API
│   ├── createMenuItem() with image
│   ├── editMenuItem() update
│   ├── deleteMenuItem() remove
│   ├── loadMessages() contact submissions
│   ├── markAsRead() message status
│   └── Tab switching logic
│
└── main.js                    # Application initialization
    ├── Page detection
    ├── Module loading
    ├── Event delegation setup
    └── Navigation handling
```

---

### 2. Backend Layer (Server-Side)

#### Entry Point
```
server/
├── server.js                  # Application entry point
│   ├── Load environment variables (dotenv)
│   ├── Connect to MongoDB
│   ├── Start Express server
│   ├── Listen on PORT (default 5000)
│   └── Handle graceful shutdown
│
└── app.js                     # Express application setup
    ├── Import middleware
    ├── Import routes
    ├── Configure middleware stack
    ├── Register route handlers
    ├── Configure error handling
    └── Export app for testing
```

#### Middleware Stack
```
middleware/
├── authMiddleware.js          # JWT verification
│   ├── Extract token from header
│   ├── Verify token signature
│   ├── Check expiration
│   ├── Attach user to req object
│   └── Return 401 if invalid
│
├── validation.js              # Input validation rules
│   ├── validateReservation() schema
│   ├── validateContactForm() schema
│   ├── validateMenuItem() schema
│   ├── validateAdminLogin() schema
│   └── Custom validator functions
│
├── rateLimiter.js             # Rate limiting
│   ├── reservationLimiter (5/minute)
│   ├── contactLimiter (3/minute)
│   ├── loginLimiter (10/15minutes)
│   └── IP-based tracking
│
└── errorHandler.js            # Centralized error handling
    ├── Catch all middleware
    ├── Log errors
    ├── Format error response
    ├── Send appropriate status code
    └── Never expose stack traces
```

#### Routes & Controllers
```
routes/
├── menu.js                    # Menu endpoints
│   ├── GET /api/menu
│   ├── GET /api/menu?category=Mains
│   ├── GET /api/menu/:id
│   ├── POST /api/admin/menu (protected)
│   ├── PATCH /api/admin/menu/:id (protected)
│   └── DELETE /api/admin/menu/:id (protected)
│
├── reservations.js            # Reservation endpoints
│   ├── POST /api/reservations (public)
│   ├── POST /api/reservations/verify-payment (public)
│   ├── GET /api/admin/reservations (protected)
│   ├── PATCH /api/admin/reservations/:id (protected)
│   └── DELETE /api/admin/reservations/:id (protected)
│
├── contact.js                 # Contact endpoints
│   ├── POST /api/contact (public, rate-limited)
│   ├── GET /api/admin/contact-submissions (protected)
│   ├── PATCH /api/admin/contact-submissions/:id (protected)
│   └── DELETE /api/admin/contact-submissions/:id (protected)
│
└── admin.js                   # Admin endpoints
    ├── POST /api/admin/login
    ├── POST /api/admin/logout
    └── Other admin operations
```

#### Controllers
```
controllers/
├── menuController.js          # Menu logic
│   ├── getAll() - fetch all items
│   ├── getByCategory() - filter by category
│   ├── getById() - single item
│   ├── create() - new menu item
│   ├── update() - edit item
│   └── delete() - remove item
│
├── reservationController.js   # Reservation logic
│   ├── create() - new reservation
│   ├── getAll() - list reservations
│   ├── updateStatus() - change status
│   ├── verifyPayment() - Razorpay check
│   └── delete() - cancel reservation
│
├── contactController.js       # Contact logic
│   ├── submit() - new message
│   ├── getAll() - list messages
│   ├── markAsRead() - update status
│   └── delete() - remove message
│
└── adminController.js         # Admin logic
    ├── login() - authenticate
    ├── logout() - clear session
    ├── verifyToken() - check JWT
    └── createUser() - new admin
```

#### Database Layer
```
models/
├── MenuItem.js                # Menu schema
│   ├── name: String (required, unique)
│   ├── description: String
│   ├── price: Number (required, >0)
│   ├── category: String (enum: Appetizers, Mains, Desserts, Drinks)
│   ├── image: String (file path)
│   ├── available: Boolean (default: true)
│   ├── prepTime: Number (minutes)
│   ├── spicyLevel: String (Mild, Medium, Spicy)
│   ├── isVegetarian: Boolean
│   ├── timestamps: createdAt, updatedAt
│   └── index on category for fast filtering
│
├── Reservation.js             # Reservation schema
│   ├── name: String (required)
│   ├── email: String (required, valid email)
│   ├── phone: String (required, 10 digits)
│   ├── date: Date (required, no past dates)
│   ├── time: String (required, HH:MM format)
│   ├── guests: Number (required, 1-20)
│   ├── specialRequests: String
│   ├── status: String (Pending, Confirmed, Cancelled)
│   ├── paymentStatus: String (Pending, Completed, Failed)
│   ├── depositAmount: Number (INR)
│   ├── razorpayOrderId: String
│   ├── timestamps: createdAt, updatedAt
│   └── indexes on date, status, email
│
├── Admin.js                   # Admin schema
│   ├── username: String (required, unique)
│   ├── passwordHash: String (bcrypt)
│   ├── email: String
│   ├── role: String (default: "admin")
│   ├── lastLogin: Date
│   ├── timestamps: createdAt, updatedAt
│   ├── Pre-save hook: hash password with bcrypt
│   └── Methods: comparePassword(), generateToken()
│
└── ContactSubmission.js       # Contact schema
    ├── name: String (required)
    ├── email: String (required)
    ├── phone: String (optional)
    ├── message: String (required, min 10 chars)
    ├── status: String (Unread, Read, Resolved)
    ├── timestamps: createdAt, updatedAt
    └── index on status
```

#### Configuration
```
config/
├── db.js                      # MongoDB connection
│   ├── Load MONGODB_URI from .env
│   ├── Connect with Mongoose
│   ├── Handle connection errors gracefully
│   └── Log connection status
│
├── razorpay.js                # Razorpay API setup
│   ├── Initialize Razorpay instance
│   ├── Set API key and secret
│   ├── Export for order creation
│   └── Handle payment verification
│
└── multer.js                  # File upload configuration
    ├── Set destination folder (uploads/)
    ├── Set filename strategy
    ├── Allow only image files
    ├── Set max file size (5MB)
    └── Validate MIME types
```

---

## 🔄 Data Flow Diagrams

### Menu Loading Flow
```
┌─────────────────────┐
│  User visits /      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────────┐
│ Frontend loads index.html            │
│ (renders empty menu container)       │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│ JavaScript initializes               │
│ (main.js calls menu.js)             │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│ GET /api/menu                        │
│ (fetch all menu items)               │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│ Backend routes to menuController    │
│ → getAll() fetches from MongoDB     │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│ Returns JSON array of MenuItem docs  │
│ [{ name, price, category, image }]  │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│ Frontend receives data               │
│ renderMenuItems() creates DOM        │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│ User sees menu with images           │
│ Can filter by category              │
└─────────────────────────────────────┘
```

### Reservation Flow
```
┌──────────────────────────────────┐
│ User fills reservation form      │
│ (name, email, phone, date, etc)  │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│ Frontend validation (utils.js)        │
│ - Check date is future               │
│ - Validate phone format (10 digits)  │
│ - Validate email                     │
│ - Check guest count (1-20)           │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│ POST /api/reservations               │
│ (send reservation data to backend)   │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│ Backend validation (express-validator)│
│ - Repeat all frontend checks        │
│ - Additional server-side checks      │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│ Generate Razorpay order              │
│ - Calculate deposit amount (10%)     │
│ - Create order with Razorpay API    │
│ - Save order ID to reservation      │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│ Return order details to frontend     │
│ { razorpayOrderId, amount }         │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│ Razorpay payment modal opens         │
│ User enters card details             │
│ User confirms payment                │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│ Payment processed by Razorpay        │
│ Test: Card 4111 1111 1111 1111      │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│ Frontend receives payment response    │
│ POST /api/reservations/verify-payment│
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│ Backend verifies payment with         │
│ Razorpay using signature             │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│ Mark reservation as Confirmed        │
│ Save to MongoDB                      │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│ Return success response to frontend  │
│ Show confirmation to user            │
└──────────────────────────────────────┘
```

### Admin Login & Authorization Flow
```
┌─────────────────────────────┐
│ User visits /admin          │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│ Check localStorage for token            │
│ If valid token → redirect to dashboard  │
│ If no token → show login page           │
└──────────┬──────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│ User enters username & password      │
│ POST /api/admin/login                │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│ Backend validates credentials           │
│ Find admin by username                  │
│ Compare password with bcrypt hash       │
└──────────┬───────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│ If valid:                               │
│ - Generate JWT token                   │
│ - Set expiration (7 days)              │
│ - Return token to frontend             │
└──────────┬───────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│ Frontend stores token in localStorage   │
│ Redirects to /admin-dashboard.html     │
└──────────┬───────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│ Dashboard page loads                    │
│ Includes token in all API requests      │
│ Header: Authorization: Bearer <token>   │
└──────────┬───────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│ Backend authMiddleware on each request:  │
│ - Extract token from header             │
│ - Verify JWT signature                  │
│ - Check expiration                      │
│ - Allow/deny request                    │
└──────────────────────────────────────────┘
```

---

## 🔐 Security Architecture

### Authentication Layer
```
┌─────────────────────────────────────────────┐
│            JWT Token System                 │
├─────────────────────────────────────────────┤
│ Generated on: POST /api/admin/login         │
│ Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9 │
│ Secret: JWT_SECRET from .env                │
│ Expires: 7 days                             │
│ Stored: localStorage (browser)              │
│ Transmitted: Authorization header           │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│        Password Security (bcrypt)           │
├─────────────────────────────────────────────┤
│ Hash Algorithm: bcrypt                      │
│ Salt Rounds: 10                             │
│ Storage: MongoDB Admin collection           │
│ Comparison: bcrypt.compare() on login       │
│ Never stored: Plain text passwords          │
└─────────────────────────────────────────────┘
```

### Protected Routes
```
Public Routes (No Auth Required):
  GET    /api/menu                    # Anyone can browse menu
  GET    /api/menu?category=Mains
  POST   /api/reservations            # Anyone can book (payment verified)
  POST   /api/contact                 # Anyone can contact

Protected Routes (JWT Required):
  GET    /api/admin/reservations      # Only admin can view all
  PATCH  /api/admin/reservations/:id  # Only admin can update status
  POST   /api/admin/menu              # Only admin can add menu
  PATCH  /api/admin/menu/:id          # Only admin can edit menu
  DELETE /api/admin/menu/:id          # Only admin can delete menu
```

### Rate Limiting
```
Endpoint                  Limit           Time Window
────────────────────────────────────────────────────
POST /api/reservations    5 requests      1 minute
POST /api/contact         3 requests      1 minute
POST /api/admin/login     10 requests     15 minutes
```

### Input Validation
```
Frontend Level:
  - HTML5 form validation
  - JavaScript validation (real-time)
  - Error messages shown to user

Backend Level:
  - express-validator rules
  - Custom validation functions
  - Database schema validation (Mongoose)
  - Reject invalid data before processing

Examples:
  - Email: Must be valid email format
  - Phone: Must be exactly 10 digits
  - Price: Must be > 0
  - Date: Cannot be in the past
  - Password: Hashed before storage
```

---

## 📊 Database Schema Relationships

```
┌──────────────────┐
│   Admin          │
├──────────────────┤
│ _id              │
│ username (unique)│
│ passwordHash     │
│ email            │
│ role             │
│ createdAt        │
│ updatedAt        │
└──────────────────┘
         │
         │ (logs in and manages)
         │
         ▼
┌──────────────────┐
│  MenuItem        │
├──────────────────┤
│ _id              │
│ name             │
│ description      │
│ price            │
│ category         │
│ image            │
│ available        │
│ prepTime         │
│ spicyLevel       │
│ isVegetarian     │
│ createdAt        │
│ updatedAt        │
└──────────────────┘
         │
         │ (referenced in)
         │
         ▼
┌──────────────────┐
│  Reservation     │
├──────────────────┤
│ _id              │
│ name             │
│ email            │
│ phone            │
│ date             │
│ time             │
│ guests           │
│ specialRequests  │
│ status           │
│ paymentStatus    │
│ depositAmount    │
│ razorpayOrderId  │
│ createdAt        │
│ updatedAt        │
└──────────────────┘
         │
         │
         ▼
┌──────────────────┐
│ ContactSubmission│
├──────────────────┤
│ _id              │
│ name             │
│ email            │
│ phone            │
│ message          │
│ status           │
│ createdAt        │
│ updatedAt        │
└──────────────────┘
```

---

## 🔧 Configuration Management

### Environment Variables
```
.env (Not committed to git)
├── Database Configuration
│   └── MONGODB_URI=mongodb+srv://...
├── Server Configuration
│   ├── PORT=5000
│   └── NODE_ENV=development
├── Authentication
│   ├── JWT_SECRET=<32-char random string>
│   ├── ADMIN_USERNAME=admin
│   └── ADMIN_PASSWORD=<secure password>
├── Payment Integration
│   ├── RAZORPAY_KEY_ID=rzp_test_xxxxx
│   └── RAZORPAY_KEY_SECRET=xxxxx
└── Deployment Configuration
    └── FRONTEND_URL=http://localhost:3000
```

### File Upload Configuration (Multer)
```
Uploads Directory: server/uploads/
Max File Size: 5MB
Allowed MIME: image/jpeg, image/png, image/webp
Filename Strategy: timestamp + original name
Error Handling: Return 400 if size exceeded
```

---

## 🚀 Deployment Architecture

### Local Development
```
http://localhost:5000
  ├── Frontend: /public/* served as static files
  ├── API: /api/* handled by Express routes
  ├── MongoDB: Optional (demo mode if not connected)
  └── Razorpay: Test credentials
```

### Production Deployment
```
┌───────────────────────┐
│  Client Browser       │
│  (Any device)         │
└──────────┬────────────┘
           │
           ▼
┌───────────────────────────────────┐
│  HTTPS / CDN (Cloudflare, etc)   │
└──────────┬────────────────────────┘
           │
           ▼
┌───────────────────────────────────┐
│  Render (Backend + Frontend)      │
│  or Vercel / Netlify (Frontend)   │
└──────────┬────────────────────────┘
           │
           ▼
┌───────────────────────────────────┐
│  Node.js Express Server           │
│  (Your application code)          │
└──────────┬────────────────────────┘
           │
           ├─────────────────────┬─────────────────────┐
           │                     │                     │
           ▼                     ▼                     ▼
    ┌────────────────┐   ┌──────────────┐   ┌────────────────┐
    │ MongoDB Atlas  │   │  Razorpay    │   │  File Storage  │
    │ (Cloud DB)     │   │  (Payments)  │   │  (S3 or Blob)  │
    └────────────────┘   └──────────────┘   └────────────────┘
```

---

## 📈 Scalability Considerations

### Database Optimization
```
Current: MongoDB with basic indexes
├── Index on MenuItem.category (for filtering)
├── Index on Reservation.date (for date queries)
├── Index on Reservation.status (for filtering)
└── Index on Reservation.email (for user lookups)

Future Optimizations:
├── Compound indexes for complex queries
├── Caching layer (Redis) for frequently accessed data
├── Database replication for high availability
└── Connection pooling
```

### API Optimization
```
Current: Basic REST API
├── Rate limiting prevents abuse
├── Validation prevents invalid data
└── Error handling prevents crashes

Future Optimizations:
├── Response caching (Redis)
├── Pagination for large result sets
├── GraphQL for flexible queries
├── API versioning for backward compatibility
```

### Frontend Optimization
```
Current: Vanilla JS, minimal dependencies
├── Lazy loading images
├── CSS animations (GPU accelerated)
└── Local storage for client-side state

Future Optimizations:
├── Service workers for offline support
├── Progressive Web App (PWA)
├── Code splitting for faster load
└── Image optimization (WebP format)
```

---

## 🧪 Testing Architecture

### Manual Testing
```
Level 1: Unit Testing
  ├── Frontend: Form validation, calculations
  ├── Backend: Individual controller functions
  └── Database: Validation rules

Level 2: Integration Testing
  ├── API endpoint tests
  ├── Database operations
  ├── Payment flow (test mode)
  └── Authentication flow

Level 3: System Testing
  ├── Full reservation flow
  ├── Admin panel operations
  ├── Responsive design
  └── Error scenarios
```

### Test Data
```
Test Reservation:
  Name: Test User
  Email: test@example.com
  Phone: 9876543210
  Date: 2024-12-25 (future)
  Time: 19:30
  Guests: 4

Test Payment (Razorpay):
  Card: 4111 1111 1111 1111
  Expiry: Any future date
  CVV: Any 3 digits
  OTP: 123456
```

---

## 📚 Technology Decision Rationale

| Technology | Why Chosen | Alternatives |
|------------|-----------|--------------|
| HTML5/CSS3/Vanilla JS | No dependencies, lightweight | React, Vue, Angular |
| Express.js | Minimal, flexible, popular | Hapi, Fastify, Koa |
| MongoDB | Flexible schema, free tier | PostgreSQL, MySQL, Firebase |
| JWT | Stateless authentication | Sessions, OAuth |
| Bcrypt | Industry standard, proven | Argon2, scrypt |
| Razorpay | INR payments, Indian market | Stripe, PayPal |
| Multer | Simple file uploads | Busboy, Sharp |
| express-validator | Comprehensive, flexible | Joi, Yup |

---

## 🎯 Key Architectural Decisions

1. **No Frontend Framework**: Vanilla JS reduces bundle size and complexity. Perfect for small websites.

2. **REST API**: Simple, standard, cacheable. GraphQL not needed for this use case.

3. **Monolithic Backend**: All features in one server. Microservices would add complexity.

4. **MongoDB**: NoSQL is flexible for restaurant data (menu items, reservations, messages).

5. **JWT for Admin Auth**: Stateless, scalable, works well with SPAs.

6. **Razorpay**: Only Indian payment provider supporting INR with online reservations flow.

7. **Multer for Images**: Simple file upload, stored locally (can be moved to S3/CDN).

8. **Email-less Communication**: Reservation confirmations shown in UI, no email service needed.

---

**This architecture is production-ready, secure, and scalable for a restaurant website of any size.**
