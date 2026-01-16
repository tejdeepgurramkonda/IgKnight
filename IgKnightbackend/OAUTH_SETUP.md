# Google OAuth2 Setup Instructions

## Backend Configuration

### 1. Get Google OAuth2 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure the OAuth consent screen:
   - Application name: IgKnight
   - Authorized domains: localhost
6. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Name: IgKnight Backend
   - Authorized redirect URIs:
     - `http://localhost:8081/login/oauth2/code/google`
     - `http://localhost:8081/api/auth/oauth2/callback/google`

### 2. Update application.properties

Replace the placeholder values in `application.properties`:

```properties
spring.security.oauth2.client.registration.google.client-id=YOUR_ACTUAL_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_ACTUAL_CLIENT_SECRET
```

### 3. Database Update

The User table has been updated with new fields:
- `provider` (VARCHAR) - stores "local" or "google"
- `providerId` (VARCHAR) - stores OAuth provider's user ID
- `password` is now nullable (not required for OAuth users)

Run the application to auto-update the database schema (ddl-auto=update).

### 4. How It Works

1. **User clicks "Sign in with Google"** on frontend
2. Frontend redirects to: `http://localhost:8081/oauth2/authorization/google`
3. User authenticates with Google
4. Google redirects back to backend callback URL
5. Backend creates/updates user in database
6. Backend generates JWT token
7. Backend redirects to frontend with token: `http://localhost:5173/oauth2/redirect?token=JWT_TOKEN&username=USERNAME`
8. Frontend stores token and redirects to dashboard

### 5. API Endpoints

- **Google OAuth Login**: `GET http://localhost:8081/oauth2/authorization/google`
  - Initiates Google OAuth flow
  - No authentication required

- **Traditional SignUp**: `POST http://localhost:8081/api/auth/signup`
  - Creates local account with provider="local"

- **Traditional SignIn**: `POST http://localhost:8081/api/auth/signin`
  - Prevents OAuth users from signing in with password
  - Shows message: "Please sign in with google"

### 6. Security Features

- OAuth users cannot sign in with password
- Local users can link Google account (provider field updated)
- Automatic username generation from email if username exists
- JWT token generated for both OAuth and local authentication
- CORS configured for localhost:5173

### 7. Testing

1. Start the backend: `mvn spring-boot:run`
2. Navigate to: `http://localhost:8081/oauth2/authorization/google`
3. Authenticate with Google
4. You'll be redirected to frontend with JWT token

## Frontend Integration (Next Step)

You'll need to:
1. Add "Sign in with Google" button
2. Create OAuth2 redirect handler page at `/oauth2/redirect`
3. Extract token from URL and store in localStorage
4. Redirect to dashboard

## Troubleshooting

- **Error 401**: Check if OAuth2 client credentials are correct
- **Redirect Error**: Verify redirect URI matches exactly in Google Console
- **Database Error**: Ensure password column is nullable
- **CORS Error**: Check if frontend URL is in CORS allowed origins
