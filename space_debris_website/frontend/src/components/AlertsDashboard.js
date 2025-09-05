import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Chip, 
  Divider,
  Button
} from '@mui/material';
import { Warning, Info, Error, Notifications } from '@mui/icons-material';
import axios from 'axios';
import io from 'socket.io-client';

const AlertsDashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    // Initial fetch of alerts
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/real-time/alerts');
        setAlerts(response.data.alerts);
        setError('');
      } catch (error) {
        console.error('Error fetching alerts:', error);
        setError('Failed to load alerts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAlerts();
    
    // Connect to WebSocket for real-time updates
    const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
    
    socket.on('connect', () => {
      setConnected(true);
      console.log('Connected to real-time alerts');
      socket.emit('subscribe_debris_updates');
    });
    
    socket.on('disconnect', () => {
      setConnected(false);
      console.log('Disconnected from real-time alerts');
    });
    
    socket.on('new_alert', (alert) => {
      setAlerts(prevAlerts => [alert, ...prevAlerts]);
    });
    
    // Cleanup
    return () => {
      socket.disconnect();
    };
  }, []);
  
  // Get icon based on severity
  const getAlertIcon = (severity) => {
    switch (severity) {
      case 'high':
        return <Error color="error" />;
      case 'moderate':
        return <Warning color="warning" />;
      default:
        return <Info color="info" />;
    }
  };
  
  // Get color based on severity
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'error';
      case 'moderate':
        return 'warning';
      default:
        return 'info';
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Typography>Loading alerts...</Typography>
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ color: 'error.main', p: 2 }}>
        <Typography>{error}</Typography>
      </Box>
    );
  }
  
  return (
    <Box sx={{ maxWidth: '100%', mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2">
          Real-Time Alerts
        </Typography>
        <Chip 
          icon={<Notifications />} 
          label={connected ? 'Connected' : 'Disconnected'} 
          color={connected ? 'success' : 'error'} 
          variant="outlined" 
        />
      </Box>
      
      <Paper elevation={3} sx={{ p: 2 }}>
        {alerts.length === 0 ? (
          <Typography>No active alerts at this time.</Typography>
        ) : (
          <List>
            {alerts.map((alert, index) => (
              <React.Fragment key={alert.id}>
                <ListItem alignItems="flex-start">
                  <Box sx={{ mr: 2 }}>
                    {getAlertIcon(alert.severity)}
                  </Box>
                  <ListItemText
                    primary={alert.title}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {new Date(alert.time).toLocaleString()}
                        </Typography>
                        {" — " + alert.description}
                      </>
                    }
                  />
                  <Chip 
                    label={alert.severity.toUpperCase()} 
                    color={getSeverityColor(alert.severity)} 
                    size="small"
                  />
                </ListItem>
                {index < alerts.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button variant="outlined" color="primary">View All Alerts</Button>
      </Box>
    </Box>
  );
};

export default AlertsDashboard; 