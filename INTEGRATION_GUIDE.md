# Frontend-Backend Integration Guide

## Overview
This document outlines the complete integration between the React frontend and Express.js backend for the Carpooling System.

## Changes Made

### 1. **API Service Configuration** (`frontend/services/api.js`)
- ✅ Updated base URL from `5000` to `8000` (backend port)
- ✅ Added comprehensive API methods for:
  - **Authentication**: register, login, getMe
  - **Rides**: createRide, searchRides, getMyRides, getRideById
  - **Bookings**: createBooking, getMyBookings, getBookingById, cancelBooking
  - **Payments**: createPayment, verifyPayment, getPaymentHistory
- ✅ Added request/response interceptors for:
  - Automatic JWT token attachment to headers
  - 401 error handling with auto-logout
  - Error handling and redirection

### 2. **Authentication Context** (`frontend/src/context/AuthContext.js`)
- ✅ Integrated with backend API for:
  - User registration (calls `POST /api/auth/register`)
  - User login (calls `POST /api/auth/login`)
  - Auto-logout on 401 errors
  - JWT token storage and management
- ✅ Added error handling with proper error messages
- ✅ Added `register` method for signup flow

### 3. **Login Page** (`frontend/src/pages/Login.jsx`)
- ✅ Updated to use `useAuth` hook
- ✅ Now calls backend API for authentication
- ✅ Real API error handling

### 4. **Signup Page** (`frontend/src/pages/Signup.jsx`)
- ✅ Updated to use `useAuth` hook with register method
- ✅ Calls backend API for user registration
- ✅ Proper async/await error handling

### 5. **Ride Search** (`frontend/src/pages/BookRide.js`)
- ✅ Updated to call `rideAPI.searchRides()` 
- ✅ Passes search results to results page
- ✅ Async search with loading state

### 6. **Ride Results** (`frontend/src/pages/RideResults.js`)
- ✅ Updated to fetch from API if not passed via state
- ✅ Handles loading and error states
- ✅ Falls back to API search if data not in state

### 7. **My Rides** (`frontend/src/pages/MyRides.js`)
- ✅ Updated to fetch data from API on mount
- ✅ Calls both `rideAPI.getMyRides()` and `bookingAPI.getMyBookings()`
- ✅ Requires user authentication

## Backend Configuration

### Create `.env` file in backend directory
```
PORT=8000
MONGODB_URI=mongodb://localhost:27017/carpooling
JWT_SECRET=your_jwt_secret_key_change_this
CLIENT_URL=http://localhost:3000
NODE_ENV=development
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### Ensure Backend Dependencies
The backend should have these installed:
- express
- mongoose
- jsonwebtoken
- bcryptjs
- cors
- dotenv

## Running the Application

### 1. Start MongoDB
```bash
# Make sure MongoDB is running locally or update MONGODB_URI
mongod
```

### 2. Start Backend Server
```bash
cd backend
npm install  # if not already done
npm run dev  # runs on port 8000
```

### 3. Start Frontend Development Server
```bash
cd frontend
npm install  # if not already done
npm start    # runs on port 3000
```

## API Endpoints Used

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Rides
- `GET /api/rides/search` - Search rides (query: from, to, date, time, seats)
- `POST /api/rides` - Create new ride (protected)
- `GET /api/rides/my-rides` - Get user's rides (protected)
- `GET /api/rides/:id` - Get ride details

### Bookings
- `POST /api/bookings` - Create booking (protected)
- `GET /api/bookings/my-bookings` - Get user's bookings (protected)
- `GET /api/bookings/:id` - Get booking details (protected)
- `PUT /api/bookings/:id/cancel` - Cancel booking (protected)

## Token Management

### JWT Token Flow
1. User logs in or registers → Backend returns `{token, user}`
2. Token is stored in `localStorage` as `'token'`
3. API interceptor automatically adds `Authorization: Bearer {token}` header
4. On 401 error: token is cleared and user is redirected to login

### Token Storage
- Stored in: `localStorage.getItem('token')`
- Used in: `API.interceptors.request.use()`

## Important Notes

1. **CORS Configuration**: Backend app.js has CORS enabled with `CLIENT_URL` from .env
   ```javascript
   cors({
     origin: process.env.CLIENT_URL,  // http://localhost:3000
     credentials: true,
   })
   ```

2. **Protected Routes**: Any endpoint marked with `(protected)` requires:
   - Valid JWT token in Authorization header
   - User must be logged in

3. **Error Handling**: 
   - 401 errors auto-trigger logout
   - Other errors show user-friendly messages

## Next Steps to Complete Integration

1. **Update OfferRide.js**: Wire up `rideAPI.createRide()` for creating rides
2. **Update BookingFlow.js**: Wire up `bookingAPI.createBooking()` for booking confirmation
3. **Update Payment Pages**: Wire up `paymentAPI` methods for Razorpay integration
4. **Test Full Flow**:
   - Register new user
   - Login
   - Search for rides
   - Book a ride
   - View my rides
   - Offer a ride

## Troubleshooting

### "Cannot POST /api/auth/login"
- Check backend is running on port 8000
- Check routes are properly imported in backend/app.js

### CORS errors
- Ensure `CLIENT_URL=http://localhost:3000` in backend .env
- Check CORS middleware is enabled in app.js

### Token issues
- Check if token is stored in localStorage (DevTools → Application → Storage)
- Check if Authorization header is sent (DevTools → Network → Headers)

### "401 Unauthorized"
- Token may have expired
- User needs to log back in
- Clear localStorage and try again

## Database Schema Notes

The backend should have these collections:
- **users**: name, email, phone, password (hashed), role, createdAt
- **rides**: from, to, date, time, driver (userId), availableSeats, price, amenities
- **bookings**: ride (rideId), passenger (userId), status, createdAt
- **payments**: booking (bookingId), amount, status, razorpayId

Ensure your backend models match these fields for the frontend integration to work properly.
