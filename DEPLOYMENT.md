# Terra Kitchen - Deployment Guide

## ✅ Phase 5: Polish, Testing & Deployment

### Pre-Deployment Checklist

- [ ] All 4 phases complete and tested
- [ ] MongoDB Atlas cluster created
- [ ] Razorpay test account with API keys
- [ ] Environment variables configured
- [ ] Backend API tested with Postman
- [ ] Frontend tested on mobile (320px, 375px, 768px)
- [ ] Admin panel login and dashboard working
- [ ] All CRUD operations verified

---

## 📦 Local Testing

### 1. Start Backend Server

```bash
cd terra-kitchen
pnpm install
pnpm start
```

Server runs on `http://localhost:5000`

### 2. Test API Endpoints with Postman

**Health Check:**
```
GET http://localhost:5000/health
```

**Get Menu Items:**
```
GET http://localhost:5000/api/menu
```

**Admin Login:**
```
POST http://localhost:5000/api/admin/login
{
  "username": "admin",
  "password": "your_password"
}
```

**Get Reservations (with JWT token):**
```
GET http://localhost:5000/api/reservations
Headers: Authorization: Bearer <token>
```

### 3. Test Frontend

Open `http://localhost:5000/public/index.html` in browser

Test:
- [ ] Menu loads and filters work
- [ ] Reservation form validates inputs
- [ ] Contact form validates inputs
- [ ] Mobile responsive (test at 375px)
- [ ] Smooth animations load
- [ ] Images load correctly

### 4. Test Admin Panel

1. Navigate to `/admin-login.html`
2. Login with admin credentials
3. Test dashboard:
   - [ ] Stats display correctly
   - [ ] Recent reservations show
   - [ ] Unread messages show
4. Test Reservations:
   - [ ] Table loads all reservations
   - [ ] Filter by date works
   - [ ] Filter by status works
   - [ ] Update status works
   - [ ] Delete works
5. Test Menu Manager:
   - [ ] Menu items display
   - [ ] Filter by category works
   - [ ] Can edit price
   - [ ] Can delete item
6. Test Messages:
   - [ ] Messages display
   - [ ] Filter by status works
   - [ ] Can view message
   - [ ] Can delete message
7. Test Settings:
   - [ ] Profile info displays
   - [ ] Password change works

---

## 🚀 Deployment Instructions

### Option A: Deploy Backend to Render

#### Step 1: Prepare Repository

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: Terra Kitchen full-stack app"

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/terra-kitchen.git
git push -u origin main
```

#### Step 2: Create Render Account

1. Sign up at [render.com](https://render.com)
2. Connect your GitHub account

#### Step 3: Create Web Service

1. Click "New Web Service"
2. Select your GitHub repository
3. Configure:
   - **Name:** terra-kitchen-api
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (or Paid)

#### Step 4: Add Environment Variables

In Render dashboard, go to Environment:

```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/terra_kitchen
JWT_SECRET=your_super_secret_key_32_chars_minimum
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
NODE_ENV=production
FRONTEND_URL=https://terra-kitchen.vercel.app
```

#### Step 5: Deploy

Render auto-deploys on push to main branch. Wait for build to complete.

Your API URL: `https://terra-kitchen-api.onrender.com`

---

### Option B: Deploy Frontend to Vercel

#### Step 1: Push to GitHub

```bash
git push origin main
```

#### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository
4. Configure:
   - **Framework:** Other
   - **Root Directory:** ./public
   - **Build Command:** (leave empty)
   - **Output Directory:** (leave empty)

#### Step 3: Add Environment Variables

In Vercel dashboard:

```
NEXT_PUBLIC_API_URL=https://terra-kitchen-api.onrender.com/api
NEXT_PUBLIC_RAZORPAY_KEY=rzp_test_...
```

#### Step 4: Deploy

Click "Deploy" and wait for build to complete.

Your Frontend URL: `https://terra-kitchen.vercel.app`

---

### Option C: Deploy Frontend to Netlify

#### Step 1: Create Netlify Account

