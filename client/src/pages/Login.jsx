import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { TextField, Button, Paper, Typography, Box, Alert, InputAdornment } from '@mui/material';
import { LockOutlined, EmailOutlined, ArrowForward } from '@mui/icons-material';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await API.post('/auth/login', { email, password });
      localStorage.setItem('user', JSON.stringify(response.data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Paper 
        elevation={0} 
        className="border border-slate-200 p-8 rounded-2xl shadow-sm max-w-md w-full bg-white"
      >
        <Box className="text-center mb-8">
          <Typography variant="h4" className="font-extrabold text-blue-600 tracking-tight">
            OmniServe
          </Typography>
          <Typography variant="body2" className="text-slate-500 mt-1">
            Sign in to your account
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" className="mb-6 rounded-lg text-sm">
            {error}
          </Alert>
        )}

        <form onSubmit={handleLogin}>
          <Box className="mb-4">
            <TextField
              label="Email Address"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined className="text-slate-400 mr-1" fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box className="mb-6">
            <TextField
              label="Password"
              type="password"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined className="text-slate-400 mr-1" fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg normal-case shadow-none text-sm"
            endIcon={<ArrowForward />}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <Typography variant="body2" className="text-center text-slate-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Register
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Login;