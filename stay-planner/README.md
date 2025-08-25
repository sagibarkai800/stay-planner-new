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
PORT=4000
NODE_ENV=development
```

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
