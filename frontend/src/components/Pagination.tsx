import React from 'react';
import {
  Box,
  Pagination as MuiPagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  SelectChangeEvent,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { PaginationProps } from '../types';

const Pagination: React.FC<PaginationProps> = ({ meta, onPageChange, onLimitChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(value);
  };
  
  const handleLimitChange = (event: SelectChangeEvent<number>) => {
    onLimitChange(event.target.value as number);
  };
  
  const startItem = meta.page === 1 ? 1 : (meta.page - 1) * meta.limit + 1;
  const endItem = Math.min(meta.page * meta.limit, meta.totalCount);
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'stretch' : 'center',
        gap: 2,
        my: 3,
        p: 2,
        borderRadius: 1,
        bgcolor: theme.palette.background.paper,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2, alignItems: isMobile ? 'flex-start' : 'center' }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="rows-per-page-label">Sayfa Başına</InputLabel>
          <Select
            labelId="rows-per-page-label"
            value={meta.limit}
            label="Sayfa Başına"
            onChange={handleLimitChange}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>
        
        <Typography variant="body2" color="text.secondary">
          {`${startItem}-${endItem} / ${meta.totalCount} kayıt gösteriliyor`}
        </Typography>
      </Box>
      
      <MuiPagination 
        count={meta.totalPages}
        page={meta.page}
        onChange={handlePageChange}
        color="primary"
        size={isMobile ? "small" : "medium"}
        showFirstButton
        showLastButton
        sx={{ 
          '& .MuiPaginationItem-root': { 
            fontWeight: 500 
          }
        }}
      />
    </Box>
  );
};

export default Pagination;