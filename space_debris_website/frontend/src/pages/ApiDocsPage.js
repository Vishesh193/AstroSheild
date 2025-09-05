import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Divider, 
  Grid,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Link
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import DownloadIcon from '@mui/icons-material/Download';
import ApiIcon from '@mui/icons-material/Api';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useState } from 'react';

// Components
import PageHeader from '../components/PageHeader';

const ApiDocsPage = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // API Endpoints
  const endpoints = [
    {
      method: 'GET',
      path: '/api/debris/stats',
      description: 'Get overall statistics about space debris',
      parameters: 'None',
      responseExample: '{\n  "total_objects": 34000,\n  "debris_by_type": {\n    "rocket_bodies": 2300,\n    "payloads": 5400,\n    "fragments": 26300\n  },\n  "last_updated": "2023-06-15T14:30:00Z"\n}'
    },
    {
      method: 'GET',
      path: '/api/debris',
      description: 'Get paginated list of debris objects',
      parameters: 'page, limit, type, orbit, country',
      responseExample: '{\n  "data": [\n    {\n      "id": "1998-067A",\n      "name": "ISS",\n      "type": "PAYLOAD",\n      "country": "USA/Russia",\n      "launch_date": "1998-11-20",\n      "orbit": "LEO",\n      "rcs": 415.2\n    },\n    ...\n  ],\n  "total": 34000,\n  "page": 1,\n  "limit": 10\n}'
    },
    {
      method: 'GET',
      path: '/api/debris/:id',
      description: 'Get detailed information about a specific debris object',
      parameters: 'id (required)',
      responseExample: '{\n  "id": "1998-067A",\n  "name": "ISS",\n  "type": "PAYLOAD",\n  "country": "USA/Russia",\n  "launch_date": "1998-11-20",\n  "orbit": "LEO",\n  "rcs": 415.2,\n  "perigee": 408,\n  "apogee": 410,\n  "inclination": 51.6,\n  "period": 92.9,\n  "status": "ACTIVE"\n}'
    },
    {
      method: 'GET',
      path: '/api/visualization/data',
      description: 'Get data for visualizations',
      parameters: 'type, timeframe, orbit, country',
      responseExample: '{\n  "labels": ["1960", "1970", "1980", "1990", "2000", "2010", "2020"],\n  "datasets": [\n    {\n      "label": "Rocket Bodies",\n      "data": [10, 50, 150, 400, 800, 1500, 2300]\n    },\n    ...\n  ]\n}'
    },
    {
      method: 'POST',
      path: '/api/prediction/rcs',
      description: 'Predict RCS size based on orbital parameters',
      parameters: 'JSON body with orbital parameters',
      responseExample: '{\n  "predicted_rcs": 0.8,\n  "confidence": 0.92,\n  "feature_importance": {\n    "perigee": 0.3,\n    "apogee": 0.25,\n    "inclination": 0.2,\n    "period": 0.15,\n    "launch_year": 0.1\n  }\n}'
    }
  ];

  // Code examples
  const codeExamples = {
    javascript: `// Using fetch API
fetch('https://api.spacedebris-monitor.org/api/debris/stats')
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });`,
    python: `# Using requests library
import requests

response = requests.get('https://api.spacedebris-monitor.org/api/debris/stats')
data = response.json()
print(data)`,
    curl: `curl -X GET https://api.spacedebris-monitor.org/api/debris/stats \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY"`
  };

  // Authentication info
  const authInfo = (
    <Box>
      <Typography variant="h6" gutterBottom>Authentication</Typography>
      <Typography paragraph>
        All API requests require an API key. You can obtain an API key by registering on our website.
      </Typography>
      <Typography variant="subtitle1" gutterBottom>API Key Authentication</Typography>
      <Typography paragraph>
        Include your API key in the request headers:
      </Typography>
      <Paper sx={{ p: 2, bgcolor: 'background.paper', overflowX: 'auto' }}>
        <Typography component="pre" sx={{ fontFamily: 'monospace' }}>
          {`x-api-key: YOUR_API_KEY`}
        </Typography>
      </Paper>
      <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>Rate Limits</Typography>
      <Typography paragraph>
        Free tier: 100 requests per day<br />
        Academic tier: 1,000 requests per day<br />
        Professional tier: 10,000 requests per day
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<ApiIcon />}
        sx={{ mt: 2 }}
        component={Link}
        href="/contact"
      >
        Request API Access
      </Button>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <PageHeader 
        title="API Documentation" 
        subtitle="Integrate space debris data into your applications"
        icon={<CodeIcon fontSize="large" />}
      />

      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography paragraph>
          Our REST API provides programmatic access to space debris data, allowing developers to integrate 
          real-time information about orbital objects into their applications. The API returns data in JSON format 
          and supports various query parameters for filtering and pagination.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <Button 
            variant="outlined" 
            startIcon={<DownloadIcon />}
            component={Link}
            href="/files/api-docs.pdf"
            target="_blank"
          >
            Download Documentation
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<GitHubIcon />}
            component={Link}
            href="https://github.com/space-debris-monitor/api-examples"
            target="_blank"
          >
            Code Examples
          </Button>
        </Box>

        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
        >
          <Tab label="Endpoints" />
          <Tab label="Code Examples" />
          <Tab label="Authentication" />
        </Tabs>

        {/* Endpoints Tab */}
        {tabValue === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>API Endpoints</Typography>
            <Typography paragraph>
              Base URL: <code>https://api.spacedebris-monitor.org</code>
            </Typography>
            
            {endpoints.map((endpoint, index) => (
              <Box key={index} sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Chip 
                    label={endpoint.method} 
                    color={endpoint.method === 'GET' ? 'info' : 'warning'} 
                    size="small" 
                    sx={{ mr: 2 }}
                  />
                  <Typography variant="subtitle1" component="code" sx={{ fontWeight: 'bold' }}>
                    {endpoint.path}
                  </Typography>
                </Box>
                <Typography paragraph>{endpoint.description}</Typography>
                <Typography variant="subtitle2">Parameters:</Typography>
                <Typography paragraph sx={{ ml: 2 }}>{endpoint.parameters}</Typography>
                <Typography variant="subtitle2">Example Response:</Typography>
                <Paper sx={{ p: 2, bgcolor: 'background.paper', overflowX: 'auto' }}>
                  <Typography component="pre" sx={{ fontFamily: 'monospace' }}>
                    {endpoint.responseExample}
                  </Typography>
                </Paper>
                <Divider sx={{ mt: 3 }} />
              </Box>
            ))}
          </Box>
        )}

        {/* Code Examples Tab */}
        {tabValue === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>Code Examples</Typography>
            <Typography paragraph>
              Here are examples of how to use our API in different programming languages:
            </Typography>
            
            <Typography variant="subtitle1" gutterBottom>JavaScript</Typography>
            <Paper sx={{ p: 2, bgcolor: 'background.paper', overflowX: 'auto', mb: 4 }}>
              <Typography component="pre" sx={{ fontFamily: 'monospace' }}>
                {codeExamples.javascript}
              </Typography>
            </Paper>
            
            <Typography variant="subtitle1" gutterBottom>Python</Typography>
            <Paper sx={{ p: 2, bgcolor: 'background.paper', overflowX: 'auto', mb: 4 }}>
              <Typography component="pre" sx={{ fontFamily: 'monospace' }}>
                {codeExamples.python}
              </Typography>
            </Paper>
            
            <Typography variant="subtitle1" gutterBottom>cURL</Typography>
            <Paper sx={{ p: 2, bgcolor: 'background.paper', overflowX: 'auto' }}>
              <Typography component="pre" sx={{ fontFamily: 'monospace' }}>
                {codeExamples.curl}
              </Typography>
            </Paper>
          </Box>
        )}

        {/* Authentication Tab */}
        {tabValue === 2 && authInfo}
      </Paper>

      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>Need Help?</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>Technical Support</Typography>
              <Typography paragraph>
                Having trouble with our API? Our technical team is ready to help you integrate our data into your applications.
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                component={Link}
                href="/contact"
              >
                Contact Support
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>Custom Solutions</Typography>
              <Typography paragraph>
                Need specialized data or custom endpoints? We offer tailored solutions for research institutions and commercial partners.
              </Typography>
              <Button 
                variant="outlined" 
                component={Link}
                href="/contact"
              >
                Request Custom Solution
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ApiDocsPage; 