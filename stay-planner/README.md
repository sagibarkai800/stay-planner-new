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
SKYSCANNER_API_KEY=your-skyscanner-api-key-here

# Accommodation Booking
BOOKING_AFFILIATE_ID=your-booking-affiliate-id
BOOKING_AID_PARAM=aid

# Airbnb Deep Links
AIRBNB_ENABLE_DEEPLINKS=true
```

### Provider Configuration

- **Flights**: Currently supports Skyscanner. Set `SKYSCANNER_API_KEY` for live data, or run in mock mode.
- **Accommodations**: Booking.com affiliate integration with `BOOKING_AFFILIATE_ID`.
- **Airbnb**: Deep link support when `AIRBNB_ENABLE_DEEPLINKS=true`.

See `server/env.example` for complete configuration options.

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

## Contributing

1. Make changes in the respective workspace (`server/` or `web/`)
2. Run `npm run lint` and `npm run format` in the server directory
3. Test your changes
4. Commit and push your changes

## License

ISC
