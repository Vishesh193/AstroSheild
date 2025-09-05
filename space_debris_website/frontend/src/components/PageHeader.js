import React from 'react';
import { Box, Typography, Breadcrumbs, Link, Divider, Chip } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link as RouterLink } from 'react-router-dom';

/**
 * PageHeader component for consistent page headers across the application
 * 
 * @param {Object} props
 * @param {string} props.title - The main title of the page
 * @param {string} props.subtitle - Optional subtitle or description
 * @param {Array} props.breadcrumbs - Optional array of breadcrumb objects with label and path properties
 * @param {React.ReactNode} props.action - Optional action button or component to display
 * @param {string} props.tag - Optional tag to display (e.g., "New", "Beta", "Updated")
 * @param {string} props.tagColor - Optional color for the tag (primary, secondary, success, warning, error, info)
 * @param {Object} props.sx - Additional styles to apply to the header
 */
const PageHeader = ({
  title,
  subtitle,
  breadcrumbs = [],
  action,
  tag,
  tagColor = 'primary',
  sx = {}
}) => {
  return (
    <Box sx={{ mb: 4, ...sx }}>
      {breadcrumbs.length > 0 && (
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" />} 
          aria-label="breadcrumb"
          sx={{ mb: 2 }}
        >
          <Link 
            component={RouterLink} 
            to="/" 
            color="inherit" 
            underline="hover"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            Home
          </Link>
          
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            
            return isLast ? (
              <Typography key={crumb.label} color="text.primary">
                {crumb.label}
              </Typography>
            ) : (
              <Link
                key={crumb.label}
                component={RouterLink}
                to={crumb.path}
                color="inherit"
                underline="hover"
              >
                {crumb.label}
              </Link>
            );
          })}
        </Breadcrumbs>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 700,
                color: 'text.primary',
              }}
            >
              {title}
            </Typography>
            
            {tag && (
              <Chip 
                label={tag} 
                color={tagColor} 
                size="small"
                sx={{ 
                  height: 24,
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}
              />
            )}
          </Box>
          
          {subtitle && (
            <Typography 
              variant="subtitle1" 
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        
        {action && (
          <Box>
            {action}
          </Box>
        )}
      </Box>
      
      <Divider sx={{ mt: 3 }} />
    </Box>
  );
};

export default PageHeader; 