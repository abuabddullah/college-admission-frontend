# Testing Guide

Complete guide for testing the College Admission Platform.

## Prerequisites

- Application running (frontend and backend)
- Demo account credentials
- API testing tool (Postman, cURL, or VS Code REST Client)

## Quick Test Checklist

### Frontend Testing

- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] Signup creates new account
- [ ] Login with demo account works
- [ ] Browse colleges page displays colleges
- [ ] Search and filter colleges
- [ ] View college details
- [ ] Gallery images display
- [ ] Reviews show correctly
- [ ] Book admission (requires login)
- [ ] View bookings page
- [ ] Profile page displays user info
- [ ] Edit profile works
- [ ] Logout works

### Backend Testing

- [ ] Health check endpoint responds
- [ ] Register new user
- [ ] Login returns JWT token
- [ ] Protected routes require authentication
- [ ] Get all colleges
- [ ] Search colleges
- [ ] Create booking
- [ ] View user bookings
- [ ] Submit review
- [ ] Reviews update college rating

## Detailed Test Scenarios

### 1. User Authentication Flow

**Signup:**
1. Go to `/signup`
2. Fill form: Name, Email, Password
3. Click "Create Account"
4. Should redirect to homepage
5. Header should show user name

**Login:**
1. Go to `/login`
2. Use demo credentials: demo@example.com / password
3. Click "Login"
4. Should redirect to homepage
5. Verify logged in state

**Logout:**
1. Click user menu in header
2. Click "Logout"
3. Should redirect to login
4. Verify logged out state

### 2. College Browsing

**View All Colleges:**
1. Go to `/colleges`
2. Verify colleges display
3. Check images load
4. Verify ratings show

**Search:**
1. Type "Stanford" in search
2. Verify filtered results
3. Clear search
4. Verify all colleges return

**View Details:**
1. Click on any college
2. Verify details page loads
3. Check all tabs (Overview, Gallery, Reviews)
4. Verify gallery images work

### 3. Booking Process

**Create Booking:**
1. Login first
2. Navigate to college details
3. Click "Book Admission"
4. Fill all required fields
5. Submit form
6. Verify redirect to bookings page
7. Verify booking appears in list

**View Bookings:**
1. Go to `/my-bookings`
2. Verify all bookings display
3. Check status badges
4. Verify booking details

### 4. Review System

**Submit Review:**
1. Login first
2. Go to college details
3. Navigate to Reviews tab
4. Select star rating (1-5)
5. Write comment
6. Click "Submit Review"
7. Verify review appears
8. Check college rating updated

**View Reviews:**
1. Go to profile page
2. Click "Reviews" tab
3. Verify your reviews display
4. Check star ratings show correctly

### 5. Profile Management

**View Profile:**
1. Login and go to `/profile`
2. Verify personal info displays
3. Check bookings count
4. Check reviews count

**Edit Profile:**
1. Click "Edit Profile"
2. Update name or phone
3. Click "Save Changes"
4. Verify updates saved
5. Refresh page
6. Verify changes persisted

## API Testing

### Using cURL

**Test Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"password"}'
```

**Test Get Colleges:**
```bash
curl http://localhost:5000/api/colleges
```

**Test Protected Route:**
```bash
# First login and copy the token
TOKEN="your-jwt-token-here"

curl http://localhost:5000/api/bookings \
  -H "Authorization: Bearer $TOKEN"
```

### Using Postman

1. Import `backend/test-api.http` as collection
2. Set base URL: `http://localhost:5000`
3. Run tests in order:
   - Health check
   - Register/Login
   - Save JWT token
   - Test protected routes

### Using VS Code REST Client

1. Install REST Client extension
2. Open `backend/test-api.http`
3. Click "Send Request" above each request
4. Replace placeholders with actual IDs/tokens

## Browser Testing

### Chrome DevTools

1. Open DevTools (F12)
2. Check Console for errors
3. Monitor Network tab for failed requests
4. Verify localStorage contains:
   - `authToken`
   - `currentUser`

### Responsive Design

Test on different screen sizes:
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

## Error Testing

### Test Error Handling

**Invalid Login:**
1. Try wrong password
2. Verify error message shows
3. Form should not clear

**Missing Required Fields:**
1. Try submitting forms with empty fields
2. Verify validation messages
3. Prevent submission

**Network Errors:**
1. Stop backend server
2. Try any API operation
3. Verify error message displays
4. App should not crash

**Invalid Routes:**
1. Navigate to `/invalid-route`
2. Should show 404 or redirect

## Performance Testing

### Load Times
- [ ] Homepage loads < 2s
- [ ] College list loads < 3s
- [ ] Images load progressively
- [ ] No layout shift

### Database Queries
- [ ] Search results < 1s
- [ ] College details < 1s
- [ ] Booking creation < 2s

## Security Testing

### Authentication
- [ ] Cannot access protected routes without login
- [ ] JWT token expires properly
- [ ] Logout clears all auth data

### Authorization
- [ ] Users can only see their own bookings
- [ ] Users can only edit their own reviews
- [ ] Cannot access other users' data

### Input Validation
- [ ] Email format validated
- [ ] Password length enforced
- [ ] Phone number format checked
- [ ] No SQL injection possible
- [ ] XSS prevented

## Automated Testing Scripts

### Backend Health Check
```bash
#!/bin/bash
echo "Testing backend health..."
response=$(curl -s http://localhost:5000/health)
if [[ $response == *"healthy"* ]]; then
  echo "✓ Backend is healthy"
else
  echo "✗ Backend health check failed"
fi
```

### Full API Test
```bash
#!/bin/bash
API_URL="http://localhost:5000"

# Test health
echo "1. Testing health endpoint..."
curl -s "$API_URL/health" | grep "healthy" && echo "✓ Health OK"

# Test colleges
echo "2. Testing colleges endpoint..."
curl -s "$API_URL/api/colleges" | grep "name" && echo "✓ Colleges OK"

# Test login
echo "3. Testing login..."
TOKEN=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"password"}' \
  | jq -r '.token')

if [ "$TOKEN" != "null" ]; then
  echo "✓ Login OK"
  echo "Token: $TOKEN"
else
  echo "✗ Login failed"
fi
```

## Regression Testing

After any code changes, verify:
- [ ] All existing features still work
- [ ] No new console errors
- [ ] API responses unchanged
- [ ] Database queries still work
- [ ] Authentication still secure

## Bug Reporting

When you find a bug:
1. Note the exact steps to reproduce
2. Record expected vs actual behavior
3. Take screenshots if visual
4. Check console for errors
5. Note browser/environment
6. Open GitHub issue with details

## Test Coverage Goals

- [ ] 100% of user flows tested
- [ ] All API endpoints tested
- [ ] Error cases covered
- [ ] Edge cases verified
- [ ] Security vulnerabilities checked
```
