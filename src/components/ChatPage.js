import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Paper, Typography, List, ListItem, ListItemText, CircularProgress, IconButton, Chip } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import LogoutIcon from '@mui/icons-material/Logout';

const API_URL = 'http://localhost:5002';

// Receive userName and onLogout as props from App.js
function ChatPage({ userName, onLogout }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        console.log(`ChatPage: Component mounted for user: ${userName}`);
        const fetchHistory = async () => {
            if (!userName) return; // Don't fetch if userName isn't set yet
            setIsLoading(true);
            try {
                const response = await axios.get(`${API_URL}/api/history`, { params: { name: userName } });
                setMessages(response.data.history || []);
            } catch (error) {
                console.error("Failed to fetch history:", error);
            }
            setIsLoading(false);
        };
        fetchHistory();
    }, [userName]); // This hook now depends on the userName prop
    
    // The handleSendMessage function uses the userName prop
    const handleSendMessage = async (messageText = input) => {
        if (!messageText.trim() || !userName) return;

        const userMessage = { role: 'human', content: messageText };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_URL}/api/chat`, {
                message: messageText,
                userName: userName // Use the prop here
            });
            const agentMessage = { role: 'ai', content: response.data.response };
            setMessages(prev => [...prev, agentMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage = { role: 'ai', content: "Sorry, something went wrong. Please check the console." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        handleSendMessage(suggestion); // Input state is not needed here
    }
    
    const suggestionChips = [
        "What's on my to-do list?",
        "Add 'Buy groceries' to my list",
        "Add 'Finish SDE Assignment' to my to-do list with a deadline of tomorrow",
        "Remove 'Buy groceries'"
    ];

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'grey.100' }}>
            <Paper elevation={3} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'primary.main', color: 'white' }}>
                {/* Use the userName prop for the welcome message */}
                <Typography variant="h5">Snello Agent - Welcome, {userName}!</Typography>
                {/* The logout button now calls the onLogout function from App.js */}
                <IconButton color="inherit" onClick={onLogout} title="Logout">
                    <LogoutIcon />
                </IconButton>
            </Paper>

            {/* ... rest of the JSX is the same ... */}
            <List sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
                {messages.map((msg, index) => (
                    <ListItem key={index} sx={{ justifyContent: msg.role === 'human' ? 'flex-end' : 'flex-start' }}>
                        <Paper
                            elevation={2}
                            sx={{
                                p: 1.5,
                                maxWidth: '70%',
                                bgcolor: msg.role === 'human' ? 'primary.light' : 'white',
                                color: msg.role === 'human' ? 'primary.contrastText' : 'text.primary',
                                borderRadius: msg.role === 'human' ? '20px 20px 5px 20px' : '20px 20px 20px 5px'
                            }}
                        >
                            <ListItemText primary={msg.content.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)} />
                        </Paper>
                    </ListItem>
                ))}
                {isLoading && <ListItem sx={{justifyContent: 'flex-start'}}><CircularProgress size={24} /></ListItem>}
                <div ref={messagesEndRef} />
            </List>

            <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
                 <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                    {suggestionChips.map(chip => (
                        <Chip key={chip} label={chip} variant="outlined" onClick={() => handleSuggestionClick(chip)} />
                    ))}
                </Box>
                <Box component="form" sx={{ display: 'flex', gap: 1 }} onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                    />
                    <Button type="submit" variant="contained" endIcon={<SendIcon />} disabled={isLoading}>
                        Send
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default ChatPage;