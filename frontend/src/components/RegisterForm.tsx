import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
  useTheme,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import { RegisterFormProps, RegisterFormData } from '../types';

const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegister,
  onNavigateToLogin,
  isLoading,
  error,
}) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const theme = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Basit doğrulama
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setFormErrors(prev => ({
        ...prev,
        email: value
          ? emailRegex.test(value)
            ? ''
            : 'Geçerli bir email adresi giriniz'
          : 'Email gereklidir',
      }));
    } else if (name === 'password') {
      setFormErrors(prev => ({
        ...prev,
        password: value
          ? value.length >= 6
            ? ''
            : 'Şifre en az 6 karakter olmalıdır'
          : 'Şifre gereklidir',
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Form doğrulama
    let hasError = false;
    const newFormErrors = { ...formErrors };

    if (!formData.email) {
      newFormErrors.email = 'Email gereklidir';
      hasError = true;
    }

    if (!formData.password) {
      newFormErrors.password = 'Şifre gereklidir';
      hasError = true;
    }

    setFormErrors(newFormErrors);

    if (!hasError && !formErrors.email && !formErrors.password) {
      onRegister(formData);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          fullWidth
          id="name"
          label="İsim (İsteğe bağlı)"
          name="name"
          autoComplete="name"
          value={formData.name}
          onChange={handleChange}
          disabled={isLoading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Adresi"
          name="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          error={!!formErrors.email}
          helperText={formErrors.email}
          disabled={isLoading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Şifre"
          type={showPassword ? 'text' : 'password'}
          id="password"
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
          error={!!formErrors.password}
          helperText={formErrors.password}
          disabled={isLoading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={toggleShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="secondary"
          size="large"
          disabled={isLoading}
          sx={{
            mt: 1,
            mb: 3,
            py: 1.2,
            borderRadius: '8px',
            boxShadow: '0 4px 10px rgba(245, 0, 87, 0.25)',
            '&:hover': {
              boxShadow: '0 6px 15px rgba(245, 0, 87, 0.35)',
            },
          }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Kayıt Ol'}
        </Button>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Zaten bir hesabınız var mı?
          </Typography>
          <Link
            component="button"
            variant="body2"
            onClick={onNavigateToLogin}
            sx={{
              cursor: 'pointer',
              color: theme.palette.primary.main,
              fontWeight: 500,
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
            disabled={isLoading}
          >
            Giriş Yap
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default RegisterForm;
