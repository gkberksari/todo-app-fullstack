import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  AppBar,
  Toolbar,
  Paper,
  CircularProgress
} from '@mui/material';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';

const API_URL = 'http://localhost:3001/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTodo, setEditingTodo] = useState(null);

  // fetching todos
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/todos`);
      setTodos(response.data);
      setError(null);
    } catch (err) {
      console.error('Todo\'ları getirirken hata oluştu:', err);
      setError('Todo\'ları yüklerken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Adding new todo
  const addTodo = async (todo) => {
    try {
      const response = await axios.post(`${API_URL}/todos`, todo);
      setTodos([response.data, ...todos]);
    } catch (err) {
      console.error('Todo eklerken hata oluştu:', err);
      setError('Todo eklenirken bir hata oluştu.');
    }
  };

  // Updating todo
  const updateTodo = async (id, updatedTodo) => {
    try {
      const response = await axios.put(`${API_URL}/todos/${id}`, updatedTodo);
      setTodos(todos.map(todo => (todo.id === id ? response.data : todo)));
      setEditingTodo(null);
    } catch (err) {
      console.error('Todo güncellenirken hata oluştu:', err);
      setError('Todo güncellenirken bir hata oluştu.');
    }
  };

  // Todo state change
  const toggleComplete = async (id, completed) => {
    try {
      const todoToUpdate = todos.find(todo => todo.id === id);
      const response = await axios.put(`${API_URL}/todos/${id}`, {
        ...todoToUpdate,
        completed: !completed
      });
      setTodos(todos.map(todo => (todo.id === id ? response.data : todo)));
    } catch (err) {
      console.error('Todo durumu değiştirilirken hata oluştu:', err);
      setError('Todo durumu değiştirilirken bir hata oluştu.');
    }
  };

  // Todo delete
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      console.error('Todo silinirken hata oluştu:', err);
      setError('Todo silinirken bir hata oluştu.');
    }
  };

  return (
    <div>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Todo Uygulaması
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        {error && (
          <Paper
            elevation={2}
            sx={{
              p: 2,
              mb: 2,
              backgroundColor: '#ffebee',
              color: '#c62828'
            }}
          >
            <Typography>{error}</Typography>
          </Paper>
        )}

        <TodoForm
          addTodo={addTodo}
          editingTodo={editingTodo}
          updateTodo={updateTodo}
          setEditingTodo={setEditingTodo}
        />

        <Box sx={{ mt: 4 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TodoList
              todos={todos}
              toggleComplete={toggleComplete}
              deleteTodo={deleteTodo}
              setEditingTodo={setEditingTodo}
            />
          )}
        </Box>
      </Container>
    </div>
  );
}

export default App;