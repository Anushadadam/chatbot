import React, { useState } from 'react';
import axios from 'axios';
import {
  Box, Button, TextField, Typography, Container,
  Paper, Avatar, CircularProgress, InputAdornment,
  Fade, Divider, IconButton, Grid
} from '@mui/material';
import {
  PersonOutline, VerifiedUser, Lock, Visibility, VisibilityOff,
  Favorite, EmojiEmotions, Rocket, AutoFixHigh
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const API_URL = 'http://localhost:5002';

function LoginPage({ onLogin }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <AutoFixHigh sx={{ fontSize: 36, color: '#8c52ff' }} />,
      title: "Smart Task Management",
      description: "Add, remove, and organize tasks with natural language commands"
    },
    {
      icon: <Rocket sx={{ fontSize: 36, color: '#5ce1e6' }} />,
      title: "Lightning Fast",
      description: "Instant responses and seamless task management experience"
    },
    {
      icon: <EmojiEmotions sx={{ fontSize: 36, color: '#ff9e80' }} />,
      title: "Friendly Assistant",
      description: "Your AI companion makes productivity fun and enjoyable"
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Simulate login process
      setTimeout(() => {
        onLogin(name);
        setLoading(false);
      }, 1200);
    } catch (err) {
      setError(`Login failed: ${err.message || 'Unknown error'}`);
      setLoading(false);
    }
  };

  

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f7ff 0%, #f0e8ff 100%)',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: "'Poppins', sans-serif"
    }}>
      {/* Decorative Elements */}
      <Box sx={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #8c52ff33 0%, #5ce1e633 100%)',
        zIndex: 0
      }} />
      
      <Box sx={{
        position: 'absolute',
        bottom: '-150px',
        left: '-150px',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #ff9e8033 0%, #ff6b6b33 100%)',
        zIndex: 0
      }} />
      
      <Container maxWidth="md">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Paper elevation={6} sx={{
                p: 4,
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(140, 82, 255, 0.15)',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Box sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: '#e0d4ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    border: '2px solid #8c52ff'
                  }}>
                    <VerifiedUser sx={{ color: '#8c52ff', fontSize: 40 }} />
                  </Box>
                  
                  <Typography variant="h4" fontWeight={700} color="#333" gutterBottom sx={{
                    fontFamily: "'Poppins', sans-serif",
                    background: 'linear-gradient(90deg, #8c52ff 0%, #5ce1e6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    Snello Assistant
                  </Typography>
                  
                  <Typography variant="body1" color="text.secondary" mb={3} textAlign="center">
                    Your professional AI task manager
                  </Typography>
                  
                  <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                    <TextField
                      fullWidth
                      required
                      label="Your Name"
                      variant="outlined"
                      margin="normal"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      error={!!error}
                      helperText={error}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutline sx={{ color: '#8c52ff' }} />
                          </InputAdornment>
                        ),
                        sx: {
                          borderRadius: '12px',
                          bgcolor: '#f9f9ff',
                          '& fieldset': {
                            borderColor: '#e0d4ff',
                          },
                          '&:hover fieldset': {
                            borderColor: '#8c52ff',
                          },
                        }
                      }}
                    />
                    
                    
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ 
                          mt: 3, 
                          py: 1.5, 
                          fontWeight: 600,
                          fontSize: '1rem',
                          borderRadius: '12px',
                          bgcolor: '#8c52ff',
                          '&:hover': {
                            bgcolor: '#7a45e6',
                          },
                          boxShadow: '0 4px 12px rgba(140, 82, 255, 0.3)'
                        }}
                        disabled={loading}
                      >
                        {loading ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          <>
                            Login & Start Managing
                            <Rocket sx={{ ml: 1 }} />
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ pl: { md: 4 }, position: 'relative', zIndex: 1 }}>
              <Typography variant="h5" fontWeight={700} mb={3} sx={{ 
                color: '#333',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <Favorite sx={{ color: '#ff6b6b' }} /> Why you'll love Snello
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: activeFeature === index ? 1 : 0.7,
                      x: 0
                    }}
                    transition={{ duration: 0.4 }}
                    onHoverStart={() => setActiveFeature(index)}
                    sx={{
                      p: 3,
                      mb: 2,
                      borderRadius: 3,
                      bgcolor: activeFeature === index ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                      boxShadow: activeFeature === index ? '0 8px 24px rgba(140, 82, 255, 0.15)' : '0 4px 12px rgba(0,0,0,0.05)',
                      border: activeFeature === index ? '1px solid #e0d4ff' : '1px solid rgba(255, 255, 255, 0.5)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Box display="flex" alignItems="center" mb={1.5}>
                      {feature.icon}
                      <Typography variant="h6" fontWeight={600} ml={2} sx={{ 
                        color: activeFeature === index ? '#8c52ff' : '#5a5560'
                      }}>
                        {feature.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ 
                      color: activeFeature === index ? '#5a5560' : '#777',
                      pl: 6
                    }}>
                      {feature.description}
                    </Typography>
                  </motion.div>
                ))}
              </Box>
              
              <Box sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.7)', 
                p: 3, 
                borderRadius: 3,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}>
                <Typography variant="body2" mb={1} sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  fontWeight: 500
                }}>
                  <EmojiEmotions sx={{ color: '#ff9e80', mr: 1 }} /> 
                  "Snello makes managing tasks feel like chatting with a helpful friend!"
                </Typography>
                <Typography variant="caption" sx={{ 
                  display: 'block', 
                  textAlign: 'right',
                  color: '#8c52ff',
                  fontWeight: 600
                }}>
                  — Happy User
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
      
      <Box sx={{
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: '#777'
      }}>
        <Typography variant="caption">
          © 2023 Snello Assistant. Making productivity cute and fun!
        </Typography>
      </Box>
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        body {
          margin: 0;
          font-family: 'Poppins', sans-serif;
          background-color: #f9f9ff;
        }
        
        .MuiInputBase-input {
          font-family: 'Poppins', sans-serif;
        }
        
        .MuiButton-root {
          font-family: 'Poppins', sans-serif;
          text-transform: none;
        }
      `}</style>
    </Box>
  );
}

export default LoginPage;