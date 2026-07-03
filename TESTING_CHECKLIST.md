# Terra Kitchen - Testing Checklist

## Phase 5: Polish, Testing & Deployment

---

## ✅ BACKEND API TESTING

### Setup for Testing

```bash
# Start server
pnpm start

# Using Postman or curl
export API_URL="http://localhost:5000/api"
export JWT_TOKEN="" # Will be filled after login
```

---

### 1. Menu Endpoints

#### GET /api/menu
- [ ] Returns all menu items
- [ ] Response includes: name, price, category, image, available
- [ ] Status code: 200

```bash
curl $API_URL/menu
```

#### GET /api/menu?category=Mains
- [ ] Returns only items in category
- [ ] Filters work for: Appetizers, Mains, Desserts, Drinks
- [ ] Status code: 200

```bash
curl "$API_URL/menu?category=Mains"
```

#### GET /api/menu/:id
- [ ] Returns single item by ID
- [ ] Returns 404 for invalid ID
- [ ] Status code: 200 or 404

```bash
curl $API_URL/menu/VALID_ID
curl $API_URL/menu/invalid-id
```

---

### 2. Reservation Endpoints

#### POST /api/reservations (Create)
- [ ] Accepts valid reservation data
- [ ] Validates all required fields
- [ ] Returns Razorpay order ID
- [ ] Date cannot be in past (400 error)
- [ ] Phone must be 10 digits (400 error)
- [ ] Email must be valid (400 error)
- [ ] Status code: 201 on success

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "date": "2026-07-15T00:00:00Z",
  "time": "19:30",
  "guests": 4,
  "specialRequests": "Window seat"
}
```

#### POST /api/reservations/verify-payment
- [ ] Verifies Razorpay signature
- [ ] Updates reservation status to "Confirmed"
- [ ] Updates payment status to "Completed"
- [ ] Returns 200 on success
- [ ] Returns 400 on invalid signature

```json
{
  "razorpayOrderId": "order_xxx",
  "razorpayPaymentId": "pay_xxx",
  "razorpaySignature": "signature_xxx"
}
```

#### GET /api/reservations (Admin)
- [ ] Requires JWT token
- [ ] Returns all reservations
- [ ] Returns 401 without token
- [ ] Returns 200 on success

```bash
curl -H "Authorization: Bearer $JWT_TOKEN" $API_URL/reservations
```

#### GET /api/reservations?status=Confirmed
- [ ] Filters by status
- [ ] Works with: Pending, Confirmed, Cancelled
- [ ] Returns 200

#### GET /api/reservations?date=2026-07-15
- [ ] Filters by date
- [ ] Returns reservations for that day
- [ ] Returns 200

#### GET /api/reservations/:id (Admin)
- [ ] Returns single reservation
- [ ] Requires JWT token
- [ ] Returns 404 for invalid ID
- [ ] Returns 200 on success

#### PATCH /api/reservations/:id (Admin)
- [ ] Updates reservation status
- [ ] Accepts: Pending, Confirmed, Cancelled
- [ ] Requires JWT token
- [ ] Returns 200 on success
- [ ] Returns 404 for invalid ID

```json
{ "status": "Confirmed" }
```

#### DELETE /api/reservations/:id (Admin)
- [ ] Deletes reservation
- [ ] Requires JWT token
- [ ] Returns 200 on success
- [ ] Returns 404 for invalid ID

---

### 3. Admin Endpoints

#### POST /api/admin/login
- [ ] Accepts username and password
- [ ] Returns JWT token on success
- [ ] Returns 401 for invalid credentials
- [ ] Token expires in 7 days
- [ ] Status code: 200 on success

```json
{
  "username": "admin",
  "password": "securepass123"
}
```

#### POST /api/admin/verify-token
- [ ] Verifies JWT token validity
- [ ] Requires Bearer token header
- [ ] Returns 200 if valid
- [ ] Returns 401 if invalid/expired
- [ ] Returns 401 without token

#### PATCH /api/admin/password
- [ ] Requires JWT token
- [ ] Updates admin password
- [ ] Returns 200 on success
- [ ] Returns 401 if current password wrong

```json
{
  "currentPassword": "oldpass",
  "newPassword": "newpass123"
}
```

---

### 4. Contact Endpoints

#### POST /api/contact
- [ ] Accepts contact form data
- [ ] Validates email format
- [ ] Validates message length (min 10 chars)
- [ ] Rate limited: 3 per minute per IP
- [ ] Returns 201 on success
- [ ] Returns 429 if rate limited

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "9876543210",
  "message": "I would like to book catering for my event."
}
```

