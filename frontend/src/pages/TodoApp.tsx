import React, { useState, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';
import TodoFilterSort from '../components/TodoFilterSort';
import { 
  Todo, 
  TodoFormData, 
  TodoFilter, 
  TodoSortField, 
  SortDirection,
  TodoSortOption
} from '../types';
import { useAuth } from '../contexts/AuthContext';
import { todoApi } from '../services/api';

const TodoApp: React.FC = () => {
  const { token } = useAuth();
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const queryClient = useQueryClient();

  // Filtreleme ve sıralama state'leri
  const [filter, setFilter] = useState<TodoFilter>(TodoFilter.ALL);
  const [sortOption, setSortOption] = useState<TodoSortOption>({
    field: TodoSortField.CREATED_AT,
    direction: SortDirection.DESC
  });

  // Query keys
  const TODOS_QUERY_KEY = ['todos'];

  // Tüm todo'ları getir
  const { 
    data: allTodos = [], 
    isLoading, 
    error: queryError 
  } = useQuery({
    queryKey: TODOS_QUERY_KEY,
    queryFn: todoApi.getAllTodos,
    enabled: !!token, // Token varsa query'i çalıştır
    onError: (error: any) => {
      console.error('Error fetching todos:', error);
    }
  });

  // Filtrelenmiş ve sıralanmış todo'lar
  const filteredAndSortedTodos = useMemo(() => {
    // Filtreleme
    let result = [...allTodos];
    
    if (filter === TodoFilter.ACTIVE) {
      result = result.filter(todo => !todo.completed);
    } else if (filter === TodoFilter.COMPLETED) {
      result = result.filter(todo => todo.completed);
    }
    
    // Sıralama
    result.sort((a, b) => {
      const aValue = a[sortOption.field];
      const bValue = b[sortOption.field];
      
      // String değerleri karşılaştırma
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        if (sortOption.field === TodoSortField.TITLE) {
          return sortOption.direction === SortDirection.ASC 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
        } else {
          // Tarih karşılaştırma
          const dateA = new Date(aValue).getTime();
          const dateB = new Date(bValue).getTime();
          return sortOption.direction === SortDirection.ASC 
            ? dateA - dateB 
            : dateB - dateA;
        }
      }
      
      return 0;
    });
    
    return result;
  }, [allTodos, filter, sortOption]);

  // Todo sayıları
  const totalCount = allTodos.length;
  const activeCount = allTodos.filter(todo => !todo.completed).length;
  const completedCount = allTodos.filter(todo => todo.completed).length;

  // Yeni todo ekleme mutation
  const createTodoMutation = useMutation({
    mutationFn: todoApi.createTodo,
    onSuccess: (newTodo) => {
      // Cache'i güncelle
      queryClient.setQueryData<Todo[]>(
        TODOS_QUERY_KEY, 
        (oldTodos = []) => [newTodo, ...oldTodos]
      );
    }
  });

  // Todo güncelleme mutation
  const updateTodoMutation = useMutation({
    mutationFn: ({ id, todo }: { id: string, todo: TodoFormData & { completed?: boolean } }) => 
      todoApi.updateTodo(id, todo),
    onSuccess: (updatedTodo) => {
      // Cache'i güncelle
      queryClient.setQueryData<Todo[]>(
        TODOS_QUERY_KEY, 
        (oldTodos = []) => oldTodos.map(todo => 
          todo.id === updatedTodo.id ? updatedTodo : todo
        )
      );
      // Düzenleme modunu kapat
      setEditingTodo(null);
    }
  });

  // Todo silme mutation
  const deleteTodoMutation = useMutation({
    mutationFn: todoApi.deleteTodo,
    onSuccess: (_, id) => {
      // Cache'i güncelle
      queryClient.setQueryData<Todo[]>(
        TODOS_QUERY_KEY, 
        (oldTodos = []) => oldTodos.filter(todo => todo.id !== id)
      );
    }
  });

  // Yeni todo ekle
  const addTodo = async (todo: TodoFormData): Promise<void> => {
    await createTodoMutation.mutateAsync(todo);
  };

  // Todo güncelle
  const updateTodo = async (id: string, updatedTodo: TodoFormData & { completed?: boolean }): Promise<void> => {
    await updateTodoMutation.mutateAsync({ id, todo: updatedTodo });
  };

  // Todo durumunu değiştir
  const toggleComplete = async (id: string, completed: boolean): Promise<void> => {
    const todoToUpdate = allTodos.find(todo => todo.id === id);
    if (!todoToUpdate) return;
    
    await updateTodoMutation.mutateAsync({ 
      id, 
      todo: {
        ...todoToUpdate,
        title: todoToUpdate.title,
        description: todoToUpdate.description,
        completed: !completed
      }
    });
  };

  // Todo sil
  const deleteTodo = async (id: string): Promise<void> => {
    await deleteTodoMutation.mutateAsync(id);
  };

  // Hata mesajını oluştur
  const errorMessage = queryError 
    ? 'Todo\'ları yüklerken bir hata oluştu.' 
    : createTodoMutation.error 
      ? 'Todo eklenirken bir hata oluştu.' 
      : updateTodoMutation.error 
        ? 'Todo güncellenirken bir hata oluştu.' 
        : deleteTodoMutation.error 
          ? 'Todo silinirken bir hata oluştu.' 
          : null;

  return (
    <Container maxWidth="md">
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <TodoForm 
        addTodo={addTodo} 
        editingTodo={editingTodo}
        updateTodo={updateTodo}
        setEditingTodo={setEditingTodo}
      />

      <Box sx={{ mt: 4 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {allTodos.length > 0 && (
              <TodoFilterSort 
                filter={filter}
                setFilter={setFilter}
                sortOption={sortOption}
                setSortOption={setSortOption}
                totalCount={totalCount}
                activeCount={activeCount}
                completedCount={completedCount}
              />
            )}
            
            {filteredAndSortedTodos.length === 0 ? (
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="subtitle1" color="textSecondary">
                  {allTodos.length === 0 
                    ? 'Henüz hiç todo eklenmedi. Yeni bir todo ekleyin!' 
                    : 'Bu filtreleme kriterlerine uygun todo bulunamadı.'}
                </Typography>
              </Paper>
            ) : (
              <TodoList
                todos={filteredAndSortedTodos}
                toggleComplete={toggleComplete}
                deleteTodo={deleteTodo}
                setEditingTodo={setEditingTodo}
              />
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default TodoApp;