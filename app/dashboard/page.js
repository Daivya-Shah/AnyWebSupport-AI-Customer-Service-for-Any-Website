'use client';

import { Box, Stack, TextField, Typography, IconButton, Avatar, Button, Rating } from '@mui/material';
import { useState, useRef, useEffect } from 'react';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import '../i18n'; 
import { firestore } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';

const Header = styled(Box)(({ theme }) => ({
  background: '#00BFA5',
  color: '#FFFFFF',
  borderRadius: '16px 16px 0 0',
  textAlign: 'center',
  padding: theme.spacing(2),
  position: 'relative',
  zIndex: 1,
}));

const MessageBubble = styled(Box)(({ role }) => ({
  backgroundColor: role === 'assistant' ? '#0288D1' : '#00ACC1',
  color: '#FFFFFF',
  borderRadius: '16px',
  padding: '16px',
  maxWidth: '75%',
  wordBreak: 'break-word',
  lineHeight: '1.5',
  fontSize: '15px',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  animation: 'fadeIn 0.3s ease-in-out',
  '@keyframes fadeIn': {
    from: { opacity: 0, transform: 'translateY(10px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
}));

const Timestamp = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  color: 'lightgrey',
  position: 'absolute',
  bottom: '-20px',
  right: '8px',
  marginTop: '4px',
}));

const TypingIndicator = ({ t }) => (
  <Box display="flex" justifyContent="center" alignItems="center" p={2}>
    <Typography variant="body2" sx={{ color: "lightgray" }}>
      {t('typing')}
    </Typography>
  </Box>
);

const getCurrentTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

