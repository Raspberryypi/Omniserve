import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { TextField, Button, Paper, Typography, Box, Alert, MenuItem, InputAdornment } from '@mui/material';
import { LockOutlined, EmailOutlined, PersonOutlined, SecurityOutlined, ArrowForward } from '@mui/icons-material';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Operator');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await API.post('/auth/register', { name, email, password, role });
      localStorage.setItem('user', JSON.stringify(response.data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error during registration.');
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
            Create your account
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" className="mb-6 rounded-lg text-sm">
            {error}
          </Alert>
        )}

        <form onSubmit={handleRegister}>
          <Box className="mb-4">
            <TextField
              label="Full Name"
              fullWidth
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlined className="text-slate-400 mr-1" fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

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

          <Box className="mb-4">
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

          <Box className="mb-6">
            <TextField
              select
              label="Role"
              fullWidth
              value={role}
              onChange={(e) => setRole(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SecurityOutlined className="text-slate-400 mr-1" fontSize="small" />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="Operator">Operator</MenuItem>
              <MenuItem value="Manager">Manager</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </TextField>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg normal-case shadow-none text-sm"
            endIcon={<ArrowForward />}
          >
            {loading ? 'Creating account...' : 'Register'}
          </Button>
        </form>

        <Typography variant="body2" className="text-center text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Sign In
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Register;