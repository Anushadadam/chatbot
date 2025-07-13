import React, { useState } from 'react';
import axios from 'axios';
import {
  Box, Button, TextField, Typography, Container,
  Paper, Avatar, CircularProgress, InputAdornment
} from '@mui/material';
import {
  PersonOutline, VerifiedUser
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const API_URL = 'http://localhost:5002';

function LoginPage({ onLogin }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/login`, { name });

      if (response.status === 200) {
        setTimeout(() => {
          onLogin(name);
          setLoading(false);
        }, 1000);
      } else {
        setError(`Login failed: ${response.data.message || 'Server error'}`);
        setLoading(false);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'No response from server. Is the backend running?';
      setError(`Login failed: ${errorMessage}`);
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
    }}>
      <Container maxWidth="xs">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper elevation={6} sx={{
            p: 5,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 4px 30px rgba(0,0,0,0.05)'
          }}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar sx={{ bgcolor: '#1976d2', mb: 2 }}>
                <VerifiedUser />
              </Avatar>
              <Typography variant="h5" fontWeight={600} color="#333" gutterBottom>
                Snello Agent Login
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Manage your To-Dos efficiently
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                <TextField
                  fullWidth
                  required
                  label="Enter your name"
                  variant="outlined"
                  margin="normal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={!!error}
                  helperText={error}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutline />
                      </InputAdornment>
                    )
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, py: 1.5, fontWeight: 600 }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={22} color="inherit" /> : 'Login'}
                </Button>
              </Box>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}

export default LoginPage;
