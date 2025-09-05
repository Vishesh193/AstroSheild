import React from 'react';
import { Box, Paper, Typography, Tooltip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

/**
 * DataCard component for displaying statistics and metrics
 * 
 * @param {Object} props
 * @param {string} props.title - The card title
 * @param {string|number} props.value - The main value to display
 * @param {string} props.subtitle - Descriptive text below the value
 * @param {React.ReactNode} props.icon - Optional icon to display
 * @param {string} props.color - Color theme for the card (primary, secondary, error, warning, info, success)
 * @param {string} props.tooltipText - Optional tooltip text for additional information
 * @param {Object} props.sx - Additional styles to apply to the card
 */
const DataCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color = 'primary',
  tooltipText,
  sx = {} 
}) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 6,
        },
        ...sx
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography 
          variant="h6" 
          component="h3" 
          color="text.secondary"
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 0.5
          }}
        >
          {title}
          {tooltipText && (
            <Tooltip title={tooltipText} arrow>
              <InfoOutlinedIcon fontSize="small" sx={{ ml: 0.5, color: 'text.secondary' }} />
            </Tooltip>
          )}
        </Typography>
        {icon && (
          <Box 
            sx={{ 
              color: `${color}.main`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        )}
      </Box>
      
      <Typography 
        variant="h3" 
        component="div" 
        sx={{ 
          fontWeight: 'bold',
          color: `${color}.main`,
          mb: 1
        }}
      >
        {value}
      </Typography>
      
      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{ mt: 'auto' }}
      >
        {subtitle}
      </Typography>
      
      {/* Decorative element */}
      <Box 
        sx={{ 
          position: 'absolute',
          bottom: -15,
          right: -15,
          width: 100,
          height: 100,
          borderRadius: '50%',
          backgroundColor: `${color}.main`,
          opacity: 0.1,
          zIndex: 0
        }} 
      />
    </Paper>
  );
};

export default DataCard; 