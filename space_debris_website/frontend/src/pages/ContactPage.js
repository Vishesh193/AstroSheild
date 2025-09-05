import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Link,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

// Import components
import PageHeader from '../components/PageHeader';
import FeedbackForm from '../components/FeedbackForm';

const ContactPage = () => {
  // Contact information
  const contactInfo = {
    email: 'vishesharora194@gmail.com',
    phone: '+91-7657800100',
    address: 'Ferozepur, Punjab, India',
    social: {
      github: 'https://github.com/space-debris-project',
      twitter: 'https://twitter.com/spacedebrismon',
      linkedin: 'https://linkedin.com/company/space-debris-monitor',
    },
  };

  // Department contacts
  const departments = [
    {
      name: 'Research Collaboration',
      email: 'research@spacedebris-monitor.org',
      description: 'For academic institutions and researchers interested in collaborating on space debris research.',
    },
    {
      name: 'Data Requests',
      email: 'data@spacedebris-monitor.org',
      description: 'For requesting access to our space debris datasets or API.',
    },
    {
      name: 'Media Inquiries',
      email: 'media@spacedebris-monitor.org',
      description: 'For press and media related questions.',
    },
    {
      name: 'Technical Support',
      email: 'support@spacedebris-monitor.org',
      description: 'For assistance with using our platform or reporting technical issues.',
    },
  ];

  const handleFeedbackSubmit = (formData) => {
    // In a real application, this would send the data to a backend API
    console.log('Feedback submitted:', formData);
    // You could add API call here:
    // api.submitFeedback(formData).then(response => {...})
  };

  return (
    <Container maxWidth="lg">
      <PageHeader
        title="Contact Us"
        description="Get in touch with our team for questions, feedback, or collaboration opportunities."
      />

      <Grid container spacing={4}>
        {/* Contact Information */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 4, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Contact Information
            </Typography>
            <Typography variant="body1" paragraph>
              We're here to help! Reach out to us using any of the methods below.
            </Typography>

            <List>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Email"
                  secondary={
                    <Link href={`mailto:${contactInfo.email}`} color="inherit">
                      {contactInfo.email}
                    </Link>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PhoneIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Phone"
                  secondary={contactInfo.phone}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LocationOnIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Address"
                  secondary={contactInfo.address}
                />
              </ListItem>
            </List>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Connect With Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Link href={contactInfo.social.github} target="_blank" rel="noopener">
                <GitHubIcon fontSize="large" />
              </Link>
              <Link href={contactInfo.social.twitter} target="_blank" rel="noopener">
                <TwitterIcon fontSize="large" color="primary" />
              </Link>
              <Link href={contactInfo.social.linkedin} target="_blank" rel="noopener">
                <LinkedInIcon fontSize="large" color="primary" />
              </Link>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Department Contacts
            </Typography>
            <List>
              {departments.map((dept, index) => (
                <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'flex-start', pb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {dept.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph sx={{ mt: 0.5 }}>
                    {dept.description}
                  </Typography>
                  <Link href={`mailto:${dept.email}`} color="primary">
                    {dept.email}
                  </Link>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Feedback Form */}
        <Grid item xs={12} md={7}>
          <FeedbackForm 
            title="Send Us a Message" 
            subtitle="Have a question or feedback? Fill out the form below and we'll get back to you as soon as possible."
            onSubmit={handleFeedbackSubmit}
          />
        </Grid>
      </Grid>

      {/* Map Section */}
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Our Location
        </Typography>
        <Box
          sx={{
            width: '100%',
            height: 400,
            mt: 2,
            bgcolor: 'background.paper',
            borderRadius: 1,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* In a real application, you would embed a Google Maps iframe or similar here */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d54803.31399953371!2d74.56059839629!3d30.92883494999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391a09f9fef45303%3A0xdee225fe28b2665c!2sFerozepur%2C%20Punjab!5e0!3m2!1sen!2sin!4v1710673285985!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Office Location"
          ></iframe>
        </Box>
      </Paper>
    </Container>
  );
};

export default ContactPage; 