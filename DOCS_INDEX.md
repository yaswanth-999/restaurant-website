# Terra Kitchen - Documentation Index

Welcome to Terra Kitchen's complete documentation. This guide will help you navigate all available resources.

## 📖 Documentation Files

### Quick References (Start Here)

1. **[QUICKSTART.md](./QUICKSTART.md)** - 5-Minute Setup
   - Prerequisites and installation
   - Configuration with `.env`
   - Starting the server
   - Quick testing checklist
   - API endpoint examples
   - **Best for**: Getting the project running immediately

2. **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Complete Overview
   - What's been built in all 5 phases
   - Project statistics
   - Technology stack
   - Key features list
   - Current status and next steps
   - **Best for**: Understanding the entire project at a glance

### Detailed Guides

3. **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Comprehensive Setup
   - Step-by-step installation
   - Environment variable configuration
   - MongoDB Atlas setup
   - Razorpay configuration
   - Admin user creation
   - **Best for**: First-time setup with detailed explanations

4. **[README.md](./README.md)** - Full Documentation
   - Project overview and architecture
   - Feature descriptions
   - API endpoint reference
   - Database schema details
   - Troubleshooting guide
   - **Best for**: In-depth project knowledge

5. **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production Deployment
   - Backend deployment to Render
   - Frontend deployment options
   - MongoDB Atlas production setup
   - Razorpay live configuration
   - Domain and SSL setup
   - **Best for**: Getting your site live

6. **[TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)** - QA & Testing
   - Manual testing procedures
   - Test cases for each feature
   - Browser testing guidelines
   - Performance testing
   - Security testing checklist
   - **Best for**: Ensuring everything works before deployment

---

## 🚀 Quick Navigation by Role

### For Developers

