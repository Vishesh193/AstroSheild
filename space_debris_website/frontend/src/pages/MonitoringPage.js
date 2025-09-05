import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  Divider,
  Button,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import RefreshIcon from '@mui/icons-material/Refresh';

// Import components
import PageHeader from '../components/PageHeader';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorMessage from '../components/ErrorMessage';
import AlertsDashboard from '../components/AlertsDashboard';
import StatCard from '../components/StatCard';

const MonitoringPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    activeAlerts: 0,
    criticalEvents: 0,
    trackingStatus: 'Online',
    debrisCount: 23567
  });

  useEffect(() => {
    // In a real application, you would fetch this data from your backend
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // This would normally be replaced with actual API data
        setStats({
          activeAlerts: 3,
          criticalEvents: 1,
          trackingStatus: 'Online',
          debrisCount: 23567
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching monitoring data:', err);
        setError('Failed to load monitoring data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRefresh = () => {
    // Reset and refetch data
    setError(null);
    
    // Simulate API call for refresh
    setStats({
      activeAlerts: Math.floor(Math.random() * 5),
      criticalEvents: Math.floor(Math.random() * 2),
      trackingStatus: Math.random() > 0.9 ? 'Maintenance' : 'Online',
      debrisCount: 23567 + Math.floor(Math.random() * 100)
    });
  };

  if (loading) {
    return (
      <Container maxWidth="xl">
        <PageHeader
          title="Real-Time Monitoring"
          subtitle="Monitor space debris events and alerts in real-time"
        />
        <LoadingIndicator message="Loading monitoring data..." />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl">
        <PageHeader
          title="Real-Time Monitoring"
          subtitle="Monitor space debris events and alerts in real-time"
        />
        <ErrorMessage message={error} onRetry={handleRefresh} />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <PageHeader
        title="Real-Time Monitoring"
        subtitle="Monitor space debris events and alerts in real-time"
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button 
          variant="outlined" 
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
        >
          Refresh Data
        </Button>
      </Box>

      {/* Stats Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Alerts"
            value={stats.activeAlerts.toString()}
            icon="warning"
            color={stats.activeAlerts > 0 ? "warning" : "success"}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Critical Events"
            value={stats.criticalEvents.toString()}
            icon="error"
            color={stats.criticalEvents > 0 ? "error" : "success"}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tracking Status"
            value={stats.trackingStatus}
            icon="satellite"
            color={stats.trackingStatus === 'Online' ? "success" : "warning"}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tracked Objects"
            value={stats.debrisCount.toLocaleString()}
            icon="tracking"
            color="info"
          />
        </Grid>
      </Grid>

      {/* Alerts Dashboard */}
      <Paper elevation={3} sx={{ p: 0, mb: 4 }}>
        <Box sx={{ p: 2, bgcolor: 'background.default' }}>
          <Typography variant="h6" component="h2">
            <WarningIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            Real-Time Alerts
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ p: 0 }}>
          <AlertsDashboard />
        </Box>
      </Paper>

      {/* Space Weather */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Space Weather Conditions
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Current space weather conditions that may affect debris trajectories and orbital decay rates.
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardHeader title="Solar Activity" />
              <CardContent>
                <Typography variant="h5" component="div" color="primary">
                  Moderate
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Current solar flux: 120 SFU
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardHeader title="Geomagnetic Field" />
              <CardContent>
                <Typography variant="h5" component="div" color="success.main">
                  Quiet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Kp index: 2 (Quiet)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardHeader title="Atmospheric Density" />
              <CardContent>
                <Typography variant="h5" component="div" color="info.main">
                  Normal
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Impact on debris: Minimal
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default MonitoringPage; 