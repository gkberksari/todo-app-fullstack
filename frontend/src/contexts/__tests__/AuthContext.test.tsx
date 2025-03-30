import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock API services
jest.mock('../services/api', () => {
  return {
    authApi: {
      login: jest.fn().mockImplementation((email, password) => {
        if (email === 'test@example.com' && password === 'password123') {
          return Promise.resolve({
            token: 'test-token',
            user: {
              id: 'user-id',
              email: 'test@example.com',
              name: 'Test User',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          });
        }
        return Promise.reject(new Error('Invalid credentials'));
      }),
      register: jest.fn().mockImplementation((name, email, password) => {
        if (email === 'existing@example.com') {
          return Promise.reject(new Error('Email already exists'));
        }
        return Promise.resolve({
          token: 'test-token',
          user: {
            id: 'new-user-id',
            email,
            name,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        });
      }),
    },
    setAuthToken: jest.fn(),
  };
});

// Create a test component to interact with the auth context
const TestComponent = () => {
  const { isAuthenticated, user, login, register, logout, error } = useAuth();

  const handleLogin = () => {
    login({ email: 'test@example.com', password: 'password123' });
  };

  const handleInvalidLogin = () => {
    login({ email: 'test@example.com', password: 'wrong-password' });
  };

  const handleRegister = () => {
    register({ email: 'new@example.com', password: 'password123', name: 'New User' });
  };

  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
      {user && <div data-testid="user-email">{user.email}</div>}
      {error && <div data-testid="auth-error">{error}</div>}
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleInvalidLogin}>Invalid Login</button>
      <button onClick={handleRegister}>Register</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

// Setup test wrapper with providers
const renderWithProviders = (component: React.ReactNode) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{component}</AuthProvider>
    </QueryClientProvider>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should start with not authenticated status', () => {
    renderWithProviders(<TestComponent />);

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
  });

  it('should authenticate user on successful login', async () => {
    renderWithProviders(<TestComponent />);

    // Click login button
    fireEvent.click(screen.getByText('Login'));

    // Wait for auth state to update
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });

    expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
  });

  it('should set error on invalid login', async () => {
    renderWithProviders(<TestComponent />);

    // Click invalid login button
    fireEvent.click(screen.getByText('Invalid Login'));

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByTestId('auth-error')).toBeInTheDocument();
    });
  });

  it('should authenticate user on successful registration', async () => {
    renderWithProviders(<TestComponent />);

    // Click register button
    fireEvent.click(screen.getByText('Register'));

    // Wait for auth state to update
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });

    expect(screen.getByTestId('user-email')).toHaveTextContent('new@example.com');
  });

  it('should log out user successfully', async () => {
    renderWithProviders(<TestComponent />);

    // Login first
    fireEvent.click(screen.getByText('Login'));

    // Wait for login
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });

    // Then logout
    fireEvent.click(screen.getByText('Logout'));

    // Check if logged out
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
  });
});
