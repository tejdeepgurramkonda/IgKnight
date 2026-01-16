# IgKnight Chess - Authentication System

A secure chess platform with JWT-based authentication.

## 🚀 Features

- ✅ Secure user authentication (sign in/sign up)
- ✅ BCrypt password hashing
- ✅ JWT token-based authorization
- ✅ Chess-themed, appealing UI
- ✅ Protected routes
- ✅ CORS-enabled backend

## 🛠️ Tech Stack

### Backend
- Java 17+
- Spring Boot 3.x
- Spring Security
- JWT (jjwt)
- SQL Server
- BCrypt password encoder

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Axios
- React Router v6
- Lucide Icons

## 📦 Getting Started

### Backend Setup

1. Navigate to backend directory:
```bash
cd IgKnightbackend
```

2. Configure database in `application.properties` (already configured for SQL Server)

3. Run the application:
```bash
./mvnw spring-boot:run
```

Backend will run on: `http://localhost:8081`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd IgKnightFrontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run on: `http://localhost:5173`

## 🔐 API Endpoints

### Authentication

#### Sign Up
```
POST http://localhost:8081/api/auth/signup
Content-Type: application/json

{
  "username": "player123",
  "email": "player@example.com",
  "password": "securepass123",
  "country": "United States"
}
```

#### Sign In
```
POST http://localhost:8081/api/auth/signin
Content-Type: application/json

{
  "usernameOrEmail": "player123",
  "password": "securepass123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "userId": 1,
  "username": "player123",
  "email": "player@example.com"
}
```

## 🎨 Frontend Pages

- **Sign In** - `/signin` - Login with username/email and password
- **Sign Up** - `/signup` - Create new account with username, email, password, country
- **Dashboard** - `/dashboard` - Protected user dashboard (requires authentication)

## 🔒 Security Features

1. **Password Security**
   - BCrypt hashing with strength 12
   - Passwords never exposed in responses
   - Minimum length validation

2. **JWT Token**
   - 24-hour expiration
   - Secure secret key (256-bit)
   - Stateless authentication
   - Automatic token refresh

3. **CORS Configuration**
   - Configured for frontend origin (localhost:5173)
   - Credentials allowed
   - Secure headers

4. **Route Protection**
   - Public routes: `/api/auth/**`
   - Protected routes: all others require valid JWT

## 🎮 User Experience

- Chess-themed gradient design
- Smooth animations with Framer Motion
- Form validation
- Error handling with user-friendly messages
- Loading states
- Responsive design
- Auto-redirect on authentication

## 📝 Notes

- JWT secret is configured in `application.properties`
- Database auto-creates tables on first run
- Frontend automatically handles token storage and refresh
- Logout clears token and redirects to sign in

## 🚀 Next Steps

- Implement chess game functionality
- Add user profile management
- Create matchmaking system
- Add game history and statistics
- Implement puzzles and learning modules

---

**IgKnight Chess © 2026** - Made with ❤️ by Chess Enthusiasts
