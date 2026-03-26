# Paynau Fullstack Challenge

Order and product management system with Docker support.

## Structure

- `/backend` - Node.js + Express API
- `/frontend` - React + TypeScript + Vite
- `/docs` - Documentation
- `/shared` - Shared TypeScript types

## Quick Start (Development)

```bash
# Install all dependencies
npm run install:all

# Run both backend and frontend concurrently
npm run dev
```

## Docker

```bash
# Build and run
sudo docker-compose up --build

# Access app
http://localhost:8080
```

## Individual Setup

See README files in `backend/` and `frontend/` directories for detailed setup.
