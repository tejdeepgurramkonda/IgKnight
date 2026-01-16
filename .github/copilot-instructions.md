# IgKnight Chess Platform - AI Coding Agent Instructions

## Project Architecture

**Full-stack monorepo** with Spring Boot backend and React/TypeScript frontend for chess platform with dual authentication (JWT + OAuth2).

### Backend: IgKnightbackend/
- **Spring Boot 4.0.1** on Java 21 with Maven
- **Database**: SQL Server with Windows Authentication (`integratedSecurity=true`)
- **Security**: Dual-path authentication (local BCrypt + Google OAuth2) with stateless JWT sessions
- **Port**: 8081

### Frontend: IgKnightFrontend/
- **React 18 + TypeScript** with Vite build tool
- **Styling**: Tailwind CSS 4.x + Framer Motion
- **Port**: 5173 (dev server)

## Critical Developer Workflows

### Running the Application

**Backend:**
```bash
cd IgKnightbackend
./mvnw spring-boot:run  # Windows: mvnw.cmd spring-boot:run
```

**Frontend:**
```bash
cd IgKnightFrontend
npm install  # First time only
npm run dev
```

**Database**: Ensure SQL Server is running locally with `IgKnight` database. Schema auto-creates via `ddl-auto=update`.

### OAuth2 Setup
- Credentials in `IgKnightbackend/OAUTH_SETUP.md` and `application.properties`
- **Critical**: OAuth users (provider != "local") CANNOT sign in with passwords - see `AuthService.signIn()` validation

## Authentication Architecture (Key Integration Point)

### Dual Authentication Paths

1. **Local Auth** (`/api/auth/signup`, `/api/auth/signin`):
   - User entity with `provider="local"`, password required
   - BCrypt(12) hashing in `SecurityConfig`
   - JWT token generation in `JwtUtil` with 24hr expiration

2. **OAuth2 Auth** (`/oauth2/authorization/google`):
   - User entity with `provider="google"`, password nullable
   - OAuth2 flow handled by `OAuth2LoginSuccessHandler` → redirects to frontend with token
   - Username auto-generated from email in `OAuth2UserService.generateUsername()`

### Data Flow (OAuth2 Example)
```
Frontend → GET /oauth2/authorization/google
→ Google auth → Spring Security callback
→ OAuth2LoginSuccessHandler.onAuthenticationSuccess()
→ OAuth2UserService.processOAuth2User()
→ JwtUtil.generateToken()
→ Redirect: http://localhost:5173/oauth2/redirect?token=JWT&username=USER
→ OAuth2Redirect.tsx extracts params → AuthContext.login()
```

## Project-Specific Conventions

### Backend Patterns

**Exception Handling**: Centralized in `GlobalExceptionHandler` with custom exceptions:
- `ResourceAlreadyExistsException` → HTTP 409 (username/email conflicts)
- `AuthenticationException` → HTTP 401 (invalid credentials, OAuth sign-in attempts)
- `MethodArgumentNotValidException` → HTTP 400 with field-specific errors

**Entity Validation**: Jakarta annotations on `User` entity (`@NotBlank`, `@Email`, `@Size`) with `@PrePersist`/`@PreUpdate` for timestamps.

**Security Filter Chain**: `JwtAuthenticationFilter` before `UsernamePasswordAuthenticationFilter`, whitelists `/api/auth/**` and `/oauth2/**`.

**Repository Pattern**: Single method queries like `findByUsernameOrEmail()` for dual login, `existsByUsername()` for conflict checks.

### Frontend Patterns

**API Service Layer**: Centralized `api.ts` Axios instance with interceptors:
- Request: Auto-attach `Bearer ${token}` from localStorage
- Response: Auto-logout on 401, redirect to `/signin`

**Auth Context**: Single source of truth for user state (`AuthContext.tsx`):
- Syncs localStorage (`token`, `user` JSON) with React state
- `useAuth()` hook throws if used outside `<AuthProvider>`

**Component Structure**: Page components in `pages/`, reusable UI in `components/`, services in `services/`.

**TypeScript**: Strict interfaces for API contracts (`AuthResponse`, `SignInData`) mirroring backend DTOs.

## Key Files Reference

- **Security**: [SecurityConfig.java](IgKnightbackend/src/main/java/com/example/IgKnight/config/SecurityConfig.java) - CORS, session policy, OAuth2 config
- **JWT Logic**: [JwtUtil.java](IgKnightbackend/src/main/java/com/example/IgKnight/security/JwtUtil.java) - Token generation/validation with HS256
- **User Entity**: [User.java](IgKnightbackend/src/main/java/com/example/IgKnight/entity/User.java) - Dual provider model (nullable password)
- **OAuth Flow**: [OAuth2LoginSuccessHandler.java](IgKnightbackend/src/main/java/com/example/IgKnight/security/OAuth2LoginSuccessHandler.java) - Frontend redirect with token
- **Frontend API**: [api.ts](IgKnightFrontend/src/services/api.ts) - Axios instance with auth interceptors
- **Auth State**: [AuthContext.tsx](IgKnightFrontend/src/context/AuthContext.tsx) - Global auth state management

## Database Schema Notes

- **users** table with composite indexes on `username` and `email`
- `provider` field distinguishes local vs OAuth2 accounts
- `providerId` stores OAuth provider's user ID (e.g., Google sub claim)
- Password nullable to support OAuth-only accounts

## Common Gotchas

1. **OAuth users cannot use password signin** - `AuthService` explicitly blocks with "Please sign in with google"
2. **CORS origins hardcoded** - `http://localhost:5173` and `http://localhost:3000` only
3. **SQL Server connection** uses Windows Authentication (no username/password in connection string)
4. **JWT secret** is plain string in `application.properties` - derive key via HMAC-SHA256 in `JwtUtil.getSigningKey()`
5. **Frontend OAuth redirect** expects `?token=X&username=Y` query params from backend
