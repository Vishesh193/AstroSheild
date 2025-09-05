import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * LoadingIndicator component for displaying a loading state
 * 
 * @param {Object} props
 * @param {string} props.message - Optional message to display
 * @param {string} props.size - Size of the loading indicator (small, medium, large)
 * @param {Object} props.sx - Additional styles to apply to the container
 */
const LoadingIndicator = ({ 
  message = 'Loading...', 
  size = 'medium',
  sx = {} 
}) => {
  // Map size prop to actual size values
  const sizeMap = {
    small: 24,
    medium: 40,
    large: 60
  };
  
  const circularProgressSize = sizeMap[size] || sizeMap.medium;
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center',
        p: 3,
        ...sx
      }}
    >
      <CircularProgress 
        size={circularProgressSize} 
        thickness={4}
        sx={{ mb: message ? 2 : 0 }}
      />
      
      {message && (
        <Typography 
          variant={size === 'small' ? 'body2' : 'body1'} 
          color="text.secondary"
          align="center"
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingIndicator; 