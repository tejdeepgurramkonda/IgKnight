# IgKnight - AI Coding Agent Instructions

## Project Overview
IgKnight is a full-stack multiplayer chess platform with dual authentication (local + OAuth2). The system uses real-time WebSocket communication for live chess matches.

**Stack**: Spring Boot 4.0.1 (Java 21) + React 19 + Vite 7 + SQL Server + WebSocket (STOMP)

## Architecture & Component Boundaries

### Backend (IgKnightbackend - Port 8081)
- **Authentication Layer**: Dual-mode auth system supporting both local (BCrypt) and Google OAuth2
  - Local users: provider="local", password required
  - OAuth users: provider="google", password nullable, identified by providerId  
  - JWT tokens (24hr expiration) for stateless session management
- **Chess Engine**: Custom implementation at `chess/engine/` with Board, Position, Move, Piece classes
- **WebSocket Layer**: STOMP over SockJS at `/ws/chess` with JWT authentication in CONNECT headers
  - Topics: `/topic/game/{gameId}`, `/topic/game/{gameId}/move`, `/topic/game/{gameId}/end`, `/topic/game/{gameId}/start`
  - App destinations: `/app/game/{gameId}/move`
- **Data Model**: JPA entities with SQL Server using indexed tables (`chess_games`, `users`)

### Frontend (IgKnightFrontend - Port 5173)
- **Context-based State**: AuthContext (JWT + localStorage), GameContext, SoundContext, ToastContext, ThemeContext
- **WebSocket Hook**: `useGameWebSocket.js` manages STOMP client lifecycle with auto-reconnect
- **API Layer**: Axios interceptors in `services/api.js` inject Bearer tokens and handle 401s automatically
- **Route Protection**: ProtectedRoute/PublicRoute components with loading states

## Critical Developer Workflows

### Running the Application
```bash
# Backend (from IgKnightbackend/)
mvnw spring-boot:run              # Windows
./mvnw spring-boot:run            # Unix/Mac

# Frontend (from IgKnightFrontend/)
npm run dev                       # Starts on localhost:5173
```

### Database Requirements
- **SQL Server** on localhost:1433 with database "IgKnight"
- Uses Windows Integrated Security (`integratedSecurity=true`)
- Schema auto-updated via `spring.jpa.hibernate.ddl-auto=update`
- Key tables: `users` (with provider/providerId), `chess_games` (with FEN/PGN)

### OAuth2 Setup (see OAUTH_SETUP.md)
Google OAuth2 configured in application.properties with these redirect URIs:
- Backend: `http://localhost:8081/login/oauth2/code/google`
- Frontend callback: `/oauth2/redirect?token={jwt}&username={user}&userId={id}`

## Project-Specific Conventions

### Backend Patterns
1. **Dual Authentication Model** (User.java):
   - `provider="local"` requires password (BCrypt), `provider="google"` has nullable password
   - All entities use Jakarta Validation (`@NotBlank`, `@Size`, `@Email`)

2. **Stateless Security** (SecurityConfig.java):
   - JWT-only, no sessions (`SessionCreationPolicy.STATELESS`)
   - CORS configured for localhost:5173 and localhost:3000
   - Public: `/api/auth/**`, `/oauth2/**`, `/ws/**`

3. **WebSocket JWT Authentication** (WebSocketConfig.java):
   - Extracts Bearer token from CONNECT frame headers
   - Manual SecurityContext setup in ChannelInterceptor
   - UserPrincipal creation with userId from JWT payload

### Frontend Patterns  
1. **localStorage Authentication** (AuthContext.jsx):
   - JWT in `token` key, user object in `user` key
   - **Critical**: If userId missing, decodes from JWT payload automatically
   - Auto-logout on token errors

2. **Component-scoped CSS**:
   - Each component has matching CSS file (Board.jsx → Board.css)
   - Dark theme variables: `#0f1419` background, `#4a90e2` accents

3. **Context Providers Hierarchy** (App.jsx):
   - AuthProvider → GameProvider → ToastProvider → SoundProvider → Routes

## Integration Points

### WebSocket Connection Flow
```
useGameWebSocket → SockJS(localhost:8081/ws/chess) → GameWebSocketController
                 ↓ Subscribe to /topic/game/{gameId}/*
                 ↓ Send to /app/game/{gameId}/move
```

### OAuth2 Success Chain  
```
Google Auth → OAuth2LoginSuccessHandler → /oauth2/redirect?token=...&username=...
           → OAuth2Redirect.jsx extracts params → login() → /dashboard
```

### API Error Handling (api.js)
- 401 responses auto-clear localStorage and redirect to `/signin`
- Network errors return standardized `{message: "Network error..."}`
- Bearer token automatically added to all requests

## Key Files Reference
- Auth: [SecurityConfig.java](IgKnightbackend/src/main/java/com/example/IgKnight/config/SecurityConfig.java), [AuthContext.jsx](IgKnightFrontend/src/context/AuthContext.jsx)
- WebSocket: [WebSocketConfig.java](IgKnightbackend/src/main/java/com/example/IgKnight/chess/websocket/WebSocketConfig.java), [useGameWebSocket.js](IgKnightFrontend/src/hooks/useGameWebSocket.js)
- Data: [Game.java](IgKnightbackend/src/main/java/com/example/IgKnight/chess/entity/Game.java), [User.java](IgKnightbackend/src/main/java/com/example/IgKnight/entity/User.java)
- Config: [application.properties](IgKnightbackend/src/main/resources/application.properties), [package.json](IgKnightFrontend/package.json)

## Common Pitfalls
- **OAuth users**: Cannot sign in with password (AuthController blocks this)
- **WebSocket CORS**: Must match SecurityConfig CORS exactly (`localhost:5173`, `localhost:3000`)
- **JWT userId extraction**: Frontend AuthContext automatically decodes missing userId from JWT payload
- **Maven**: Use `mvnw`/`mvnw.cmd`, not global `mvn` command