**Just Starting?**
1. Read: [QUICKSTART.md](./QUICKSTART.md) (5 min)
2. Run: `pnpm install` then `pnpm start`
3. Visit: `http://localhost:5000`
4. Explore: [API Endpoints](#api-endpoints) below

**Need More Detail?**
1. Review: [SETUP_GUIDE.md](./SETUP_GUIDE.md)
2. Explore: [README.md](./README.md)
3. Check: [Project Structure](#project-structure) below

**Ready to Deploy?**
1. Follow: [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Test using: [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)
3. Monitor: Logs and error tracking

### For Project Managers / Business Users

1. Read: [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Overview of what's built
2. Check: [Key Features](#key-features) section
3. Review: Deployment timeline in [DEPLOYMENT.md](./DEPLOYMENT.md)

### For QA / Testing Team

1. Use: [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md) - Complete test guide
2. Reference: [API Endpoints](#api-endpoints) for manual API testing
3. Check: [Troubleshooting](#troubleshooting) for common issues

### For DevOps / Infrastructure Team

1. Read: [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment instructions
2. Review: Environment variables in [QUICKSTART.md](./QUICKSTART.md)
3. Check: [SETUP_GUIDE.md](./SETUP_GUIDE.md) for database setup

---

## 📚 Project Structure

```
terra-kitchen/
├── Documentation/
│   ├── QUICKSTART.md           ← Start here!
│   ├── PROJECT_SUMMARY.md      ← Project overview
│   ├── SETUP_GUIDE.md          ← Detailed setup
│   ├── README.md               ← Full documentation
│   ├── DEPLOYMENT.md           ← Production guide
│   ├── TESTING_CHECKLIST.md    ← QA guide
│   └── DOCS_INDEX.md           ← This file
│
├── server/                      # Backend (Express.js)
│   ├── models/                 # MongoDB schemas
│   ├── controllers/            # Business logic
│   ├── routes/                 # API endpoints
│   ├── middleware/             # Auth, validation, error handling
│   ├── config/                 # Database, Razorpay, Multer
│   ├── uploads/                # Menu item images
│   ├── app.js                  # Express setup
│   └── server.js               # Entry point
│
├── public/                      # Frontend (Vanilla HTML/CSS/JS)
│   ├── index.html              # Main website
│   ├── admin-login.html        # Admin login page
│   ├── admin-dashboard.html    # Admin interface
│   ├── css/                    # Stylesheets
│   │   ├── style.css
│   │   └── responsive.css
│   ├── js/                     # JavaScript modules
│   │   ├── main.js
│   │   ├── menu.js
│   │   ├── reservation.js
│   │   ├── contact.js
│   │   ├── admin-dashboard.js
│   │   ├── auth.js
│   │   └── utils.js
│   └── images/                 # Food photography
│
├── .env                        # Environment variables (not committed)
├── package.json                # Dependencies
└── .gitignore
```

---

## 🔑 Key Features

### Public Website
- Browse menu with category filtering (Appetizers, Mains, Desserts, Drinks)
- Make reservations with real-time form validation
- Razorpay payment integration for deposits
- Submit contact forms with rate limiting
- View restaurant location and hours
- Dark mode support
- Fully responsive (320px to 1440px)
- Smooth CSS animations

### Admin Dashboard
- Secure login with JWT authentication
- Reservation management (view, update status, delete)
- Menu management (create, edit, delete with image upload)
- Contact message viewer and tracker
- Statistics and overview
- Protected routes with auto-logout

### Backend
- RESTful API with 20+ endpoints
- MongoDB database with full validation
- Bcrypt password hashing
- JWT tokens (7-day expiration)
- Rate limiting on public forms
- Comprehensive error handling
- Graceful degradation (works without MongoDB)

---

## 🛠️ API Endpoints

### Public Endpoints (No Authentication)

```
GET    /api/menu                    # Get all menu items
GET    /api/menu?category=Mains     # Filter by category
GET    /api/menu/:id                # Get single item
POST   /api/reservations            # Create reservation
POST   /api/reservations/verify-payment  # Verify payment
POST   /api/contact                 # Submit contact form
GET    /health                      # Health check
```

### Admin Endpoints (JWT Required)

```
POST   /api/admin/login             # Admin login
GET    /api/admin/reservations      # List reservations
PATCH  /api/admin/reservations/:id  # Update reservation
DELETE /api/admin/reservations/:id  # Delete reservation
GET    /api/admin/menu              # List menu items
POST   /api/admin/menu              # Create menu item
PATCH  /api/admin/menu/:id          # Update menu item
DELETE /api/admin/menu/:id          # Delete menu item
GET    /api/admin/contact-submissions  # List messages
PATCH  /api/admin/contact-submissions/:id  # Update message
```

See [QUICKSTART.md](./QUICKSTART.md) for detailed request examples with payloads.

---

## ⚙️ Environment Variables

Required variables in `.env`:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/terra-kitchen

# Server
PORT=5000
NODE_ENV=development

# Authentication
JWT_SECRET=your-secret-key-here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Change@123

# Payments
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

# CORS
FRONTEND_URL=http://localhost:3000
```

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed configuration.

---

## 🚀 Getting Started (Condensed)

### 1. Install & Setup (2 minutes)
```bash
cd terra-kitchen
pnpm install
# Create .env file with variables from QUICKSTART.md
```

### 2. Start Server (1 minute)
```bash
pnpm start
# Server runs on http://localhost:5000
```

### 3. Visit Website (1 minute)
```
Frontend: http://localhost:5000
Admin:    http://localhost:5000/admin
Health:   http://localhost:5000/health
```

### 4. Test Features (5 minutes)
- Browse menu
- Try reservation form
- Submit contact form
- Login to admin
- Manage reservations

See [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md) for complete test plan.

---

## 🐛 Troubleshooting

### Common Issues

**Server won't start**
- Check port 5000 is available
- Verify Node.js version (16+)
- Check `.env` file exists
- See [SETUP_GUIDE.md](./SETUP_GUIDE.md#troubleshooting)

**API returns 404**
- Ensure server is running
- Check endpoint URL spelling
- Verify request method (GET, POST, etc.)
- See [QUICKSTART.md](./QUICKSTART.md#api-testing-with-postman)

**Admin login fails**
- Check ADMIN_USERNAME and ADMIN_PASSWORD in `.env`
- Verify JWT_SECRET is set
- See [SETUP_GUIDE.md](./SETUP_GUIDE.md#admin-user-creation)

**Razorpay payment fails**
- Use test credentials in development
- Check test card: `4111 1111 1111 1111`
- See [QUICKSTART.md](./QUICKSTART.md#razorpay-integration)

**MongoDB connection error**
- Check MONGODB_URI in `.env`
- Verify IP whitelist in MongoDB Atlas
- Server runs in demo mode without connection
- See [SETUP_GUIDE.md](./SETUP_GUIDE.md#mongodb-atlas)

**Frontend not loading**
- Verify server is running (`pnpm start`)
- Check static file serving in `server/app.js`
- Try different port if 5000 is in use

See [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md#troubleshooting) for more solutions.

---

## 📊 Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Frontend | HTML5, CSS3, Vanilla JS | No frameworks, lightweight |
| Backend | Node.js, Express.js | REST API server |
| Database | MongoDB | NoSQL data storage |
| Auth | JWT + bcrypt | Secure authentication |
| Payments | Razorpay | INR payment processing |
| File Upload | Multer | Menu item images |
| Validation | express-validator | Input validation |
| Rate Limit | express-rate-limit | Spam prevention |
| CORS | cors | Cross-origin requests |

---

## 📈 Next Steps

1. **Immediate** (Today)
   - Follow [QUICKSTART.md](./QUICKSTART.md) to get running
   - Test all features locally

2. **Short-term** (This Week)
   - Setup MongoDB Atlas
   - Get Razorpay credentials
   - Run [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)

3. **Medium-term** (This Month)
   - Deploy backend to Render
   - Deploy frontend to GitHub Pages/Netlify
   - Go live with [DEPLOYMENT.md](./DEPLOYMENT.md)

4. **Long-term** (Future Enhancements)
   - Email notifications
   - User accounts
   - Advanced analytics
   - Multi-language support

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed timeline.

---

## 📞 Support & Help

1. **For setup issues** → [SETUP_GUIDE.md](./SETUP_GUIDE.md)
2. **For testing questions** → [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)
3. **For deployment help** → [DEPLOYMENT.md](./DEPLOYMENT.md)
4. **For API details** → [README.md](./README.md)
5. **For quick start** → [QUICKSTART.md](./QUICKSTART.md)

---

## ✅ Project Status

All 5 project phases are complete:

- Phase 1: Scope ✅
- Phase 2: Backend ✅
- Phase 3: Frontend ✅
- Phase 4: Admin Panel ✅
- Phase 5: Deployment ✅

The project is **production-ready** with security best practices, comprehensive validation, and proper error handling.

---

## 📝 File Summary

| File | Size | Purpose |
|------|------|---------|
| QUICKSTART.md | ~7 KB | Quick start guide |
| SETUP_GUIDE.md | ~5 KB | Detailed setup |
| README.md | ~13 KB | Full documentation |
| DEPLOYMENT.md | ~11 KB | Deployment guide |
| TESTING_CHECKLIST.md | ~15 KB | QA checklist |
| PROJECT_SUMMARY.md | ~17 KB | Project overview |
| DOCS_INDEX.md | This file | Documentation index |

**Total documentation**: ~70 KB of comprehensive guides

---

**Start with [QUICKSTART.md](./QUICKSTART.md) → You'll be up and running in 5 minutes!**

For questions, refer to the appropriate documentation file above.

Built with ❤️ for Terra Kitchen - Modern Indian Cuisine
