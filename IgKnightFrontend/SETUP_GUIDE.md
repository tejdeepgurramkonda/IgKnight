# IgKnight Frontend - Setup Guide

## ✨ What's Been Built

A modern, professionally designed authentication interface with:
- **Dark Blue Chess Theme** - Elegant, eye-catching design
- **Sign In & Sign Up Pages** - Full validation and error handling
- **Google OAuth2** - One-click authentication
- **Protected Dashboard** - User welcome screen
- **Responsive Design** - Works on all devices

## 🎯 Features

### Sign In Page
- Login with username/email and password
- Google OAuth2 button
- Real-time validation
- Beautiful animations and transitions

### Sign Up Page  
- Register with username, email, password, and country
- Password confirmation
- Client-side validation matching backend rules
- Google OAuth2 sign up option

### Dashboard
- Displays user information
- Logout functionality
- Protected route (auto-redirects if not logged in)

## 🚀 How to Run

1. **Make sure backend is running on port 8081**

2. **Start the frontend** (already running):
   ```bash
   npm run dev
   ```

3. **Open browser**: http://localhost:5173

## 🎨 Design Highlights

### Color Palette
- Primary Background: `#0f1419` (Deep dark)
- Cards: `#1a1f2e` (Dark blue)
- Accent: `#4a90e2` (Bright blue)
- Text: `#e8eaed` (Light gray)

### UI Elements
- Smooth fade-in animations
- Gradient buttons with hover effects
- Chess piece logo (♔)
- Animated background patterns
- Modern form inputs with focus states
- Elegant error messages

## 📱 Routes

- `/` → Redirects to `/signin`
- `/signin` → Sign in page
- `/signup` → Sign up page
- `/dashboard` → Protected dashboard (requires auth)
- `/oauth2/redirect` → OAuth callback handler

## 🔐 Authentication Flow

1. User enters credentials or clicks Google button
2. Frontend sends request to `http://localhost:8081/api/auth/*`
3. Backend validates and returns JWT token
4. Token stored in localStorage
5. User redirected to dashboard
6. Token automatically sent with future requests

## 📦 Tech Stack

- **React 19** - UI library
- **Vite 7** - Build tool (super fast!)
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management
- **CSS3** - Custom styling with CSS variables

## 🎯 Next Steps

The authentication is complete! Next you can add:
- Chess game board
- Multiplayer game logic
- User profiles
- Game history
- Leaderboards

---

**Status**: ✅ Authentication fully functional and ready to use!
