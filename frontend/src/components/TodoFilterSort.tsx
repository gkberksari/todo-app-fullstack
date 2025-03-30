import React from 'react';
import {
  Box,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Chip,
  useTheme,
  useMediaQuery,
  Grid,
  Divider,
  Paper
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Sort as SortIcon,
  CheckCircle as CheckCircleIcon,
  Radio as RadioIcon,
  List as ListIcon
} from '@mui/icons-material';
import { 
  TodoFilter, 
  TodoSortField, 
  SortDirection, 
  TodoSortOption,
  TodoFilterSortProps
} from '../types';

const TodoFilterSort: React.FC<TodoFilterSortProps> = ({
  filter,
  setFilter,
  sortOption,
  setSortOption,
  totalCount,
  activeCount,
  completedCount
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleFilterChange = (
    _: React.MouseEvent<HTMLElement>,
    newFilter: TodoFilter,
  ) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  const handleSortFieldChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const field = event.target.value as TodoSortField;
    setSortOption({ ...sortOption, field });
  };

  const handleSortDirectionChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const direction = event.target.value as SortDirection;
    setSortOption({ ...sortOption, direction });
  };

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 2, 
        mb: 3,
        borderRadius: theme.shape.borderRadius
      }}
    >
      <Grid container spacing={2} alignItems="center">
        {/* Filtre ve Sıralama Başlığı */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography 
              variant="subtitle1" 
              component="div" 
              sx={{ 
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <FilterIcon fontSize="small" color="action" /> 
              Filtrele ve Sırala
            </Typography>
            
            {/* Todo sayaçları */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip 
                size="small" 
                label={`Toplam: ${totalCount}`} 
                icon={<ListIcon fontSize="small" />}
                sx={{ bgcolor: theme.palette.primary.main, color: 'white' }}
              />
              {!isMobile && (
                <>
                  <Chip 
                    size="small" 
                    label={`Devam Eden: ${activeCount}`} 
                    icon={<RadioIcon fontSize="small" />}
                    sx={{ bgcolor: '#42a5f5', color: 'white' }}
                  />
                  <Chip 
                    size="small" 
                    label={`Tamamlanan: ${completedCount}`} 
                    icon={<CheckCircleIcon fontSize="small" />}
                    sx={{ bgcolor: theme.palette.success.main, color: 'white' }}
                  />
                </>
              )}
            </Box>
          </Box>
        </Grid>

        {/* Mobil görünümde todo sayaçları */}
        {isMobile && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Chip 
                size="small" 
                label={`Devam Eden: ${activeCount}`} 
                icon={<RadioIcon fontSize="small" />}
                sx={{ bgcolor: '#42a5f5', color: 'white' }}
              />
              <Chip 
                size="small" 
                label={`Tamamlanan: ${completedCount}`} 
                icon={<CheckCircleIcon fontSize="small" />}
                sx={{ bgcolor: theme.palette.success.main, color: 'white' }}
              />
            </Box>
          </Grid>
        )}

        <Grid item xs={12}>
          <Divider />
        </Grid>

        {/* Filtre Butonları */}
        <Grid item xs={12} sm={6}>
          <Typography 
            variant="body2" 
            component="div" 
            color="textSecondary" 
            sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            <FilterIcon fontSize="small" /> Filtre
          </Typography>
          <ToggleButtonGroup
            value={filter}
            exclusive
            onChange={handleFilterChange}
            aria-label="todo filter"
            size={isMobile ? "small" : "medium"}
            fullWidth
            sx={{ bgcolor: 'background.paper' }}
          >
            <ToggleButton 
              value={TodoFilter.ALL} 
              aria-label="all todos"
              sx={{ 
                borderRadius: '4px 0 0 4px',
                '&.Mui-selected': {
                  bgcolor: theme.palette.primary.main,
                  color: 'white',
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                    color: 'white',
                  }
                }
              }}
            >
              <ListIcon sx={{ mr: isMobile ? 0 : 1 }} />
              {!isMobile && "Tümü"}
            </ToggleButton>
            <ToggleButton 
              value={TodoFilter.ACTIVE} 
              aria-label="active todos"
              sx={{ 
                '&.Mui-selected': {
                  bgcolor: '#42a5f5',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#1976d2',
                    color: 'white',
                  }
                }
              }}
            >
              <RadioIcon sx={{ mr: isMobile ? 0 : 1 }} />
              {!isMobile && "Devam Eden"}
            </ToggleButton>
            <ToggleButton 
              value={TodoFilter.COMPLETED} 
              aria-label="completed todos"
              sx={{ 
                borderRadius: '0 4px 4px 0',
                '&.Mui-selected': {
                  bgcolor: theme.palette.success.main,
                  color: 'white',
                  '&:hover': {
                    bgcolor: theme.palette.success.dark,
                    color: 'white',
                  }
                }
              }}
            >
              <CheckCircleIcon sx={{ mr: isMobile ? 0 : 1 }} />
              {!isMobile && "Tamamlanan"}
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>

        {/* Sıralama Seçenekleri */}
        <Grid item xs={12} sm={6}>
          <Typography 
            variant="body2" 
            component="div" 
            color="textSecondary" 
            sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            <SortIcon fontSize="small" /> Sıralama
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <FormControl fullWidth size={isMobile ? "small" : "medium"}>
              <InputLabel id="sort-field-label">Alan</InputLabel>
              <Select
                labelId="sort-field-label"
                id="sort-field"
                value={sortOption.field}
                label="Alan"
                onChange={handleSortFieldChange}
              >
                <MenuItem value={TodoSortField.CREATED_AT}>Oluşturulma Tarihi</MenuItem>
                <MenuItem value={TodoSortField.UPDATED_AT}>Güncellenme Tarihi</MenuItem>
                <MenuItem value={TodoSortField.TITLE}>Başlık</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth size={isMobile ? "small" : "medium"}>
              <InputLabel id="sort-direction-label">Yön</InputLabel>
              <Select
                labelId="sort-direction-label"
                id="sort-direction"
                value={sortOption.direction}
                label="Yön"
                onChange={handleSortDirectionChange}
              >
                <MenuItem value={SortDirection.ASC}>Artan</MenuItem>
                <MenuItem value={SortDirection.DESC}>Azalan</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default TodoFilterSort;