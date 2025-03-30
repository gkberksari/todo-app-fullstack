# Advanced Todo App - Full Stack

A comprehensive and feature-rich Todo List application built with modern web technologies. This application allows users to register, login, and manage their todos with filtering, sorting, and responsive design capabilities.

![Todo App Screenshot](screenshots/todo-app-screenshot.png)

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

- **Testing**
  - Unit tests for backend APIs
  - Unit tests for frontend components
  - Mocking and test coverage

## Code Quality

This project uses ESLint and Prettier to ensure code quality and consistency.

### Linting and Formatting

```bash
# Backend
cd backend
npx eslint .        # Check for linting issues
npx eslint . --fix  # Fix linting issues
npx prettier --write "src/**/*.ts"  # Format code with Prettier

# Frontend
cd frontend
npm run lint
npm run lint:fix
npm run format
```

- **API Documentation**
  - OpenAPI/Swagger documentation
  - Interactive API explorer

- **Containerization**
  - Dockerized application
  - Docker Compose for easy deployment
  - Multi-stage builds for optimized images

## Technology Stack

### Frontend
- React 19
- TypeScript
- Material-UI (MUI)
- TanStack Query (React Query)
- React Router
- Axios
- React Testing Library & Jest

### Backend
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- REST API
- ESM Modules
- Jest & Supertest for testing
- Swagger/OpenAPI

### DevOps
- Docker & Docker Compose
- Multi-stage build optimization
- Nginx for frontend serving

## Installation and Setup

### Requirements

- Node.js (v14 or higher)
- PostgreSQL database
- Docker & Docker Compose (optional)

### Using Docker (Recommended)

The easiest way to run the application is using Docker Compose:

```bash
# Clone the repository
git clone <repository-url>
cd todo-app

# Start the application with Docker Compose
docker-compose up -d
```

The application will be running at:
- Frontend: http://localhost
- Backend API: http://localhost:3001/api
- API Documentation: http://localhost:3001/api-docs

### Manual Setup

#### Backend

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

#### Frontend

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

## Running Tests

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## API Documentation

API documentation is available at `http://localhost:3001/api-docs` when the server is running. This interactive documentation allows you to explore and test all API endpoints.

## Future Enhancements
- Add drag and drop for reordering todos
- Mobile app with React Native

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.