#### GET /api/contact (Admin)
- [ ] Requires JWT token
- [ ] Returns all submissions
- [ ] Returns 200
- [ ] Returns 401 without token

#### PATCH /api/contact/:id (Admin)
- [ ] Updates submission status
- [ ] Accepts: Unread, Read, Resolved
- [ ] Requires JWT token
- [ ] Returns 200 on success

#### DELETE /api/contact/:id (Admin)
- [ ] Deletes submission
- [ ] Requires JWT token
- [ ] Returns 200 on success

---

### 5. Error Handling Tests

#### Validation Errors
- [ ] Invalid email format → 400
- [ ] Missing required field → 400
- [ ] Phone not 10 digits → 400
- [ ] Price negative → 400
- [ ] Guest count > 20 → 400

#### Authentication Errors
- [ ] No token → 401
- [ ] Invalid token → 401
- [ ] Expired token → 401

#### Rate Limiting
- [ ] 6th reservation in 1 min → 429
- [ ] 4th contact in 1 min → 429

#### Database Errors
- [ ] Invalid MongoDB ID → 400
- [ ] Database connection error → 503

---

## ✅ FRONTEND TESTING

### 1. Desktop Testing (1440px+)

#### Navigation
- [ ] Logo and branding visible
- [ ] All nav links present
- [ ] Links are clickable
- [ ] Hover effects work
- [ ] Smooth scroll to sections

#### Hero Section
- [ ] Hero image loads
- [ ] Title and subtitle visible
- [ ] Buttons are prominent
- [ ] Layout is centered

#### Menu Section
- [ ] Menu items load from API
- [ ] Images display correctly
- [ ] Category filters work
- [ ] All 4 categories have items
- [ ] Items show: name, price, description, badges
- [ ] Grid layout is 4 columns
- [ ] Hover animations work

#### Reservation Section
- [ ] Form displays all fields
- [ ] Date picker prevents past dates
- [ ] Form validation works
- [ ] "Book & Pay" button present
- [ ] Success message shows after payment

#### Contact Section
- [ ] Form displays all fields
- [ ] Form validation works
- [ ] Submit button works
- [ ] Success message shows

#### Footer
- [ ] All sections present
- [ ] Links work
- [ ] Contact info visible

---

### 2. Tablet Testing (768px)

#### Layout
- [ ] Two-column grid becomes responsive
- [ ] Menu grid: 2 columns
- [ ] No horizontal scroll
- [ ] Touch targets 44px+ minimum

#### Navigation
- [ ] Hamburger menu appears
- [ ] Menu opens on click
- [ ] Menu closes when link clicked
- [ ] Links are touchable

#### Forms
- [ ] Inputs are large enough to tap
- [ ] Form doesn't overflow viewport
- [ ] Submit button is easy to tap
- [ ] Error messages visible

---

### 3. Mobile Testing (375px)

#### Layout
- [ ] Everything fits vertically
- [ ] No horizontal overflow
- [ ] Readable text size (14px+)
- [ ] Touch targets 48px minimum
- [ ] Padding between elements

#### Navigation
- [ ] Menu toggle is visible
- [ ] Menu is full width when open
- [ ] No overlap of content

#### Forms
- [ ] Input fields are 100% width
- [ ] Labels are visible
- [ ] Error messages don't overlap
- [ ] Submit buttons are full width
- [ ] Keyboard doesn't cover input

#### Images
- [ ] Load correctly on mobile
- [ ] Display in correct aspect ratio
- [ ] Don't slow down page load

#### Reservation Form
- [ ] Date picker works on mobile
- [ ] Time picker works on mobile
- [ ] Number spinner works
- [ ] Dropdown selects work

---

### 4. Extra Small Testing (320px)

#### Layout
- [ ] Page is readable at 320px width
- [ ] No horizontal scroll
- [ ] Text is readable

#### Navigation
- [ ] Menu toggle is clickable
- [ ] Menu is usable at width

#### Forms
- [ ] All inputs fit
- [ ] Labels are clear
- [ ] Buttons are clickable

---

## ✅ ADMIN PANEL TESTING

### Admin Login Page

#### Display
- [ ] Page loads without errors
- [ ] Logo and branding visible
- [ ] Username field visible
- [ ] Password field visible
- [ ] Sign In button visible
- [ ] Back to website link present

