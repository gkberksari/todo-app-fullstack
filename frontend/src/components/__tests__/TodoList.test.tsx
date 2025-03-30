import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoList from '../TodoList';
import { ThemeProvider } from '@mui/material';
import theme from '../../theme';

// Mock data
const mockTodos = [
  {
    id: '1',
    title: 'Test Todo 1',
    description: 'Test Description 1',
    completed: false,
    createdAt: '2025-03-01T12:00:00.000Z',
    updatedAt: '2025-03-01T12:00:00.000Z',
    userId: 'test-user-id',
  },
  {
    id: '2',
    title: 'Test Todo 2',
    description: 'Test Description 2',
    completed: true,
    createdAt: '2025-03-02T12:00:00.000Z',
    updatedAt: '2025-03-02T12:00:00.000Z',
    userId: 'test-user-id',
  },
];

// Mock functions
const mockToggleComplete = jest.fn();
const mockDeleteTodo = jest.fn();
const mockSetEditingTodo = jest.fn();

// Wrap component with theme provider
const renderWithTheme = (component: React.ReactNode) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('TodoList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders todos correctly', () => {
    renderWithTheme(
      <TodoList
        todos={mockTodos}
        toggleComplete={mockToggleComplete}
        deleteTodo={mockDeleteTodo}
        setEditingTodo={mockSetEditingTodo}
      />
    );

    // Check if todos are rendered
    expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Test Todo 2')).toBeInTheDocument();
    expect(screen.getByText('Test Description 1')).toBeInTheDocument();
    expect(screen.getByText('Test Description 2')).toBeInTheDocument();
  });

  it('displays empty state when no todos are provided', () => {
    renderWithTheme(
      <TodoList
        todos={[]}
        toggleComplete={mockToggleComplete}
        deleteTodo={mockDeleteTodo}
        setEditingTodo={mockSetEditingTodo}
      />
    );

    expect(screen.getByText(/henüz hiç todo eklenmedi/i)).toBeInTheDocument();
  });

  it('calls toggleComplete when checkbox is clicked', () => {
    renderWithTheme(
      <TodoList
        todos={mockTodos}
        toggleComplete={mockToggleComplete}
        deleteTodo={mockDeleteTodo}
        setEditingTodo={mockSetEditingTodo}
      />
    );

    // Find the first checkbox and click it
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    expect(mockToggleComplete).toHaveBeenCalledWith('1', false);
  });

  it('calls deleteTodo when delete button is clicked', () => {
    renderWithTheme(
      <TodoList
        todos={mockTodos}
        toggleComplete={mockToggleComplete}
        deleteTodo={mockDeleteTodo}
        setEditingTodo={mockSetEditingTodo}
      />
    );

    // Find delete buttons
    const deleteButtons = screen.getAllByLabelText('delete');
    fireEvent.click(deleteButtons[0]);

    expect(mockDeleteTodo).toHaveBeenCalledWith('1');
  });

  it('calls setEditingTodo when edit button is clicked', () => {
    renderWithTheme(
      <TodoList
        todos={mockTodos}
        toggleComplete={mockToggleComplete}
        deleteTodo={mockDeleteTodo}
        setEditingTodo={mockSetEditingTodo}
      />
    );

    // Find edit buttons
    const editButtons = screen.getAllByLabelText('edit');
    fireEvent.click(editButtons[0]);

    expect(mockSetEditingTodo).toHaveBeenCalledWith(mockTodos[0]);
  });

  it('displays completed status correctly', () => {
    renderWithTheme(
      <TodoList
        todos={mockTodos}
        toggleComplete={mockToggleComplete}
        deleteTodo={mockDeleteTodo}
        setEditingTodo={mockSetEditingTodo}
      />
    );

    // Check if completed status is displayed
    expect(screen.getByText('Tamamlandı')).toBeInTheDocument();
    expect(screen.getByText('Devam Ediyor')).toBeInTheDocument();
  });
});
