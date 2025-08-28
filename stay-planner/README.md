# Stay Planner

A full-stack web application for planning and managing stays, built with modern JavaScript technologies.

## Tech Stack

### Backend (Server)
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **Morgan** - HTTP request logger middleware

### Frontend (Web)
- **React 18** - User interface library
- **Vite** - Build tool and development server
- **JavaScript** - Programming language (ES6+)

## Project Structure

```
stay-planner/
├── server/          # Backend API server
├── web/            # Frontend React application
├── package.json    # Root package with workspaces
└── README.md       # This file
```

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

## Installation

Install all dependencies for both workspaces:

```bash
npm run install-all
```

Or install individually:

```bash
# Root dependencies
npm install

# Server dependencies
cd server && npm install

# Web dependencies
cd web && npm install
```

## Development

### Run Both Applications Concurrently

```bash
npm run dev
```

This will start both the backend server and frontend development server simultaneously.

### Run Applications Individually

```bash
# Backend only
npm run dev:server

# Frontend only
npm run dev:web
```

## Available Scripts

### Root Level
- `npm run dev` - Start both server and web in development mode
- `npm run install-all` - Install dependencies in all workspaces
- `npm run build` - Build the web application for production
- `npm start` - Start the production server

### Server
- `npm run dev` - Start server with nodemon (auto-restart on changes)
- `npm start` - Start server in production mode
- `npm run smoke` - Run comprehensive server health checks
- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier

### Web
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Ports

- **Backend Server**: http://localhost:4000
- **Frontend Web**: http://localhost:5173 (Vite default)

## Environment Variables

Create a `.env` file in the `server/` directory for backend configuration:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database
DB_PATH=./data/app.db

# JWT Secret (generate a strong secret)
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration (optional - for alerts)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=alerts@stayplanner.com

# CORS Origins
CORS_ORIGIN=http://localhost:5173

# Flight Search Provider
PROVIDER_FLIGHTS=skyscanner
# Leave empty for mock mode, or get from Skyscanner Partner Program
SKYSCANNER_API_KEY=

# Accommodation Booking
# Get from Booking.com Affiliate Program
BOOKING_AFFILIATE_ID=
BOOKING_AID_PARAM=aid

# Airbnb Deep Links (no API key needed)
AIRBNB_ENABLE_DEEPLINKS=true
```

### Provider Configuration

#### Flight Search (Skyscanner)
- **Live Mode**: Set `SKYSCANNER_API_KEY` for real-time flight data
- **Mock Mode**: Leave `SKYSCANNER_API_KEY` empty to run with sample data
- **Getting API Key**: Apply to the [Skyscanner Partner Program](https://www.partners.skyscanner.net/)

#### Accommodation (Booking.com)
- **Affiliate Integration**: Set `BOOKING_AFFILIATE_ID` from the [Booking.com Affiliate Program](https://www.booking.com/content/index.html)
- **Fallback**: Works without affiliate ID (demo mode)

#### Airbnb Integration
- **Deep Links Only**: No API key needed, generates search URLs
- **Why Deep Links**: Airbnb doesn't provide public accommodation search APIs
- **Enable/Disable**: Control with `AIRBNB_ENABLE_DEEPLINKS`

See `server/.env.example` for complete configuration options.

## Code Quality

The server includes ESLint and Prettier for code quality:

- **ESLint**: JavaScript linting with recommended rules
- **Prettier**: Code formatting with consistent style
- **Integration**: ESLint and Prettier work together without conflicts

## Development Workflow

1. Clone the repository
2. Run `npm run install-all` to install all dependencies
3. Run `npm run dev` to start both applications
4. Open http://localhost:5173 in your browser
5. The backend API will be available at http://localhost:4000

## Building for Production

```bash
# Build the frontend
npm run build

# Start the production server
npm start
```

## Testing

### Server Smoke Tests

Run comprehensive health checks on all API endpoints:

```bash
# From root directory
npm run smoke

# From server directory
npm run smoke
```

The smoke test covers:
- Health checks
- Database connectivity
- Provider status
- Feature flags
- Flight search (mock mode)
- Flight redirects
- Accommodation links
- Telemetry system

Exit codes:
- `0` - All tests passed, server is healthy
- `1` - Some tests failed, server may have issues

## Contributing

1. Make changes in the respective workspace (`server/` or `web/`)
2. Run `npm run lint` and `npm run format` in the server directory
3. Test your changes
4. Commit and push your changes

## License

ISC