1. Sign up at [netlify.com](https://netlify.com)
2. Connect GitHub

#### Step 2: Create New Site

1. Click "New site from Git"
2. Select your GitHub repository
3. Configure:
   - **Build command:** (leave empty - static site)
   - **Publish directory:** `public`

#### Step 3: Add Environment Variables

In Netlify dashboard → Site Settings → Build & Deploy:

```
VITE_API_URL=https://terra-kitchen-api.onrender.com/api
VITE_RAZORPAY_KEY=rzp_test_...
```

#### Step 4: Deploy

Netlify auto-deploys on push to main branch.

Your Frontend URL: `https://terra-kitchen.netlify.app`

---

### Option D: Deploy Full Stack to Render (Better)

#### Create `public/js/utils.js` Configuration

Update API URL based on environment:

```javascript
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api'
  : 'https://terra-kitchen-api.onrender.com/api';
```

#### Update `server/app.js` to Serve Static Files

Add after middleware setup:

```javascript
// Serve public folder as static files
app.use(express.static(path.join(__dirname, '../public')));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  }
});
```

Then deploy full stack to Render:
- Single API URL for frontend and backend
- Simpler configuration
- Better performance

---

## 🧪 Post-Deployment Testing

### 1. Test Live API

```bash
curl https://terra-kitchen-api.onrender.com/health
```

### 2. Test Live Frontend

Visit `https://terra-kitchen.vercel.app`

Test:
- [ ] Page loads without errors
- [ ] Menu items load from live API
- [ ] Reservation form works with live Razorpay test keys
- [ ] Admin login redirects to live dashboard
- [ ] All CRUD operations work

### 3. Test Live Admin

1. Go to `/admin-login.html` on live site
2. Login with test admin credentials
3. Verify all dashboard features work

### 4. Monitor Errors

Set up error tracking:

**Option A: Sentry**
```bash
npm install @sentry/node
```

**Option B: Rollbar**
```bash
npm install rollbar
```

**Option C: LogRocket**
```bash
npm install logrocket
```

---

## 📊 Performance Optimization

### Frontend Optimization

```javascript
// Lazy load images
<img loading="lazy" src="..." alt="...">

// Minify CSS/JS
// Use CDN for static assets
// Enable compression

// Add to .htaccess (if on shared hosting)
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/plain
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE application/javascript
</IfModule>
```

### Backend Optimization

```javascript
// MongoDB indexes already created
// Add caching for menu items

const menuCache = {
  data: null,
  expiresAt: null
};

// Implement request caching
```

---

## 🔒 Security Hardening

### 1. Update CORS for Production

```javascript
// In server/app.js
const corsOptions = {
  origin: [
    'https://terra-kitchen.vercel.app',
    'https://terra-kitchen.netlify.app'
  ],
  credentials: true
};

app.use(cors(corsOptions));
```

### 2. Use HTTPS Everywhere

- [ ] Configure SSL/TLS
- [ ] Redirect HTTP to HTTPS
- [ ] Use Render's free SSL (auto)

### 3. Environment Variables

- [ ] Never commit `.env` file
- [ ] Use `.env.example` as template
- [ ] All secrets in production environment

### 4. Rate Limiting

Already configured:
- Reservations: 5/min per IP
- Contact: 3/min per IP
- Login: 10/15min per IP

### 5. Input Validation

All inputs validated with express-validator:
- [ ] Email format
- [ ] Phone format
- [ ] Date validation
- [ ] Length checks

---

## 📈 Monitoring & Analytics

### MongoDB Monitoring

1. Go to MongoDB Atlas Dashboard
2. Monitor:
   - Query performance
   - Storage usage
   - Connection pool

### Render Monitoring

1. Go to Render Dashboard
2. Monitor:
   - CPU usage
   - Memory usage
   - Response times
   - Error logs

### Set Up Email Alerts

**Render:**
- Navigate to dashboard notification settings
- Configure email alerts for deployment failures

**MongoDB:**
- Set up alerts for high disk usage
- Monitor connection errors

---

## 🎯 Maintenance Checklist

### Weekly

- [ ] Review admin dashboard
- [ ] Check pending reservations
- [ ] Respond to contact messages
- [ ] Monitor error logs

### Monthly

- [ ] Review reservation statistics
- [ ] Update menu items if needed
- [ ] Check database storage usage
- [ ] Review performance metrics
- [ ] Backup database

### Quarterly

- [ ] Security audit
- [ ] Update dependencies
- [ ] Performance optimization
- [ ] Review user feedback

---

## 🐛 Troubleshooting Deployment

### Render Deployment Fails

**Check build logs:**
1. Go to Render Dashboard
2. Click on Web Service
3. View build logs
4. Common issues:
   - Missing dependencies
   - Environment variables not set
   - Wrong start command

**Solution:**
```bash
# Test locally
npm install
npm start

# Check all dependencies in package.json
npm list

# Verify environment variables
echo $MONGODB_URI
```

### API Connection Fails

**Check CORS:**
```javascript
// Verify CORS is configured for your frontend URL
// Check browser console for CORS errors
```

**Check MongoDB:**
```bash
# Verify connection string
# Check IP whitelist in MongoDB Atlas
# Test with MongoDB Compass
```

### Frontend Not Loading

**Check static files:**
1. Verify `public/` folder exists
2. Check file paths are correct
3. Verify MIME types are correct
4. Check for 404 errors in browser console

---

## 🚀 Go-Live Checklist

- [ ] Backend deployed and tested
- [ ] Frontend deployed and tested
- [ ] Admin panel working
- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] SSL/HTTPS enabled
- [ ] Error logging set up
- [ ] Performance monitoring enabled
- [ ] Backup strategy implemented
- [ ] Team trained on admin panel
- [ ] Support documentation ready
- [ ] Launch announcement prepared

---

## 📞 Support & Help

**Common Issues:**

1. **"Database connection error"**
   - Verify MongoDB URI
   - Check IP whitelist (0.0.0.0/0 for testing)
   - Test connection string directly

2. **"Razorpay payment fails"**
   - Use test credentials
   - Check amounts are in paise (x100)
   - Test with card: 4111 1111 1111 1111

3. **"Admin can't login"**
   - Check admin user exists in DB
   - Verify JWT_SECRET matches
   - Clear browser localStorage

4. **"Images not loading"**
   - Check upload directory exists
   - Verify file permissions
   - Check image URLs are correct

---

## 📚 Documentation

- README.md - Project overview
- SETUP_GUIDE.md - Local development
- DEPLOYMENT.md - This file
- API_DOCS.md - API endpoints (create separately)

---

**Congratulations! Terra Kitchen is now live and production-ready! 🎉**

For questions or issues, refer to the troubleshooting section or contact the development team.
