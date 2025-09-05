import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';

/**
 * ErrorMessage component for displaying error states
 * 
 * @param {Object} props
 * @param {string} props.message - The error message to display
 * @param {string} props.details - Optional technical details about the error
 * @param {Function} props.onRetry - Optional callback function for retry button
 * @param {Object} props.sx - Additional styles to apply to the container
 */
const ErrorMessage = ({ 
  message = 'An error occurred', 
  details,
  onRetry,
  sx = {} 
}) => {
  return (
    <Paper
      elevation={0}
      sx={{ 
        p: 3, 
        borderRadius: 2,
        backgroundColor: 'rgba(211, 47, 47, 0.08)', // Light red background
        border: '1px solid rgba(211, 47, 47, 0.2)',
        ...sx
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <ErrorOutlineIcon 
          color="error" 
          sx={{ fontSize: 48, mb: 2 }} 
        />
        
        <Typography 
          variant="h6" 
          component="h2" 
          color="error"
          gutterBottom
        >
          {message}
        </Typography>
        
        {details && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ mb: 2, maxWidth: '100%', wordBreak: 'break-word' }}
          >
            {details}
          </Typography>
        )}
        
        {onRetry && (
          <Button
            variant="outlined"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={onRetry}
            sx={{ mt: 1 }}
          >
            Try Again
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default ErrorMessage; 