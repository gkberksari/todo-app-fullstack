# Advanced Todo App - Full Stack

A comprehensive and feature-rich Todo List application built with modern web technologies. This application allows users to register, login, and manage their todos with filtering, sorting, and responsive design capabilities.

![Todo App Screenshot](screenshots/todo-app.png)

## Features

- **User Authentication**
  - JWT-based authentication
  - User registration and login
  - Protected routes
  
- **Todo Management**
  - Create, edit, and delete todos
  - Mark todos as completed
  - Filter todos (All, Active, Completed)
  - Sort todos by creation date, update date, or title
  
- **Modern UI/UX**
  - Responsive design for mobile, tablet, and desktop
  - Material Design
  - Dark/Light theme support
  - Interactive UI elements
  
- **Advanced State Management**
  - TanStack Query (React Query) for efficient data fetching
  - Optimistic updates
  - Caching and background refetching
  
- **Security**
  - JWT token authentication
  - Password hashing
  - API route protection
  - Form validation

## Technology Stack

### Frontend
- React 19
- TypeScript
- Material-UI (MUI)
- TanStack Query (React Query)
- React Router
- Axios

### Backend
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- REST API
- ESM Modules

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
# JWT_SECRET="your-secret-key"
# PORT=3001

# Run database migrations
npx prisma migrate dev

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

### Auth Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Todo Endpoints
- `GET /api/todos` - List all todos for the authenticated user
- `GET /api/todos/:id` - Get a specific todo
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## Future Enhancements

- Add pagination for large todo lists
- Add categories/tags for todos
- Implement dark/light theme toggle
- Add drag and drop for reordering todos
- Mobile app with React Native

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.