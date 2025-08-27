# Authentication System

## Overview

The authentication system uses HTTP-only cookies for security and provides a complete login/register flow with client-side validation and error handling.

## Features

- **Secure Authentication**: HTTP-only cookies (no localStorage)
- **Client-side Validation**: Real-time form validation with helpful error messages
- **Toast Notifications**: Success and error messages with smooth animations
- **Responsive Design**: Built with our design system components
- **API Integration**: Clean API client with proper error handling

## Components

### Login (`/login`)
- Email and password fields
- Real-time validation
- Error handling with toasts
- Automatic redirect on success

### Register (`/register`)
- Email, password, and confirm password fields
- Strong password requirements
- Password confirmation validation
- Success toast with redirect

## API Endpoints

The system expects these backend endpoints:

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Check authentication status

## Environment Configuration

Create a `.env` file in the `web/` directory:

```bash
VITE_API_URL=http://localhost:4000
```

## Usage

### Basic Flow

1. **Registration**: User creates account → success toast → redirect to `/app`
2. **Login**: User signs in → automatic redirect to `/app`
3. **Authentication**: Cookie is automatically sent with requests

### Form Validation

- **Email**: Required, valid email format
- **Password**: Required, minimum 6 characters, must contain uppercase, lowercase, and number
- **Confirm Password**: Must match password exactly

### Error Handling

- **Client-side**: Real-time validation with inline error messages
- **Server-side**: Toast notifications for API errors
- **Network**: Graceful handling of connection issues

## Security Features

- **HTTP-only Cookies**: Prevents XSS attacks
- **CSRF Protection**: Built-in with proper cookie handling
- **No Local Storage**: Sensitive data never stored in browser
- **Secure Redirects**: Proper navigation after authentication

## Styling

All components use our design system:
- Consistent spacing with CSS variables
- WCAG-compliant color contrast
- Responsive layouts
- Smooth animations and transitions
- Accessible focus states

## Testing

To test the authentication flow:

1. Start the backend server (`npm run dev` in `server/` directory)
2. Start the frontend (`npm run dev` in `web/` directory)
3. Navigate to `/register` to create an account
4. Navigate to `/login` to sign in
5. Check that cookies are set and redirects work properly
