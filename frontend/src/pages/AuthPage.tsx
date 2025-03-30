import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Paper, 
  Typography, 
  Tabs, 
  Tab,
  useTheme,
  useMediaQuery
} from '@mui/material';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import { useAuth } from '../contexts/AuthContext';
import { LoginFormData, RegisterFormData } from '../types';

enum AuthMode {
  LOGIN,
  REGISTER
}

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>(AuthMode.LOGIN);
  const { login, register, isLoading, error } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogin = async (data: LoginFormData): Promise<void> => {
    await login(data);
  };

  const handleRegister = async (data: RegisterFormData): Promise<void> => {
    await register(data);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setMode(newValue);
  };

  return (
    <Container maxWidth="sm">
      <Box 
        sx={{ 
          mt: { xs: 4, sm: 8 },
          mb: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography 
          component="h1" 
          variant="h4" 
          gutterBottom 
          color="primary"
          align="center"
          sx={{ 
            fontWeight: 700,
            fontSize: { xs: '1.75rem', sm: '2.125rem' }
          }}
        >
          Todo Uygulaması
        </Typography>
        
        <Paper 
          elevation={3}
          sx={{ 
            width: '100%', 
            mt: 3,
            borderRadius: theme.shape.borderRadius,
            overflow: 'hidden'
          }}
        >
          <Tabs
            value={mode}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              bgcolor: theme.palette.primary.main,
              color: 'white'
            }}
            TabIndicatorProps={{
              style: {
                backgroundColor: theme.palette.secondary.main,
                height: 3
              },
            }}
          >
            <Tab 
              label="Giriş" 
              sx={{ 
                color: 'white',
                fontWeight: 500,
                fontSize: isMobile ? '0.875rem' : '1rem',
                py: isMobile ? 1.5 : 2
              }} 
            />
            <Tab 
              label="Kayıt" 
              sx={{ 
                color: 'white',
                fontWeight: 500,
                fontSize: isMobile ? '0.875rem' : '1rem',
                py: isMobile ? 1.5 : 2
              }} 
            />
          </Tabs>
          
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            {mode === AuthMode.LOGIN ? (
              <LoginForm 
                onLogin={handleLogin} 
                onNavigateToRegister={() => setMode(AuthMode.REGISTER)} 
                isLoading={isLoading} 
                error={error} 
              />
            ) : (
              <RegisterForm 
                onRegister={handleRegister} 
                onNavigateToLogin={() => setMode(AuthMode.LOGIN)} 
                isLoading={isLoading} 
                error={error} 
              />
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AuthPage;