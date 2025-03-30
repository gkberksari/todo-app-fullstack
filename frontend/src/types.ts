// Todo types
export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface TodoFormData {
  title: string;
  description?: string;
}

export interface TodoFormProps {
  addTodo: (todo: TodoFormData) => Promise<void>;
  editingTodo: Todo | null;
  updateTodo: (id: string, updatedTodo: TodoFormData & { completed?: boolean }) => Promise<void>;
  setEditingTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
}

export interface TodoListProps {
  todos: Todo[];
  toggleComplete: (id: string, completed: boolean) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  setEditingTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
}

// Filter & Sort types
export enum TodoFilter {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed'
}

export enum TodoSortField {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt', 
  TITLE = 'title'
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

export interface TodoSortOption {
  field: TodoSortField;
  direction: SortDirection;
}

export interface TodoFilterSortProps {
  filter: TodoFilter;
  setFilter: React.Dispatch<React.SetStateAction<TodoFilter>>;
  sortOption: TodoSortOption;
  setSortOption: React.Dispatch<React.SetStateAction<TodoSortOption>>;
  totalCount: number;
  activeCount: number;
  completedCount: number;
}

// Auth types
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name?: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginFormProps {
  onLogin: (data: LoginFormData) => Promise<void>;
  onNavigateToRegister: () => void;
  isLoading: boolean;
  error: string | null;
}

export interface RegisterFormProps {
  onRegister: (data: RegisterFormData) => Promise<void>;
  onNavigateToLogin: () => void;
  isLoading: boolean;
  error: string | null;
}

// Pagination types
export interface PaginationMeta {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}