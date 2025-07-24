import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  FormControlLabel, 
  Checkbox,
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { supabase } from '../../lib/supabase';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('请输入邮箱和密码');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        navigate('/admin');
      }
    } catch (error: unknown) {
      console.error('登录失败:', error);
      const errorMessage = error instanceof Error ? error.message : '登录失败，请检查您的凭据';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <Box 
      className="min-h-screen flex items-center justify-center bg-primary p-4"
      sx={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1412&auto=format&fit=crop&ixlib=rb-4.0.3&auto=format&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Box className="absolute inset-0 bg-black bg-opacity-50" />
      
      <Paper elevation={3} className="w-full max-w-md p-8 relative z-10">
        <Box className="text-center mb-6">
          <Typography variant="h4" className="font-bold text-secondary mb-1">
            管理后台
          </Typography>
          <Typography variant="body2" color="text.secondary">
            请登录以访问脱口秀演员个人网站管理系统
          </Typography>
        </Box>
        
        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleLogin}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="邮箱地址"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4"
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="密码"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-2"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="切换密码可见性"
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <FormControlLabel
            control={
              <Checkbox 
                value="remember" 
                color="primary" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
            }
            label="记住我"
            className="mb-4"
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            disabled={loading}
            className="py-3"
          >
            {loading ? '登录中...' : '登录'}
          </Button>
        </Box>
        
        <Box className="mt-4 text-center">
          <Typography variant="body2" color="text.secondary">
            * 此页面仅供管理员访问
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;