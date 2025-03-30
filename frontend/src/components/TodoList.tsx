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
  Box,
  Chip,
  Tooltip,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import { TodoListProps } from '../types';

const TodoList: React.FC<TodoListProps> = ({
  todos,
  toggleComplete,
  deleteTodo,
  setEditingTodo,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Todo listesi boşsa mesaj göster
  if (todos.length === 0) {
    return (
      <Paper
        elevation={2}
        sx={{
          p: 3,
          textAlign: 'center',
          borderRadius: theme.shape.borderRadius,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Typography variant="subtitle1" color="textSecondary">
          Henüz hiç todo eklenmedi. Yeni bir todo ekleyin!
        </Typography>
      </Paper>
    );
  }

  // Tarihi formatla
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  // Mobil görünüm için card tasarımı
  if (isMobile) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {todos.map(todo => (
          <Card
            key={todo.id}
            sx={{
              opacity: todo.completed ? 0.7 : 1,
              bgcolor: todo.completed ? 'rgba(0, 0, 0, 0.04)' : 'inherit',
              position: 'relative',
              borderLeft: todo.completed
                ? `4px solid ${theme.palette.success.main}`
                : `4px solid ${theme.palette.primary.main}`,
            }}
          >
            <CardContent sx={{ pb: 0 }}>
              <Box sx={{ display: 'flex', mb: 1, alignItems: 'flex-start' }}>
                <Checkbox
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo.id, todo.completed)}
                  color="primary"
                  icon={<RadioButtonUncheckedIcon />}
                  checkedIcon={<CheckCircleIcon />}
                  sx={{ p: 0, mr: 1, mt: 0.5 }}
                />
                <Box>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      textDecoration: todo.completed ? 'line-through' : 'none',
                      fontWeight: 500,
                      fontSize: '1.1rem',
                    }}
                  >
                    {todo.title}
                  </Typography>

                  {todo.completed ? (
                    <Chip
                      label="Tamamlandı"
                      size="small"
                      color="success"
                      sx={{ fontSize: '0.7rem', mt: 0.5 }}
                    />
                  ) : (
                    <Chip
                      label="Devam Ediyor"
                      size="small"
                      color="primary"
                      sx={{ fontSize: '0.7rem', mt: 0.5 }}
                    />
                  )}
                </Box>
              </Box>

              {todo.description && (
                <Typography
                  variant="body2"
                  component="div"
                  sx={{
                    mt: 1,
                    mb: 1,
                    pl: 4,
                    fontStyle: 'italic',
                    color: theme.palette.text.secondary,
                  }}
                >
                  {todo.description}
                </Typography>
              )}

              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2, pl: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EventIcon
                    fontSize="small"
                    sx={{ mr: 0.5, color: theme.palette.text.secondary, fontSize: '0.9rem' }}
                  />
                  <Typography variant="caption" color="textSecondary">
                    {formatDate(todo.createdAt)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>

            <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
              <IconButton size="small" color="primary" onClick={() => setEditingTodo(todo)}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" color="error" onClick={() => deleteTodo(todo.id)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </Box>
    );
  }

  // Desktop görünüm için liste tasarımı
  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: theme.shape.borderRadius,
        overflow: 'hidden',
      }}
    >
      <List sx={{ width: '100%', p: 0 }}>
        {todos.map((todo, index) => (
          <React.Fragment key={todo.id}>
            {index > 0 && <Divider />}
            <ListItem
              sx={{
                bgcolor: todo.completed ? 'rgba(0, 0, 0, 0.04)' : 'inherit',
                borderLeft: todo.completed
                  ? `4px solid ${theme.palette.success.main}`
                  : `4px solid ${theme.palette.primary.main}`,
                opacity: todo.completed ? 0.7 : 1,
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
              secondaryAction={
                <Box>
                  <Tooltip title="Düzenle">
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => setEditingTodo(todo)}
                      sx={{ mr: 1 }}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Sil">
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => deleteTodo(todo.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              }
            >
              <Checkbox
                checked={todo.completed}
                onChange={() => toggleComplete(todo.id, todo.completed)}
                color="primary"
                icon={<RadioButtonUncheckedIcon />}
                checkedIcon={<CheckCircleIcon />}
              />
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography
                      variant="subtitle1"
                      component="div"
                      sx={{
                        mr: 2,
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        fontWeight: 500,
                      }}
                    >
                      {todo.title}
                    </Typography>
                    {todo.completed ? (
                      <Chip label="Tamamlandı" size="small" color="success" sx={{ height: 24 }} />
                    ) : (
                      <Chip label="Devam Ediyor" size="small" color="primary" sx={{ height: 24 }} />
                    )}
                  </Box>
                }
                secondary={
                  <>
                    {todo.description && (
                      <Typography
                        variant="body2"
                        component="div"
                        sx={{ mt: 1, mb: 1, fontStyle: 'italic' }}
                      >
                        {todo.description}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EventIcon
                          fontSize="small"
                          sx={{ mr: 0.5, color: theme.palette.text.secondary, fontSize: '0.9rem' }}
                        />
                        <Typography variant="caption" color="textSecondary">
                          {`Oluşturulma: ${formatDate(todo.createdAt)}`}
                        </Typography>
                      </Box>
                      {todo.updatedAt !== todo.createdAt && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AccessTimeIcon
                            fontSize="small"
                            sx={{
                              mr: 0.5,
                              color: theme.palette.text.secondary,
                              fontSize: '0.9rem',
                            }}
                          />
                          <Typography variant="caption" color="textSecondary">
                            {`Güncellenme: ${formatDate(todo.updatedAt)}`}
                          </Typography>
                        </Box>
                      )}
                    </Box>
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
