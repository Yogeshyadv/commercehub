# Email Verification Setup Guide

## Overview
Email verification has been implemented to ensure users verify their email addresses before accessing the platform. This improves security and ensures valid contact information.

## How It Works

### 1. **Registration Flow**
   - User fills out registration form
   - Backend creates user account with `isEmailVerified: false`
   - Generates a unique 32-byte verification token
   - Sends verification email with clickable link
   - User sees "Check your email" screen (no auto-login)

### 2. **Email Verification**
   - User clicks verification link in email
   - Link format: `http://localhost:5173/verify-email/{token}`
   - Backend validates token and expiration (24 hours)
   - Sets `isEmailVerified: true` on user account
   - Auto-logs in user and redirects to dashboard

### 3. **Login Protection**
   - If user tries to login with unverified email:
     - Login blocked with error message
     - "Resend verification email" button displayed
   - After verification, normal login works

## Backend Configuration

### Required Environment Variables
Add to your `.env` file:

```env
# Email Configuration (Required)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=NextGen B2B <noreply@nextgen.com>
```

### Gmail Setup (Recommended for Development)
1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password:
   - Go to Security → 2-Step Verification → App passwords
   - Select "Mail" and your device
   - Copy the 16-character password
   - Use this as `EMAIL_PASS` in your `.env`

### Alternative Email Providers
- **SendGrid**: Use API key authentication
- **Mailgun**: SMTP or API
- **AWS SES**: Configure SMTP credentials
- **Mailtrap**: For testing (emails trapped, not sent)

## API Endpoints

### POST `/api/v1/auth/register`
Registers user and sends verification email.

**Response:**
```json
{
  "success": true,
  "message": "Registration successful! Please check your email to verify your account.",
  "email": "user@example.com"
}
```

### GET `/api/v1/auth/verify-email/:token`
Verifies email with token and logs in user.

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully! You are now logged in.",
  "token": "jwt_token",
  "user": { ... }
}
```

### POST `/api/v1/auth/resend-verification`
Resends verification email if expired or lost.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification email sent successfully"
}
```

### POST `/api/v1/auth/login`
Login now checks email verification status.

**Error Response (Unverified):**
```json
{
  "success": false,
  "message": "Please verify your email address before logging in",
  "needsVerification": true
}
```

## Frontend Pages

### 1. Register Page (`/register`)
- Shows registration form
- On success: Displays "Check your email" message
- Includes "Register with different email" option

### 2. Email Verification Page (`/verify-email/:token`)
- Shows loading state while verifying
- Success: Auto-redirects to dashboard in 2 seconds
- Error: Shows error with links to login/register

### 3. Login Page (`/login`)
- Shows warning banner if email not verified
- "Resend verification email" button in banner
- Normal login after verification

## Development Mode

If email environment variables are **not configured**, the system will:
- Log verification emails to console instead of sending
- Show verification URL in console output
- Allow manual testing by copying URL to browser

Example console output:
```
📧 Email (Dev Mode): {
  to: 'user@example.com',
  subject: 'Verify Your Email - NextGen B2B',
  text: 'Click this link: http://localhost:5173/verify-email/abc123...'
}
```

## Security Features

1. **Token Hashing**: Verification tokens are SHA256 hashed before storage
2. **Expiration**: Tokens expire after 24 hours
3. **One-Time Use**: Token is deleted after successful verification
4. **Protected Routes**: Dashboard requires verified email + valid JWT

## Testing the Flow

### Manual Test
1. Start backend: `cd Backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Register new account at `http://localhost:5173/register`
4. Check backend console for verification URL (dev mode)
5. Copy verification URL and open in browser
6. Should redirect to dashboard after success

### With Real Email (Production-Ready)
1. Configure Gmail or other SMTP in `.env`
2. Register with real email address
3. Check inbox for verification email
4. Click link in email
5. Should redirect to dashboard

## Troubleshooting

### "Failed to send verification email"
- Check `EMAIL_*` environment variables
- Verify credentials with email provider
- Check firewall/network blocking SMTP port 587
- Try using App Password (Gmail) instead of account password

### "Invalid or expired verification token"
- Token may have expired (24 hours)
- Use "Resend verification email" on login page
- Check if token in URL is complete (no truncation)

### User registered but can't login
- Ensure email is verified first
- Check `isEmailVerified` field in database
- Use resend verification to get new link

### Email not received
- Check spam/junk folder
- Verify `EMAIL_FROM` is valid sender address
- In dev mode, check console for email content
- Try with different email provider

## Database Schema

The User model includes these fields:
```javascript
{
  isEmailVerified: Boolean (default: false),
  emailVerificationToken: String (SHA256 hashed),
  emailVerificationExpire: Date (24 hours from creation)
}
```

## Future Enhancements

Potential improvements:
- Email templates with better styling
- Custom email template builder
- Email verification reminder after 24 hours
- SMS verification as alternative
- Social auth bypass email verification
- Admin panel to manually verify users
- Email verification metrics/analytics
