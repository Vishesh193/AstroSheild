import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Divider,
} from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

const NewsletterSignup = ({
  title = "Stay Updated",
  description = "Subscribe to our newsletter for the latest news and updates on space debris monitoring and research.",
  variant = "default", // default, compact, inline
  backgroundColor = "rgba(25, 118, 210, 0.05)",
}) => {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const handleConsentChange = (e) => {
    setConsent(e.target.checked);
  };

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (!consent) {
      setError('Please agree to receive our newsletter');
      return;
    }
    
    try {
      // Send the email to our backend API
      const response = await axios.post('/api/newsletter/subscribe', { email });
      
      console.log('Newsletter signup response:', response.data);
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'Thank you for subscribing! Your email has been registered for our newsletter.',
        severity: 'success',
      });
      
      // Reset form
      setEmail('');
      setConsent(false);
    } catch (error) {
      console.error('Newsletter signup error:', error);
      
      // Show error message
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to subscribe. Please try again later.',
        severity: 'error',
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  // Inline variant
  if (variant === 'inline') {
    return (
      <Box sx={{ width: '100%' }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Your email address"
              value={email}
              onChange={handleEmailChange}
              error={!!error}
              helperText={error}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!email || !consent}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Subscribe
            </Button>
          </Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={consent}
                onChange={handleConsentChange}
                size="small"
              />
            }
            label={
              <Typography variant="caption">
                I agree to receive the newsletter and can unsubscribe at any time.
              </Typography>
            }
            sx={{ mt: 1 }}
          />
        </form>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    );
  }

  // Default and compact variants
  return (
    <Paper
      elevation={3}
      sx={{
        p: variant === 'compact' ? 2 : 3,
        borderRadius: 2,
        background: backgroundColor,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <MailOutlineIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant={variant === 'compact' ? 'h6' : 'h5'} component="h2">
          {title}
        </Typography>
      </Box>

      {variant !== 'compact' && (
        <Typography variant="body2" color="text.secondary" paragraph>
          {description}
        </Typography>
      )}

      <Divider sx={{ my: 2 }} />

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email Address"
          placeholder="your.email@example.com"
          value={email}
          onChange={handleEmailChange}
          error={!!error}
          helperText={error}
          size={variant === 'compact' ? 'small' : 'medium'}
          sx={{ mb: 2 }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={consent}
              onChange={handleConsentChange}
              color="primary"
            />
          }
          label={
            <Typography variant="body2">
              I agree to receive the newsletter and can unsubscribe at any time.
            </Typography>
          }
          sx={{ mb: 2 }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          disabled={!email || !consent}
          fullWidth={variant === 'compact'}
        >
          Subscribe
        </Button>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default NewsletterSignup; 