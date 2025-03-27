# Todo App - Full Stack

This project is a comprehensive Todo List application built with modern web technologies. It allows users to create, edit, delete, and mark tasks as completed.

## Technology Stack

### Frontend
- React 19
- Material-UI (MUI)
- Axios

### Backend
- Express.js
- Prisma ORM
- PostgreSQL
- REST API

## Features

- Create, edit, and delete todos
- Mark todos as completed
- Responsive design for mobile, tablet, and desktop
- Error handling and notifications
- Database persistence

## Installation and Setup

### Requirements

- Node.js (v14 or higher)
- PostgreSQL database

### Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create and edit .env file
# DATABASE_URL="postgresql://username:password@localhost:5432/todoapp?schema=public"

# Run database migrations
npx prisma migrate dev --name init

# Start the server
npm run dev
```

### Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the application
npm start
```

The application will be running at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api

## API Endpoints

- `GET /api/todos` - List all todos
- `GET /api/todos/:id` - Get a specific todo
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo