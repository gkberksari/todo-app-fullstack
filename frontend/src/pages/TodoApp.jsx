import React, { useState } from 'react';
import { Container, Typography, Box, Paper, CircularProgress, Alert } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';
import TodoFilterSort from '../components/TodoFilterSort';
import Pagination from '../components/Pagination';
import { TodoFilter, TodoSortField, SortDirection } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { todoApi } from '../services/api';

const TodoApp = () => {
  const { token } = useAuth();
  const [editingTodo, setEditingTodo] = useState(null);
  const queryClient = useQueryClient();

  // Sayfalama state'leri
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Filtreleme ve sıralama state'leri
  const [filter, setFilter] = useState(TodoFilter.ALL);
  const [sortOption, setSortOption] = useState({
    field: TodoSortField.CREATED_AT,
    direction: SortDirection.DESC,
  });

  // Query keys - Tüm parametreler eklenmiş
  const TODOS_QUERY_KEY = ['todos', page, limit, filter, sortOption.field, sortOption.direction];

  // Tüm todo'ları getir (sayfalama ile)
  const {
    data: todosData,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: TODOS_QUERY_KEY,
    queryFn: () =>
      todoApi.getAllTodos(
        page,
        limit,
        filter !== TodoFilter.ALL ? filter.toLowerCase() : undefined,
        sortOption.field,
        sortOption.direction
      ),
    enabled: !!token, // Token varsa query'i çalıştır
  });

  // Pagination meta verisi ve todos verisini çıkar
  const todos = todosData?.data || [];
  const paginationMeta = todosData?.meta || {
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };

  // Todo sayıları (sadece mevcut sayfadan)
  const totalCount = paginationMeta.totalCount;
  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  // Yeni todo ekleme mutation
  const createTodoMutation = useMutation({
    mutationFn: todoApi.createTodo,
    onSuccess: () => {
      // Cache'i yenile
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  // Todo güncelleme mutation
  const updateTodoMutation = useMutation({
    mutationFn: ({ id, todo }) => todoApi.updateTodo(id, todo),
    onSuccess: () => {
      // Cache'i yenile
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
      // Düzenleme modunu kapat
      setEditingTodo(null);
    },
  });

  // Todo silme mutation
  const deleteTodoMutation = useMutation({
    mutationFn: todoApi.deleteTodo,
    onSuccess: () => {
      // Cache'i yenile
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
    },
  });

  // Yeni todo ekle
  const addTodo = async todo => {
    await createTodoMutation.mutateAsync(todo);
  };

  // Todo güncelle
  const updateTodo = async (id, updatedTodo) => {
    await updateTodoMutation.mutateAsync({ id, todo: updatedTodo });
  };

  // Todo durumunu değiştir
  const toggleComplete = async (id, completed) => {
    const todoToUpdate = todos.find(todo => todo.id === id);
    if (!todoToUpdate) return;

    await updateTodoMutation.mutateAsync({
      id,
      todo: {
        ...todoToUpdate,
        title: todoToUpdate.title,
        description: todoToUpdate.description,
        completed: !completed,
      },
    });
  };

  // Todo sil
  const deleteTodo = async id => {
    await deleteTodoMutation.mutateAsync(id);
  };

  // Sayfa değiştirme
  const handlePageChange = newPage => {
    setPage(newPage);
  };

  // Sayfa başına öğe sayısını değiştirme
  const handleLimitChange = newLimit => {
    setLimit(newLimit);
    setPage(1); // Limit değiştiğinde sayfa 1'e dön
  };

  // Hata mesajını oluştur
  const errorMessage = queryError
    ? "Todo'ları yüklerken bir hata oluştu."
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
            {paginationMeta.totalCount > 0 && (
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

            {todos.length === 0 ? (
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="subtitle1" color="textSecondary">
                  {paginationMeta.totalCount === 0
                    ? 'Henüz hiç todo eklenmedi. Yeni bir todo ekleyin!'
                    : 'Bu filtreleme kriterlerine uygun todo bulunamadı.'}
                </Typography>
              </Paper>
            ) : (
              <>
                <TodoList
                  todos={todos}
                  toggleComplete={toggleComplete}
                  deleteTodo={deleteTodo}
                  setEditingTodo={setEditingTodo}
                />

                {paginationMeta.totalPages > 1 && (
                  <Pagination
                    meta={paginationMeta}
                    onPageChange={handlePageChange}
                    onLimitChange={handleLimitChange}
                  />
                )}
              </>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default TodoApp;
