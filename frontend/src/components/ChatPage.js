import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Box, TextField, Button, Paper, Typography, List, ListItem, CircularProgress,
  IconButton, Chip, Avatar, Tooltip
} from '@mui/material';
import {
  Send as SendIcon, Logout as LogoutIcon, Person as PersonIcon,
  AutoFixHigh, PsychologyAlt as ProfessionalBotIcon,
  HelpOutline as HelpIcon, ListAlt as TodoIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = 'http://localhost:5002';

function ChatPage({ userName, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!userName) return;
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/history`, { params: { name: userName } });
        setMessages(res.data.history || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [userName]);

  const handleSendMessage = async (msgText = input) => {
    if (!msgText.trim()) return;
    setMessages(prev => [...prev, { role: 'human', content: msgText }]);
    setInput('');
    setIsLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/chat`, {
        message: msgText,
        userName
      });
      setMessages(prev => [...prev, { role: 'ai', content: data.response }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'ai', content: 'An error occurred. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserGuideClick = () => {
    const guide = [
      'You can ask me to manage your to-do list!',
      'Examples:',
      "- Add 'Finish homework' to my list",
      "- What’s on my to-do list?",
      "- Remove 'Buy groceries'"
    ].join('\n');
    setMessages(prev => [...prev, { role: 'ai', content: guide }]);
  };

  const handleListTodos = () => {
    handleSendMessage("What's on my to-do list?");
  };

  const suggestionChips = [
    "What's on my to-do list?",
    "Add 'Buy groceries' to my list",
    "Add 'Finish project report'",
    "Remove 'Buy groceries'",
    "Show me my tasks"
  ];

  const formatContent = content =>
    content.split('\n').map((line, i) => <span key={i}>{line}<br /></span>);

  const AgentAvatar = () => (
    <Avatar sx={{ bgcolor: '#0d47a1', width: 40, height: 40 }}>
      <ProfessionalBotIcon sx={{ color: '#fff' }} />
    </Avatar>
  );

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f0f8ff' }}>
      <Paper elevation={2} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#0d47a1' }}>
          Snello Agent
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="User Guide">
            <IconButton onClick={handleUserGuideClick} color="primary">
              <HelpIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="List To-Dos">
            <IconButton onClick={handleListTodos} color="primary">
              <TodoIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#424242', mx: 2 }}>
            <PersonIcon /> {userName}
          </Typography>
          <IconButton onClick={onLogout} color="error">
            <LogoutIcon />
          </IconButton>
        </Box>
      </Paper>

      <List sx={{ flexGrow: 1, px: 3, py: 2, overflowY: 'auto' }}>
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
              <ListItem sx={{ justifyContent: msg.role === 'human' ? 'flex-end' : 'flex-start' }}>
                {msg.role === 'ai' && <AgentAvatar />}
                <Paper sx={{ p: 2, bgcolor: msg.role === 'human' ? '#1976d2' : '#e3f2fd', color: msg.role === 'human' ? '#fff' : '#0d47a1', borderRadius: 2, mx: 1, maxWidth: '75%' }}>
                  <Typography variant="body2">{formatContent(msg.content)}</Typography>
                </Paper>
                {msg.role === 'human' && (
                  <Avatar sx={{ bgcolor: '#1976d2' }}><PersonIcon /></Avatar>
                )}
              </ListItem>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <ListItem>
            <AgentAvatar />
            <Box ml={2} display="flex" alignItems="center">
              <CircularProgress size={18} color="primary" />
              <Typography ml={1} variant="body2">Processing...</Typography>
            </Box>
          </ListItem>
        )}
        <div ref={messagesEndRef} />
      </List>

      <Box px={3} py={1} borderTop="1px solid #e0e0e0" bgcolor="#ffffff">
        <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#0d47a1', fontWeight: 600, mb: 1 }}>
          <AutoFixHigh fontSize="small" /> Quick Suggestions
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1}>
          {suggestionChips.map((text, idx) => (
            <Chip
              key={idx}
              label={text}
              onClick={() => handleSendMessage(text)}
              sx={{ bgcolor: '#f5f5f5', color: '#0d47a1', border: '1px solid #90caf9', '&:hover': { bgcolor: '#e3f2fd' } }}
              variant="outlined"
            />
          ))}
        </Box>
      </Box>

      <Box component="form" onSubmit={e => { e.preventDefault(); handleSendMessage(); }} px={3} py={2} bgcolor="#ffffff" display="flex" alignItems="center" gap={1}>
        <TextField
          fullWidth
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          variant="outlined"
          size="small"
          disabled={isLoading}
        />
        <Button
          type="submit"
          variant="contained"
          endIcon={<SendIcon />}
          disabled={!input.trim() || isLoading}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
}

export default ChatPage;