export default function Home() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: t('greeting'),
      timestamp: getCurrentTime(),
    },
  ]);

  const [message, setMessage] = useState('');
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true);

    const newUserMessage = { role: 'user', content: message, timestamp: getCurrentTime() };
    const newAssistantMessage = { role: 'assistant', content: '. . .', timestamp: getCurrentTime() };

    setMessages((prevMessages) => [
      ...prevMessages,
      newUserMessage,
      newAssistantMessage,
    ]);

    setIsAssistantTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{ role: 'system', content: url }, ...messages, newUserMessage]),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let updatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        updatedContent += decoder.decode(value, { stream: true });

        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1] = {
            ...updatedMessages[updatedMessages.length - 1],
            content: updatedContent,
          };
          return updatedMessages;
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: t('error'), timestamp: getCurrentTime() },
      ]);
    }

    setIsAssistantTyping(false);
    setIsLoading(false);
    setMessage('');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    const element = messagesEndRef.current;
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleLanguageChange = async (lng) => {
    await i18n.changeLanguage(lng);
    const newGreetingMessage = { role: 'assistant', content: t('greeting'), timestamp: getCurrentTime() };
    setMessages((prevMessages) => [
      ...prevMessages,
      newGreetingMessage,
    ]);
  };

  const endChat = () => {
    setIsFeedbackVisible(true);
  };

  const submitFeedback = async () => {
    try {
      const feedbackData = {
        rating: feedbackRating,
        comment: feedbackComment,
        timestamp: getCurrentTime(),
      };

      const feedbackCollectionRef = collection(firestore, 'feedback');
      await addDoc(feedbackCollectionRef, feedbackData);

      setFeedbackRating(0);
      setFeedbackComment('');
      setIsFeedbackVisible(false);
      alert(t('Thank you for your feedback!'));
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert(`${t('There is an error submitting your feedback!')}: ${error.message}`);
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        background: '#243B55',
        p: 2,
        position: 'relative',
      }}
    >
      <Stack
        direction="column"
        width="90vw"
        maxWidth="90vw"
        height="90vh"
        borderRadius={16}
        border="1px solid #00BFA5"
        boxShadow="0 4px 24px rgba(0, 0, 0, 0.75)"
        p={4}
        spacing={2}
        sx={{
          backgroundColor: '#1B2735',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Header */}
        <Header>
          <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: 0.5 }}>
            {t('chatbotTitle')}
          </Typography>
        </Header>

        {/* URL Input */}
        <TextField
          label={t('Enter page URL')}
          fullWidth
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          variant="outlined"
          size="small"
          sx={{
            backgroundColor: '#243B55',
            borderRadius: 12,
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              '& fieldset': {
                borderColor: 'transparent', // Make the default border transparent
              },
              '&:hover fieldset': {
                borderColor: '#00BFA5', // Set hover border color
              },
              '&.Mui-focused fieldset': {
                borderColor: '#00BFA5', // Set focus border color
              },
            },
            '& .MuiInputBase-input': {
              padding: '10px 14px',
              color: '#FFFFFF',
            },
            '& .MuiInputLabel-root': {
              color: 'lightgray',
            },
          }}
        />

        <Stack
          direction="column"
          spacing={4}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
          p={2}
          sx={{
            backgroundColor: '#18202B',
            borderRadius: 1,
            boxShadow: 'inset 0 2px 5px rgba(0, 0, 0, 0.5)',
            overflowY: 'auto',
            position: 'relative',
          }}
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={msg.role === 'assistant' ? 'flex-start' : 'flex-end'}
              position="relative"
            >
              <Stack direction="row" spacing={1} alignItems="flex-end">
                {msg.role === 'assistant' ? (
                  <>
                    <Avatar sx={{ backgroundColor: '#00ACC1', width: 40, height: 40 }}>
                      <AutoAwesomeIcon />
                    </Avatar>
                    <MessageBubble role={msg.role}>
                      <Typography variant="body2">{msg.content}</Typography>
                      <Timestamp variant="caption">{msg.timestamp}</Timestamp>
                    </MessageBubble>
                  </>
                ) : (
                  <>
                    <MessageBubble role={msg.role}>
                      <Typography variant="body2">{msg.content}</Typography>
                      <Timestamp variant="caption">{msg.timestamp}</Timestamp>
                    </MessageBubble>
                    <Avatar sx={{ backgroundColor: '#0288D1', width: 40, height: 40 }}>
                      <PersonIcon />
                    </Avatar>
                  </>
                )}
              </Stack>
            </Box>
          ))}
          {isAssistantTyping && <TypingIndicator t={t} />}
          <div ref={messagesEndRef} aria-live="polite" />
        </Stack>

        {/* Language Switcher */}
        <Stack direction="row" spacing={1} sx={{ mb: 2, justifyContent: 'center' }}>
          <Button onClick={() => handleLanguageChange('fr')}>Français</Button>
          <Button onClick={() => handleLanguageChange('ch')}>中文</Button>
          <Button onClick={() => handleLanguageChange('en')}>English</Button>
          <Button onClick={() => handleLanguageChange('hi')}>हिन्दी</Button>
          <Button onClick={() => handleLanguageChange('es')}>Español</Button>
        </Stack>

        {/* Text Input and Send Button */}
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <TextField
            label={t('typeMessage')}
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            variant="outlined"
            size="small"
            sx={{
              backgroundColor: '#243B55',
              borderRadius: 12,
              '& .MuiOutlinedInput-root': {
                borderRadius: 12,
                '& fieldset': {
                  borderColor: 'transparent', // Make the default border transparent
                },
                '&:hover fieldset': {
                  borderColor: '#00BFA5', // Set hover border color
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#00BFA5', // Set focus border color
                },
              },
              '& .MuiInputBase-input': {
                padding: '10px 14px',
                color: '#FFFFFF',
              },
              '& .MuiInputLabel-root': {
                color: 'lightgray',
              },
            }}
          />

          <IconButton
            onClick={sendMessage}
            disabled={isLoading || !message.trim()}
            size="large"
            sx={{
              borderRadius: 12,
              backgroundColor: '#00ACC1',
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: '#0288D1',
              },
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              padding: '12px',
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </Stack>

      {/* End Chat Button */}
      <Button
        onClick={endChat}
        variant="contained"
        color="primary"
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          padding: '6px 12px',
          fontSize: '0.875rem',
          borderRadius: '8px',
          backgroundColor: '#00ACC1',
          '&:hover': {
            backgroundColor: '#0288D1',
          },
        }}
      >
        {t('Give Feedback')}
      </Button>

      {/* Back to Homepage Button */}
      <Button
        onClick={() => router.push('/')}
        variant="contained"
        color="primary"
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          padding: '6px 12px',
          fontSize: '0.875rem',
          borderRadius: '8px',
          backgroundColor: '#00ACC1',
          '&:hover': {
            backgroundColor: '#0288D1',
          },
        }}
      >
        {t('Home Page')}
      </Button>

      {/* Feedback Form */}
      {isFeedbackVisible && (
        <Box
          p={4}
          sx={{
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 1)',
            backgroundColor: '#1B2735',
            position: 'absolute',
            bottom: '16px',
            width: 'calc(100% - 32px)',
            maxWidth: '600px',
            textAlign: 'center',
            left: '16px',
            zIndex: 10,
            border: '1px solid #00BFA5',
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 'bold', color: 'lightgray' }}>
            {t('Please leave feedback!')}
          </Typography>
          <Rating
            value={feedbackRating}
            onChange={(event, newValue) => setFeedbackRating(newValue)}
            precision={0.5}
            sx={{ color: '#00BFA5' }}
          />
          <Stack spacing={2} alignItems="center">
            <TextField
              label={t('Leave your feedback here!')}
              multiline
              rows={3}
              value={feedbackComment}
              onChange={(e) => setFeedbackComment(e.target.value)}
              variant="outlined"
              sx={{
                mb: 2,
                width: '100%',
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#243B55',
                  '& fieldset': {
                    borderColor: 'transparent', // Make the default border transparent
                  },
                  '&:hover fieldset': {
                    borderColor: '#00BFA5', // Set hover border color
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00BFA5', // Set focus border color
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'lightgray',
                },
                '& .MuiOutlinedInput-input': {
                  padding: '12px',
                  color: '#FFFFFF',
                },
              }}
            />
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                onClick={submitFeedback}
                variant="contained"
                color="primary"
                size="large"
                disabled={!feedbackComment.trim()}
                sx={{
                  borderRadius: '8px',
                  padding: '10px 20px',
                  backgroundColor: '#00ACC1',
                  '&:hover': {
                    backgroundColor: '#0288D1',
                  },
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
              >
                {t('Submit')}
              </Button>
              <Button
                onClick={() => setIsFeedbackVisible(false)}
                variant="outlined"
                color="secondary"
                size="large"
                sx={{
                  borderRadius: '8px',
                  padding: '10px 20px',
                  borderColor: '#00ACC1',
                  '&:hover': {
                    borderColor: '#0288D1',
                  },
                  color: 'lightgray',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
              >
                {t('Cancel')}
              </Button>
            </Stack>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
