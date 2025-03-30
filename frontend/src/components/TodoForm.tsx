import React, { useState, useEffect } from 'react';
import {
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { TodoFormProps } from '../types';

const TodoForm: React.FC<TodoFormProps> = ({
  addTodo,
  editingTodo,
  updateTodo,
  setEditingTodo,
}) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [titleError, setTitleError] = useState<string>('');
  const [expanded, setExpanded] = useState<boolean>(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Eğer düzenleme modu aktifse, form alanlarını doldur ve formu genişlet
  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title);
      setDescription(editingTodo.description || '');
      setExpanded(true);
    } else {
      setTitle('');
      setDescription('');
    }
  }, [editingTodo]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Başlık doğrulaması
    if (!title.trim()) {
      setTitleError('Başlık gereklidir');
      return;
    }

    // Düzenleme modu için
    if (editingTodo) {
      updateTodo(editingTodo.id, {
        title,
        description,
        completed: editingTodo.completed,
      });
    } else {
      // Yeni todo ekleme
      addTodo({ title, description });
    }

    // Formu sıfırla
    setTitle('');
    setDescription('');
    setTitleError('');
    setExpanded(false);
  };

  const cancelEdit = () => {
    setEditingTodo(null);
    setTitle('');
    setDescription('');
    setTitleError('');
    setExpanded(false);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: theme.shape.borderRadius,
        transition: 'all 0.3s ease',
      }}
    >
      {!editingTodo && !expanded ? (
        // Kapalı form (Sadece başlık alanı göster)
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            fullWidth
            label="Yapılacak bir şey ekle..."
            variant="outlined"
            value={title}
            onChange={e => {
              setTitle(e.target.value);
              if (e.target.value.trim()) {
                setTitleError('');
              }
            }}
            error={!!titleError}
            helperText={titleError}
            size={isMobile ? 'small' : 'medium'}
            sx={{
              mr: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setExpanded(true)}
              startIcon={<EditIcon />}
              sx={{
                minWidth: isMobile ? '36px' : '120px',
                whiteSpace: isMobile ? 'nowrap' : 'normal',
                px: isMobile ? 1 : 2,
                borderRadius: '8px',
              }}
            >
              {isMobile ? '' : 'Detay Ekle'}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                if (title.trim()) {
                  addTodo({ title, description: '' });
                  setTitle('');
                  setDescription('');
                  setTitleError('');
                } else {
                  setTitleError('Başlık gereklidir');
                }
              }}
              startIcon={<AddIcon />}
              sx={{
                minWidth: isMobile ? '36px' : '100px',
                whiteSpace: isMobile ? 'nowrap' : 'normal',
                px: isMobile ? 1 : 2,
                borderRadius: '8px',
              }}
            >
              {isMobile ? '' : 'Ekle'}
            </Button>
          </Box>
        </Box>
      ) : (
        // Genişletilmiş form (Başlık ve açıklama alanları)
        <>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Typography variant="h6" component="h2">
              {editingTodo ? 'Todo Düzenle' : 'Yeni Todo Ekle'}
            </Typography>
            {!editingTodo && (
              <IconButton size="small" onClick={cancelEdit} sx={{ bgcolor: 'rgba(0,0,0,0.05)' }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Box>

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Başlık"
                variant="outlined"
                value={title}
                onChange={e => {
                  setTitle(e.target.value);
                  if (e.target.value.trim()) {
                    setTitleError('');
                  }
                }}
                error={!!titleError}
                helperText={titleError}
                size={isMobile ? 'small' : 'medium'}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  },
                }}
              />

              <TextField
                fullWidth
                label="Açıklama (opsiyonel)"
                variant="outlined"
                value={description}
                onChange={e => setDescription(e.target.value)}
                multiline
                rows={isMobile ? 3 : 4}
                size={isMobile ? 'small' : 'medium'}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  },
                }}
              />

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                {editingTodo && (
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={cancelEdit}
                    sx={{ borderRadius: '8px' }}
                  >
                    İptal
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  color={editingTodo ? 'primary' : 'secondary'}
                  startIcon={editingTodo ? <EditIcon /> : <AddIcon />}
                  sx={{ borderRadius: '8px' }}
                >
                  {editingTodo ? 'Güncelle' : 'Ekle'}
                </Button>
              </Box>
            </Box>
          </form>
        </>
      )}
    </Paper>
  );
};

export default TodoForm;
