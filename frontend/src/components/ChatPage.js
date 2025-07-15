import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Box, TextField, Button, Paper, Typography, List, ListItem, CircularProgress,
  IconButton, Chip, Avatar, Tooltip, Badge
} from '@mui/material';
import {
  Send as SendIcon, Logout as LogoutIcon, Person as PersonIcon,
  AutoFixHigh, Psychology as ProfessionalBotIcon,
  HelpOutline as HelpIcon, ListAlt as TodoIcon, Mood, Favorite
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = 'http://localhost:5002';

function ChatPage({ userName, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [reactions, setReactions] = useState({});

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
        setMessages(prev => [...prev, { 
          role: 'ai', 
          content: "Welcome to your chat!." 
        }]);
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
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: 'Oops! Something went wrong. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserGuideClick = () => {
    const guide = [
      '📚 How to use this chat:',
      '• Add tasks: "Add \'Finish homework\' to my list"',
      '• Check tasks: "What\'s on my to-do list?"',
      '• Remove tasks: "Remove \'Buy groceries\'"',
      '• Just chat!"'
    ].join('\n');
    setMessages(prev => [...prev, { role: 'ai', content: guide }]);
  };

  const handleListTodos = () => {
    handleSendMessage("What's on my to-do list?");
  };

  const handleReaction = (index, reactionType) => {
    setReactions(prev => {
      // If clicking the same reaction again, remove it
      if (prev[index] === reactionType) {
        const newReactions = { ...prev };
        delete newReactions[index];
        return newReactions;
      }
      // Otherwise set the new reaction
      return { ...prev, [index]: reactionType };
    });
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
    <Avatar sx={{ 
      background: 'linear-gradient(135deg, #8c52ff, #5ce1e6)', 
      width: 42, 
      height: 42
    }}>
      <ProfessionalBotIcon sx={{ color: '#fff' }} />
    </Avatar>
  );

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#f9f7fe',
      backgroundImage: 'radial-gradient(#e0d4ff 1px, transparent 1px)',
      backgroundSize: '20px 20px',
      fontFamily: '"Poppins", sans-serif'
    }}>
      {/* Header */}
      <Paper elevation={0} sx={{ 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderRadius: 0,
        boxShadow: '0 2px 10px rgba(140, 82, 255, 0.1)',
        background: 'linear-gradient(to right, #8c52ff, #5ce1e6)'
      }}>
        <Box display="flex" alignItems="center">
          <Box sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 1.5,
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
          }}>
            <ProfessionalBotIcon sx={{ color: '#8c52ff', fontSize: 24 }} />
          </Box>
          <Typography variant="h6" sx={{ 
            fontWeight: 700, 
            color: '#fff',
            fontFamily: '"Poppins", sans-serif',
            letterSpacing: '0.5px'
          }}>
            Snello Assistant
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="User Guide" arrow>
            <IconButton 
              onClick={handleUserGuideClick} 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } 
              }}
            >
              <HelpIcon sx={{ color: '#fff' }} />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="List To-Dos" arrow>
            <IconButton 
              onClick={handleListTodos} 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } 
              }}
            >
              <TodoIcon sx={{ color: '#fff' }} />
            </IconButton>
          </Tooltip>
          
          <Chip
            avatar={<Avatar sx={{ bgcolor: '#ff9e80' }}><PersonIcon /></Avatar>}
            label={userName}
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)', 
              color: '#fff', 
              fontWeight: 600,
              fontFamily: '"Poppins", sans-serif'
            }}
          />
          
          <Tooltip title="Logout" arrow>
            <IconButton 
              onClick={onLogout} 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } 
              }}
            >
              <LogoutIcon sx={{ color: '#fff' }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* Chat Messages */}
      <List sx={{ 
        flexGrow: 1, 
        px: 3, 
        py: 2, 
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#d0bfff',
          borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#8c52ff',
        }
      }}>
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ListItem sx={{ 
                justifyContent: msg.role === 'human' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-start',
                py: 1
              }}>
                {msg.role === 'ai' && (
                  <Box sx={{ mr: 1.5, mt: 0.5 }}>
                    <AgentAvatar />
                  </Box>
                )}
                
                <Paper sx={{ 
                  p: 2, 
                  background: msg.role === 'human' ? 'linear-gradient(135deg, #8c52ff, #5ce1e6)' : '#ffffff', 
                  color: msg.role === 'human' ? '#fff' : '#5a5560', 
                  borderRadius: '20px',
                  borderBottomLeftRadius: msg.role === 'ai' ? '5px' : '20px',
                  borderBottomRightRadius: msg.role === 'human' ? '5px' : '20px',
                  maxWidth: '80%',
                  boxShadow: '0 4px 12px rgba(140, 82, 255, 0.1)',
                  position: 'relative',
                  overflow: 'visible'
                }}>
                  <Typography variant="body1" sx={{ 
                    fontWeight: msg.role === 'human' ? 500 : 400,
                    fontFamily: '"Poppins", sans-serif',
                    lineHeight: 1.6
                  }}>
                    {formatContent(msg.content)}
                  </Typography>
                  
                  {msg.role === 'ai' && (
                    <Box sx={{ 
                      position: 'absolute', 
                      bottom: -18, 
                      left: 12,
                      display: 'flex',
                      gap: 0.5
                    }}>
                      <Tooltip title="I love this!" arrow>
                        <IconButton 
                          size="small" 
                          sx={{ 
                            bgcolor: '#f5f0ff',
                            '&:hover': { bgcolor: '#e6d9ff' },
                            p: 0.5,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                          onClick={() => handleReaction(idx, 'heart')}
                        >
                          <Favorite sx={{ 
                            color: reactions[idx] === 'heart' ? '#ff6b6b' : '#c0b3d6',
                            fontSize: 16
                          }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="This makes me happy" arrow>
                        <IconButton 
                          size="small" 
                          sx={{ 
                            bgcolor: '#f5f0ff',
                            '&:hover': { bgcolor: '#e6d9ff' },
                            p: 0.5,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                          onClick={() => handleReaction(idx, 'smile')}
                        >
                          <Mood sx={{ 
                            color: reactions[idx] === 'smile' ? '#ffd166' : '#c0b3d6',
                            fontSize: 16
                          }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </Paper>
                
                {msg.role === 'human' && (
                  <Box sx={{ ml: 1.5, mt: 0.5 }}>
                    <Avatar sx={{ 
                      bgcolor: '#ff9e80', 
                      width: 42, 
                      height: 42,
                      border: '2px solid #ff6b6b'
                    }}>
                      <PersonIcon />
                    </Avatar>
                  </Box>
                )}
              </ListItem>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <ListItem sx={{ pl: 9.5 }}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box sx={{ 
                width: 32, 
                height: 32, 
                borderRadius: '50%', 
                bgcolor: '#f0e6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 1.5s infinite'
              }}>
                <ProfessionalBotIcon sx={{ color: '#8c52ff', fontSize: 18 }} />
              </Box>
              <Typography variant="body2" sx={{ color: '#8c52ff', fontWeight: 500 }}>
                Thinking...
              </Typography>
            </Box>
          </ListItem>
        )}
        <div ref={messagesEndRef} />
      </List>

      {/* Suggestions */}
      <Box px={3} py={1.5} bgcolor="#ffffff" borderTop="1px solid #f0f0f0">
        <Typography variant="subtitle2" sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          color: '#8c52ff', 
          fontWeight: 600, 
          mb: 1,
          fontFamily: '"Poppins", sans-serif'
        }}>
          <AutoFixHigh fontSize="small" /> Quick Suggestions
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1}>
          {suggestionChips.map((text, idx) => (
            <Chip
              key={idx}
              label={text}
              onClick={() => handleSendMessage(text)}
              disabled={isLoading}
              sx={{ 
                bgcolor: '#f0e8ff', 
                color: '#5a5560', 
                fontWeight: 500,
                borderRadius: '16px',
                border: '1px solid #d0bfff',
                '&:hover': { 
                  bgcolor: '#e0d4ff',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 2px 6px rgba(140, 82, 255, 0.2)'
                },
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              variant="outlined"
            />
          ))}
        </Box>
      </Box>

      {/* Input Area */}
      <Box 
        component="form" 
        onSubmit={e => { e.preventDefault(); handleSendMessage(); }} 
        px={3} 
        py={2} 
        bgcolor="#ffffff" 
        display="flex" 
        alignItems="center" 
        gap={1.5}
        borderTop="1px solid #f0f0f0"
        boxShadow="0 -2px 10px rgba(0,0,0,0.05)"
      >
        <TextField
          fullWidth
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          variant="outlined"
          size="medium"
          disabled={isLoading}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '24px',
              bgcolor: '#f9f7fe',
              '& fieldset': {
                borderColor: '#e0d4ff',
              },
              '&:hover fieldset': {
                borderColor: '#8c52ff',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#8c52ff',
                boxShadow: '0 0 0 2px rgba(140, 82, 255, 0.2)'
              },
            }
          }}
        />
        
        <Button
          type="submit"
          variant="contained"
          disabled={!input.trim() || isLoading}
          sx={{
            minWidth: 'auto',
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8c52ff, #5ce1e6)',
            '&:hover': {
              background: 'linear-gradient(135deg, #7a45e6, #4ccfd4)',
              transform: 'scale(1.05)'
            },
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(140, 82, 255, 0.3)'
          }}
        >
          <SendIcon sx={{ color: '#fff' }} />
        </Button>
      </Box>
      
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
          }
          body {
            margin: 0;
            font-family: 'Poppins', sans-serif;
            background-color: #f9f7fe;
          }
        `}
      </style>
    </Box>
  );
}

export default ChatPage;