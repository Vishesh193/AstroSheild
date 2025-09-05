import React from 'react';
import { Box, Container, Typography, Grid, Button, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

import DataCard from '../components/DataCard';


import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import PublicIcon from '@mui/icons-material/Public';
import BarChartIcon from '@mui/icons-material/BarChart';

const HomePage = () => {

  const stats = {
    total_objects: 28000,
    object_type_counts: {
      DEBRIS: 18500,
    },
    rcs_size_counts: {
      LARGE: 3200,
    },
    country_code_counts: {
      USA: 10000,
      RUS: 8000,
      CHN: 5000,
      EU: 3000,
      JPN: 1000,
      IND: 800,
      OTHER: 200,
    }
  };

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: 'url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80)',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        {/* Increase the priority of the hero background image */}
        {<img style={{ display: 'none' }} src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80" alt="space" />}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.6)',
          }}
        />
        <Grid container>
          <Grid item md={6}>
            <Box
              sx={{
                position: 'relative',
                p: { xs: 3, md: 6 },
                pr: { md: 0 },
              }}
            >
              <Typography component="h1" variant="h3" color="inherit" gutterBottom className="slide-in-up">
                AstroSheild : Space Debris Visualization & Prediction
              </Typography>
              <Typography variant="h5" color="inherit" paragraph className="slide-in-up" sx={{ animationDelay: '0.2s' }}>
                Explore the growing challenge of space debris through interactive visualizations and predictive analytics.
              </Typography>
              <Button 
                variant="contained" 
                component={Link} 
                to="/visualization" 
                size="large"
                className="slide-in-up"
                sx={{ 
                  animationDelay: '0.4s',
                  mt: 2,
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  }
                }}
              >
                Explore Data
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Stats Section */}
      <Typography variant="h4" component="h2" gutterBottom>
        Space Debris Overview
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }} className="fade-in">
        <Grid item xs={12} sm={6} md={3}>
          <DataCard
            title="Total Objects"
            value={stats.total_objects.toLocaleString()}
            subtitle="Objects tracked in Earth orbit"
            icon={<SatelliteAltIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DataCard
            title="Debris Objects"
            value={stats.object_type_counts.DEBRIS.toLocaleString()}
            subtitle="Pieces of space debris"
            icon={<RocketLaunchIcon />}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DataCard
            title="Large Objects"
            value={stats.rcs_size_counts.LARGE.toLocaleString()}
            subtitle="Large-sized objects"
            color="warning"
            tooltipText="Objects with RCS > 1.0 m²"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DataCard
            title="Countries"
            value={Object.keys(stats.country_code_counts).length}
            subtitle="Countries with objects in orbit"
            icon={<PublicIcon />}
            color="success"
          />
        </Grid>
      </Grid>

      {/* Call to Action */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          mt: 4, 
          mb: 4, 
          borderRadius: 2,
          backgroundColor: 'background.paper',
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" component="h3" gutterBottom>
          Ready to explore more?
        </Typography>
        <Typography variant="body1" paragraph>
          Dive deeper into our interactive visualizations, data explorer, and prediction tools.
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            component={Link} 
            to="/visualization"
            startIcon={<BarChartIcon />}
          >
            Visualizations
          </Button>
          <Button 
            variant="outlined" 
            component={Link} 
            to="/data-explorer"
          >
            Data Explorer
          </Button>
          <Button 
            variant="outlined" 
            component={Link} 
            to="/prediction"
            startIcon={<RocketLaunchIcon />}
          >
            Prediction
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default HomePage; 