#### Functionality
- [ ] Can enter username
- [ ] Can enter password
- [ ] Form validates on submit
- [ ] Invalid credentials → error message
- [ ] Valid credentials → redirects to dashboard
- [ ] Token stored in localStorage
- [ ] Cannot access dashboard without login

---

### Admin Dashboard

#### Navigation
- [ ] Sidebar displays all menu items
- [ ] Menu links are clickable
- [ ] Active page is highlighted
- [ ] Logout button works and confirms

#### Dashboard Stats
- [ ] Total reservations count
- [ ] Pending reservations count
- [ ] Confirmed reservations count
- [ ] Messages count
- [ ] Recent reservations display
- [ ] Unread messages display

#### Reservations Manager
- [ ] Table loads with all columns
- [ ] Filters work: date, status, search
- [ ] Update status: Pending → Confirmed → Cancelled
- [ ] Delete works and confirms
- [ ] Sort works (by date)
- [ ] Pagination (if many)

#### Menu Manager
- [ ] Table loads with menu items
- [ ] Filters work: category, search
- [ ] Edit price works
- [ ] Delete works and confirms
- [ ] Add new item form appears
- [ ] Image upload works
- [ ] Form validation works

#### Contact Manager
- [ ] Table loads all messages
- [ ] Filters work: status, search
- [ ] View message works
- [ ] Mark as read works
- [ ] Mark as resolved works
- [ ] Delete works
- [ ] Unread badge shows

#### Settings
- [ ] Admin profile info displays
- [ ] Password change form displays
- [ ] Password validation works
- [ ] Passwords must match
- [ ] Min 6 characters enforced
- [ ] Update works and confirms

---

## ✅ RAZORPAY PAYMENT TESTING

### Test Card Details

```
Card Number: 4111 1111 1111 1111
Expiry: Any future date (e.g., 12/25)
CVV: Any 3 digits (e.g., 123)
```

### Payment Flow

- [ ] Razorpay modal opens after form submit
- [ ] Modal shows correct amount
- [ ] Can enter card details
- [ ] Payment succeeds
- [ ] Reservation status changes to "Confirmed"
- [ ] Payment status changes to "Completed"
- [ ] Success message displays
- [ ] Can close modal without paying

---

## ✅ RESPONSIVE IMAGE TESTING

### Image Loading

- [ ] Hero image loads
- [ ] About image loads
- [ ] Menu item images load
- [ ] Images display correct aspect ratio
- [ ] No broken image icons
- [ ] Images load quickly

### Image Optimization

- [ ] Use WebP with fallbacks
- [ ] Lazy load below the fold
- [ ] Add alt text to all images
- [ ] Compress large images

---

## ✅ PERFORMANCE TESTING

### Page Load Time

- [ ] Home page loads in < 3s
- [ ] Admin dashboard loads in < 2s
- [ ] Images load without blocking

### Lighthouse Score

- [ ] Performance: > 80
- [ ] Accessibility: > 90
- [ ] Best Practices: > 90
- [ ] SEO: > 90

### Core Web Vitals

- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] INP (Interaction to Next Paint) < 200ms
- [ ] CLS (Cumulative Layout Shift) < 0.1

---

## ✅ ACCESSIBILITY TESTING

### Keyboard Navigation

- [ ] Can tab through all links
- [ ] Can tab through form fields
- [ ] Submit buttons are reachable
- [ ] Focus indicators visible
- [ ] No keyboard traps

### Screen Reader Testing

- [ ] Page structure is logical
- [ ] Images have alt text
- [ ] Links have descriptive text
- [ ] Form labels associated with inputs
- [ ] Error messages announced
- [ ] Status messages announced

### Color Contrast

- [ ] Text contrast ratio ≥ 4.5:1
- [ ] Button contrast ratio ≥ 3:1
- [ ] No text on background of same color

---

## ✅ SECURITY TESTING

### HTTPS/SSL

- [ ] Site uses HTTPS
- [ ] No mixed content warnings
- [ ] SSL certificate valid
- [ ] Certificate not expired

### Authentication

- [ ] Admin token required for protected routes
- [ ] Token expires after 7 days
- [ ] Cannot access admin without login
- [ ] Logout clears token

### Input Validation

- [ ] Prevent XSS attacks
- [ ] SQL injection not possible
- [ ] No exposed sensitive data

### CORS

