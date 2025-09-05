import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link, 
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

// Import components
import NewsletterSignup from './NewsletterSignup';

const Footer = () => {
  const theme = useTheme();
  
  const currentYear = new Date().getFullYear();
  
  const mainLinks = [
    { name: 'Home', path: '/' },
    { name: 'Data Explorer', path: '/data-explorer' },
    { name: 'Visualizations', path: '/visualization' },
    { name: 'Predictions', path: '/prediction' },
    { name: 'Education', path: '/education' },
  ];
  
  const resourceLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Research Papers', path: '/research' },
    { name: 'Privacy Policy', path: '/privacy' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: theme => theme.palette.mode === 'light' 
          ? 'rgba(25, 118, 210, 0.08)'
          : 'rgba(0, 0, 0, 0.85)',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and Description */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <RocketLaunchIcon sx={{ mr: 1, fontSize: 28, color: 'primary.main' }} />
              <Typography variant="h6" component="div" color="primary.main" fontWeight="bold">
                SPACE DEBRIS MONITOR
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              Providing comprehensive data and analysis on space debris to promote a safer orbital environment for future space missions.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <IconButton aria-label="GitHub" component={Link} href="https://github.com/space-debris-project" target="_blank" size="small">
                <GitHubIcon />
              </IconButton>
              <IconButton aria-label="Twitter" component={Link} href="https://twitter.com/spacedebrismon" target="_blank" color="primary" size="small">
                <TwitterIcon />
              </IconButton>
              <IconButton aria-label="LinkedIn" component={Link} href="https://linkedin.com/company/space-debris-monitor" target="_blank" color="primary" size="small">
                <LinkedInIcon />
              </IconButton>
              <IconButton aria-label="Email" component={Link} href="mailto:contact@spacedebris-monitor.org" color="primary" size="small">
                <EmailIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Site Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" color="primary" gutterBottom fontWeight="medium">
              Navigation
            </Typography>
            <List dense disablePadding>
              {mainLinks.map((link) => (
                <ListItem key={link.name} disablePadding sx={{ pb: 0.5 }}>
                  <ListItemText 
                    primary={
                      <Link 
                        component={RouterLink} 
                        to={link.path} 
                        color="text.secondary"
                        underline="hover"
                        sx={{ fontSize: '0.875rem' }}
                      >
                        {link.name}
                      </Link>
                    } 
                  />
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* Resource Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" color="primary" gutterBottom fontWeight="medium">
              Resources
            </Typography>
            <List dense disablePadding>
              {resourceLinks.map((link) => (
                <ListItem key={link.name} disablePadding sx={{ pb: 0.5 }}>
                  <ListItemText 
                    primary={
                      <Link 
                        component={RouterLink} 
                        to={link.path} 
                        color="text.secondary"
                        underline="hover"
                        sx={{ fontSize: '0.875rem' }}
                      >
                        {link.name}
                      </Link>
                    } 
                  />
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* Newsletter Signup */}
          <Grid item xs={12} md={4}>
            <NewsletterSignup 
              variant="compact"
              title="Subscribe to Updates"
              backgroundColor="transparent"
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />
        
        {/* Copyright */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {currentYear} Space Debris Monitor. All rights reserved.
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
            This project is for educational purposes only. Data is sourced from publicly available datasets.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 