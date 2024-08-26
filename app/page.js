'use client';

import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';
import { useRouter } from 'next/navigation';
import WebIcon from '@mui/icons-material/Web';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';

export default function HomePage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/dashboard'); // Navigates to the AnyWebSupport AI Dashboard
  };

  const handleContactMe = () => {
    window.open('https://daivyashah.com/', '_blank'); // Opens your webpage in a new tab
  };

  const primaryColor = '#00BFA5';
  const secondaryColor = '#00ACC1';
  const backgroundColor = '#243B55';
  const textColor = '#FFFFFF';
  const lightTextColor = 'lightgray';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        backgroundColor: backgroundColor,
        backgroundImage: 'url(/background.jpg)', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: textColor,
        textAlign: 'center',
        flexDirection: 'column',
        gap: 4,
        overflow: 'hidden',
      }}
    >
      {/* Dark Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.75)', // Dark semi-transparent overlay
          zIndex: 1,
        }}
      />

      {/* Content */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 'bold',
            mb: 4,
            letterSpacing: '0.05em',
            background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor}, ${primaryColor})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          AnyWebSupport AI
        </Typography>
        <Typography
          variant="h5"
          component="h2"
          sx={{
            mb: 4,
            fontWeight: '300',
            color: textColor,
          }}
        >
          Your AI-Powered Customer Service Solution for Any Webpage
        </Typography>

        {/* Key Features Section */}
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={3}
              sx={{
                padding: 3,
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                color: textColor,
                borderRadius: '16px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                border: `1px solid ${primaryColor}`,
                transition: 'transform 0.3s ease, background 0.3s ease', // Smoothly trasitions the scale and bacgorund color when the 'Paper' is hovered over
                '&:hover': {
                  transform: 'scale(1.05)',
                  background: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              <SupportAgentIcon sx={{ fontSize: 40, mb: 2 }} />
              <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
                Real-Time Customer Assistance
              </Typography>
              <Typography variant="body2">
                Provide immediate, AI-driven customer support based on the exact content of your website. Our chatbot ensures users receive precise information when they need it.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Paper
              elevation={3}
              sx={{
                padding: 3,
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                color: textColor,
                borderRadius: '16px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                border: `1px solid ${primaryColor}`,
                transition: 'transform 0.3s ease, background 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  background: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              <WebIcon sx={{ fontSize: 40, mb: 2 }} />
              <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
                Seamless Web Integration
              </Typography>
              <Typography variant="body2">
                AnyWebSupport AI integrates effortlessly with any webpage. Simply provide a URL, and our AI will learn the content and provide accurate responses to user inquiries.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Paper
              elevation={3}
              sx={{
                padding: 3,
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                color: textColor,
                borderRadius: '16px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                border: `1px solid ${primaryColor}`,
                transition: 'transform 0.3s ease, background 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  background: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              <ThumbsUpDownIcon sx={{ fontSize: 40, mb: 2 }} />
              <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
                Enhanced User Experience
              </Typography>
              <Typography variant="body2">
                Improve user engagement and satisfaction by delivering quick, relevant answers tailored to the specific content of your webpage, all powered by AI.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Get Started and Contact Me Buttons */}
        <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleGetStarted}
            sx={{
              background: primaryColor,
              color: 'white',
              fontWeight: 'bold',
              borderRadius: '16px',
              padding: '10px 20px',
              boxShadow: '0 3px 5px 2px rgba(0, 229, 255, 0.3)',
              '&:hover': {
                background: secondaryColor,
              },
            }}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            onClick={handleContactMe}
            sx={{
              borderColor: primaryColor,
              color: primaryColor,
              borderRadius: '16px',
              padding: '10px 20px',
              boxShadow: '0 3px 5px 2px rgba(0, 229, 255, 0.3)',
              '&:hover': {
                borderColor: secondaryColor,
                color: secondaryColor,
              },
            }}
          >
            Contact Me
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