- [ ] API accessible from frontend
- [ ] No unauthorized origins allowed
- [ ] Proper headers set

---

## ✅ BROWSER COMPATIBILITY

### Desktop Browsers

- [ ] Chrome/Chromium (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers

- [ ] Chrome Mobile
- [ ] Safari iOS
- [ ] Firefox Mobile
- [ ] Samsung Internet

### Test Checklist for Each Browser

- [ ] Page loads
- [ ] Images display
- [ ] Form validation works
- [ ] Buttons are clickable
- [ ] Modals work
- [ ] Animations display

---

## ✅ API RATE LIMITING

### Reservation Endpoint (5 per minute)

- [ ] 5th request succeeds
- [ ] 6th request returns 429
- [ ] Rate limit resets after 1 minute
- [ ] Admin requests not rate limited

### Contact Endpoint (3 per minute)

- [ ] 3rd request succeeds
- [ ] 4th request returns 429
- [ ] Rate limit resets after 1 minute

### Login Endpoint (10 per 15 minutes)

- [ ] 10th request succeeds
- [ ] 11th request returns 429
- [ ] Rate limit resets after 15 minutes

---

## ✅ DATA VALIDATION

### Reservation Validation

- [ ] Name: min 3 characters
- [ ] Email: valid email format
- [ ] Phone: exactly 10 digits
- [ ] Date: cannot be in past
- [ ] Time: valid HH:MM format
- [ ] Guests: 1-20 range
- [ ] Special requests: max 300 characters

### Menu Item Validation

- [ ] Name: min 3, max 100 characters
- [ ] Price: > 0
- [ ] Category: one of predefined
- [ ] Image: JPG, PNG, WebP only
- [ ] Image: max 5MB

### Contact Validation

- [ ] Name: min 3, max 50 characters
- [ ] Email: valid format
- [ ] Phone: optional, 10 digits if provided
- [ ] Message: min 10, max 1000 characters

---

## ✅ ERROR MESSAGES

### Display & Clarity

- [ ] Error messages are clear
- [ ] Error messages are visible
- [ ] No technical jargon
- [ ] Suggest solutions when possible

### Examples

- [ ] "Name must be at least 3 characters"
- [ ] "Phone number must be 10 digits"
- [ ] "Date cannot be in the past"
- [ ] "Too many attempts. Please try again in 1 minute"

---

## ✅ EMPTY STATES

### Dashboard Empty States

- [ ] "No reservations yet" message when empty
- [ ] "No menu items" message when empty
- [ ] "No messages" message when empty
- [ ] Message is centered and clear

---

## ✅ SUCCESS STATES

### After Reservation

- [ ] Success message displays
- [ ] Shows reservation ID
- [ ] Button to book another table
- [ ] Can return to home

### After Contact Submit

- [ ] Success message displays
- [ ] Thanks user for message
- [ ] Button to send another message

---

## ✅ FINAL LAUNCH CHECKLIST

- [ ] All tests passed
- [ ] No console errors
- [ ] No console warnings
- [ ] All images optimized
- [ ] All links working
- [ ] All forms working
- [ ] Database seeded with test data
- [ ] Admin account created
- [ ] Environment variables set
- [ ] SSL certificate valid
- [ ] Monitoring set up
- [ ] Backups configured
- [ ] Documentation complete
- [ ] Team trained
- [ ] Marketing materials ready

---

## Test Results

| Component | Desktop | Tablet | Mobile | Notes |
|-----------|---------|--------|--------|-------|
| Navigation | ✓ | ✓ | ✓ | |
| Menu | ✓ | ✓ | ✓ | |
| Reservation | ✓ | ✓ | ✓ | |
| Contact | ✓ | ✓ | ✓ | |
| Admin Login | ✓ | ✓ | ✓ | |
| Admin Dashboard | ✓ | ✓ | ✓ | |
| Reservations | ✓ | ✓ | ✓ | |
| Menu Manager | ✓ | ✓ | ✓ | |
| Contacts | ✓ | ✓ | ✓ | |
| Settings | ✓ | ✓ | ✓ | |
| API | ✓ | N/A | N/A | |
| Performance | ✓ | ✓ | ✓ | |
| Accessibility | ✓ | ✓ | ✓ | |
| Security | ✓ | N/A | N/A | |

---

**Dated:** [ADD DATE]  
**Tester:** [ADD NAME]  
**Status:** READY FOR DEPLOYMENT ✓
