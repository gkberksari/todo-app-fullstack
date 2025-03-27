import React, { useState, useEffect } from 'react';
import {
  Paper,
  TextField,
  Button,
  Box,
  Typography
} from '@mui/material';

const TodoForm = ({ addTodo, editingTodo, updateTodo, setEditingTodo }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState('');
  
  // when editing mode activated fill the blanks
  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title);
      setDescription(editingTodo.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
  }, [editingTodo]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // mathcing titles
    if (!title.trim()) {
      setTitleError('Başlık gereklidir');
      return;
    }
    
    // for editing mode
    if (editingTodo) {
      updateTodo(editingTodo.id, {
        title,
        description,
        completed: editingTodo.completed
      });
    } else {
      // adding new todo
      addTodo({ title, description });
    }
    
    // reset form
    setTitle('');
    setDescription('');
    setTitleError('');
  };
  
  const cancelEdit = () => {
    setEditingTodo(null);
    setTitle('');
    setDescription('');
    setTitleError('');
  };
  
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
        {editingTodo ? 'Todo Düzenle' : 'Yeni Todo Ekle'}
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Başlık"
          variant="outlined"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (e.target.value.trim()) {
              setTitleError('');
            }
          }}
          error={!!titleError}
          helperText={titleError}
          sx={{ mb: 2 }}
        />
        
        <TextField
          fullWidth
          label="Açıklama (opsiyonel)"
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            fullWidth
          >
            {editingTodo ? 'Güncelle' : 'Ekle'}
          </Button>
          
          {editingTodo && (
            <Button 
              variant="outlined" 
              color="secondary"
              onClick={cancelEdit}
              fullWidth
            >
              İptal
            </Button>
          )}
        </Box>
      </form>
    </Paper>
  );
};

export default TodoForm;