import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Checkbox,
  Paper,
  Typography,
  Divider,
  Box
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';

const TodoList = ({ todos, toggleComplete, deleteTodo, setEditingTodo }) => {
  // empty todo list message
  if (todos.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="subtitle1" color="textSecondary">
          Henüz hiç todo eklenmedi. Yeni bir todo ekleyin!
        </Typography>
      </Paper>
    );
  }

  // date formating
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  return (
    <Paper elevation={3}>
      <List sx={{ width: '100%' }}>
        {todos.map((todo, index) => (
          <React.Fragment key={todo.id}>
            {index > 0 && <Divider />}
            <ListItem
              sx={{
                bgcolor: todo.completed ? 'rgba(0, 0, 0, 0.04)' : 'inherit',
                textDecoration: todo.completed ? 'line-through' : 'none',
                opacity: todo.completed ? 0.7 : 1,
              }}
              secondaryAction={
                <Box>
                  <IconButton 
                    edge="end" 
                    aria-label="edit"
                    onClick={() => setEditingTodo(todo)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    edge="end" 
                    aria-label="delete" 
                    onClick={() => deleteTodo(todo.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
            >
              <Checkbox
                checked={todo.completed}
                onChange={() => toggleComplete(todo.id, todo.completed)}
                color="primary"
              />
              <ListItemText
                primary={
                  <Typography variant="subtitle1" component="div">
                    {todo.title}
                  </Typography>
                }
                secondary={
                  <>
                    {todo.description && (
                      <Typography
                        variant="body2"
                        component="div"
                        sx={{ mt: 1, mb: 1 }}
                      >
                        {todo.description}
                      </Typography>
                    )}
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      component="div"
                    >
                      {`Oluşturulma: ${formatDate(todo.createdAt)}`}
                      {todo.updatedAt !== todo.createdAt && 
                        ` • Güncellenme: ${formatDate(todo.updatedAt)}`}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default TodoList;