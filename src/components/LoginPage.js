import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, Container, Paper, Avatar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const API_URL = 'http://localhost:5002';

// We receive the `onLogin` function as a prop from App.js
function LoginPage({ onLogin }) {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Please enter your name.');
            return;
        }
        
        setError('');
        console.log(`LoginPage: Attempting to validate user: ${name}`);

        try {
            // We still hit the backend to create the user if they don't exist.
            const response = await axios.post(`${API_URL}/api/login`, { name });
            
            if (response.status === 200) {
                console.log('LoginPage: User validated by backend. Calling onLogin.');
                // If the backend call is successful, we call the onLogin function.
                // This will update the state in App.js and trigger the redirect.
                onLogin(name); 
            } else {
                setError(`Login failed: ${response.data.message || 'Server error'}`);
            }

        } catch (err) {
            console.error('An error occurred during login:', err);
            const errorMessage = err.response?.data?.error || 'No response from server. Is the backend running?';
            setError(`Login failed: ${errorMessage}`);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={6} sx={{ marginTop: 8, padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 2 }}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Welcome to Snello Agent
                </Typography>
                <Typography component="p" sx={{ mt: 1, color: 'text.secondary' }}>
                    Please enter your name to begin.
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Your Name"
                        name="name"
                        autoComplete="name"
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={!!error}
                        helperText={error}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, py: 1.5 }}
                    >
                        Start Chatting
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}

export default LoginPage;