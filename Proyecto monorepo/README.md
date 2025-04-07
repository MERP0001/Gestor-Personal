# Gestor Personal - Monorepo

A personal finance management application built with React Native (frontend) and NestJS (backend).

## Project Structure

```
gestor-personal/
├── packages/
│   ├── mobile/           # React Native app
│   └── server/           # NestJS backend
```

## Features

- Transaction management (income and expenses)
- Total balance visualization
- Statistics and charts
- Transaction filtering
- Local data storage
- User authentication
- Offline/online synchronization

## Prerequisites

- Node.js (v16 or higher)
- Yarn
- React Native development environment
- Android Studio / Xcode (for mobile development)

## Setup

1. Install dependencies:
```bash
yarn install
```

2. Start development servers:
```bash
yarn dev
```

This will start both the mobile app and the backend server.

## Available Scripts

- `yarn mobile` - Run mobile app commands
- `yarn server` - Run server commands
- `yarn dev` - Start both mobile and server in development mode
- `yarn build` - Build all packages
- `yarn test` - Run tests for all packages
- `yarn lint` - Run linting for all packages

## Environment Variables

Create `.env` files in both packages with the following variables:

### Mobile (.env)
```
API_URL=http://localhost:3000
```

### Server (.env)
```
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/gestor_personal
JWT_SECRET=your-secret-key
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

MIT 