import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Rating,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Snackbar,
  Alert,
  Divider,
  Chip,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import FeedbackIcon from '@mui/icons-material/Feedback';
import StarIcon from '@mui/icons-material/Star';

const FeedbackForm = ({ 
  title = "We Value Your Feedback", 
  subtitle = "Help us improve our platform by sharing your thoughts and suggestions.",
  onSubmit,
  compact = false,
}) => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedbackType: 'general',
    rating: 0,
    message: '',
  });
  
  // UI state
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleRatingChange = (event, newValue) => {
    setFormData({
      ...formData,
      rating: newValue,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Feedback message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // If onSubmit prop is provided, call it with form data
    if (onSubmit) {
      onSubmit(formData);
    }
    
    // Show success message
    setSnackbar({
      open: true,
      message: 'Thank you for your feedback!',
      severity: 'success',
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      feedbackType: 'general',
      rating: 0,
      message: '',
    });
    
    setSubmitted(true);
  };

  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const feedbackTypes = [
    { value: 'general', label: 'General Feedback' },
    { value: 'bug', label: 'Bug Report' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'content', label: 'Content Suggestion' },
  ];

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: compact ? 2 : 4,
        borderRadius: 2,
        background: 'linear-gradient(to bottom, rgba(25, 118, 210, 0.02), rgba(25, 118, 210, 0.08))'
      }}
    >
      {submitted ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <FeedbackIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Thank You for Your Feedback!
          </Typography>
          <Typography variant="body1" paragraph>
            We appreciate you taking the time to share your thoughts with us.
            Your feedback helps us improve our platform.
          </Typography>
          <Button 
            variant="outlined" 
            onClick={() => setSubmitted(false)}
            sx={{ mt: 2 }}
          >
            Submit Another Response
          </Button>
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FeedbackIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h5" component="h2">
              {title}
            </Typography>
          </Box>
          
          {!compact && (
            <Typography variant="body1" color="text.secondary" paragraph>
              {subtitle}
            </Typography>
          )}
          
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 3 }}>
              <Divider sx={{ my: 2 }}>
                <Chip label="Your Information" />
              </Divider>
              
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                  size={compact ? "small" : "medium"}
                />
                
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  required
                  size={compact ? "small" : "medium"}
                />
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }}>
              <Chip label="Your Feedback" />
            </Divider>
            
            <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
              <FormLabel component="legend">Feedback Type</FormLabel>
              <RadioGroup
                row
                name="feedbackType"
                value={formData.feedbackType}
                onChange={handleInputChange}
              >
                {feedbackTypes.map((type) => (
                  <FormControlLabel
                    key={type.value}
                    value={type.value}
                    control={<Radio size={compact ? "small" : "medium"} />}
                    label={type.label}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            
            <Box sx={{ mb: 3 }}>
              <FormLabel component="legend">Rate Your Experience</FormLabel>
              <Rating
                name="rating"
                value={formData.rating}
                onChange={handleRatingChange}
                precision={0.5}
                size={compact ? "medium" : "large"}
                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                sx={{ mt: 1 }}
              />
            </Box>
            
            <TextField
              fullWidth
              label="Your Message"
              name="message"
              multiline
              rows={compact ? 3 : 5}
              value={formData.message}
              onChange={handleInputChange}
              error={!!errors.message}
              helperText={errors.message}
              required
              sx={{ mb: 3 }}
              size={compact ? "small" : "medium"}
            />
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              endIcon={<SendIcon />}
              fullWidth={compact}
              size={compact ? "medium" : "large"}
            >
              Submit Feedback
            </Button>
          </form>
        </>
      )}
      
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

export default FeedbackForm; 