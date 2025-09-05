import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Button,
  Divider,
  Tooltip,
  IconButton,
} from '@mui/material';
import Plot from 'react-plotly.js';
import InfoIcon from '@mui/icons-material/Info';
import RefreshIcon from '@mui/icons-material/Refresh';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import ThreeDRotationIcon from '@mui/icons-material/ThreeDRotation';

// Import components
import PageHeader from '../components/PageHeader';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorMessage from '../components/ErrorMessage';
import ThreeDOrbitView from '../components/ThreeDOrbitView';

// Import API utilities
import { visualizationAPI, debrisAPI } from '../utils/api';

// Import formatters
import { formatNumber } from '../utils/formatters';

const VisualizationPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orbitData, setOrbitData] = useState(null);
  const [countryData, setCountryData] = useState(null);
  const [sizeTypeData, setSizeTypeData] = useState(null);
  const [orbitalParamsData, setOrbitalParamsData] = useState(null);
  const [altitudeData, setAltitudeData] = useState(null);
  const [debrisData, setDebrisData] = useState([]);
  
  // Filters
  const [sizeFilter, setSizeFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Filter options
  const [countries, setCountries] = useState([]);
  const [objectTypes, setObjectTypes] = useState([]);
  const [rcsSizes, setRcsSizes] = useState([]);

  // UI state
  const [fullscreenChart, setFullscreenChart] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch filter options with retry logic
        let countriesRes, typesRes, sizesRes;
        try {
          [countriesRes, typesRes, sizesRes] = await Promise.all([
            debrisAPI.getCountries(),
            debrisAPI.getObjectTypes(),
            debrisAPI.getRCSSizes()
          ]);
        } catch (filterErr) {
          console.error('Error fetching filter options:', filterErr);
          // Continue anyway, as we can still show visualizations without filters
        }
        
        if (countriesRes?.data) setCountries(countriesRes.data);
        if (typesRes?.data) setObjectTypes(typesRes.data);
        if (sizesRes?.data) setRcsSizes(sizesRes.data);
        
        // Fetch visualization data with individual try/catch blocks
        let hasData = false;
        
        try {
          const orbitRes = await visualizationAPI.getOrbitDistribution();
          if (orbitRes?.data) {
            setOrbitData(orbitRes.data);
            hasData = true;
          }
        } catch (err) {
          console.error('Error fetching orbit distribution:', err);
        }
        
        try {
          const countryRes = await visualizationAPI.getCountryDistribution();
          if (countryRes?.data) {
            setCountryData(countryRes.data);
            hasData = true;
          }
        } catch (err) {
          console.error('Error fetching country distribution:', err);
        }
        
        try {
          const sizeTypeRes = await visualizationAPI.getSizeTypeDistribution();
          if (sizeTypeRes?.data) {
            setSizeTypeData(sizeTypeRes.data);
            hasData = true;
          }
        } catch (err) {
          console.error('Error fetching size type distribution:', err);
        }
        
        try {
          const orbitalParamsRes = await visualizationAPI.getOrbitalParameters();
          if (orbitalParamsRes?.data) {
            setOrbitalParamsData(orbitalParamsRes.data);
            hasData = true;
          }
        } catch (err) {
          console.error('Error fetching orbital parameters:', err);
        }
        
        try {
          const altitudeRes = await visualizationAPI.getAltitudeDistribution();
          if (altitudeRes?.data) {
            setAltitudeData(altitudeRes.data);
            hasData = true;
          }
        } catch (err) {
          console.error('Error fetching altitude distribution:', err);
        }
        
        // Fetch basic debris data for 3D visualization
        try {
          const debrisRes = await debrisAPI.getDebrisData({ limit: 100 });
          if (debrisRes?.data) {
            setDebrisData(debrisRes.data);
            hasData = true;
          }
        } catch (err) {
          console.error('Error fetching debris data for 3D view:', err);
        }
        
        if (!hasData) {
          setError('Failed to load visualization data. Please check if the backend server is running and the data file is accessible.');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching visualization data:', err);
        setError('Failed to load visualization data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSizeFilterChange = (event) => {
    setSizeFilter(event.target.value);
  };

  const handleCountryFilterChange = (event) => {
    setCountryFilter(event.target.value);
  };

  const handleTypeFilterChange = (event) => {
    setTypeFilter(event.target.value);
  };

  const handleRetry = () => {
    // Reset and refetch data
    setLoading(true);
    setError(null);
    
    Promise.all([
      visualizationAPI.getOrbitDistribution(),
      visualizationAPI.getCountryDistribution(),
      visualizationAPI.getSizeTypeDistribution(),
      visualizationAPI.getOrbitalParameters(),
      visualizationAPI.getAltitudeDistribution(),
      debrisAPI.getDebrisData({ limit: 100 })
    ])
      .then(([orbitRes, countryRes, sizeTypeRes, orbitalParamsRes, altitudeRes, debrisRes]) => {
        setOrbitData(orbitRes.data);
        setCountryData(countryRes.data);
        setSizeTypeData(sizeTypeRes.data);
        setOrbitalParamsData(orbitalParamsRes.data);
        setAltitudeData(altitudeRes.data);
        setDebrisData(debrisRes.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching visualization data:', err);
        setError('Failed to load visualization data. Please try again later.');
        setLoading(false);
      });
  };

  const toggleFullscreen = () => {
    setFullscreenChart(!fullscreenChart);
  };

  // Filter data based on selected filters
  const getFilteredData = (data, type) => {
    if (!data) return null;
    
    let filteredData = [...data];
    
    // Apply filters based on the data type and structure
    switch (type) {
      case 'orbit':
        if (sizeFilter !== 'all') {
          filteredData = filteredData.filter(series => series.name === sizeFilter);
        }
        break;
      case 'country':
        // For country data, we need to filter the y values
        if (countryFilter !== 'all' && filteredData[0]) {
          const countryIndex = filteredData[0].x.indexOf(countryFilter);
          if (countryIndex >= 0) {
            filteredData[0].x = [countryFilter];
            filteredData[0].y = [filteredData[0].y[countryIndex]];
          }
        }
        break;
      case 'sizeType':
        // This is a heatmap, so filtering is more complex
        // For simplicity, we'll just return the original data
        break;
      case 'orbitalParams':
        if (sizeFilter !== 'all') {
          filteredData.eccentricity_period.data = filteredData.eccentricity_period.data.filter(
            series => series.name === sizeFilter
          );
          filteredData.inclination_eccentricity.data = filteredData.inclination_eccentricity.data.filter(
            series => series.name === sizeFilter
          );
        }
        break;
      case 'altitude':
        if (sizeFilter !== 'all') {
          filteredData = filteredData.filter(series => series.name === sizeFilter);
        }
        break;
      default:
        break;
    }
    
    return filteredData;
  };

  // Add a tab for 3D Visualization
  const tabOptions = [
    { label: 'Orbital Distribution', value: 0 },
    { label: 'Country Distribution', value: 1 },
    { label: 'Size & Type Distribution', value: 2 },
    { label: 'Orbital Parameters', value: 3 },
    { label: 'Altitude Distribution', value: 4 },
    { label: '3D Visualization', value: 5, icon: <ThreeDRotationIcon /> },
  ];

  const renderContent = () => {
    if (loading) {
      return <LoadingIndicator message="Loading visualization data..." />;
    }

    if (error) {
      return <ErrorMessage message={error} onRetry={handleRetry} />;
    }

    const chartContainerStyle = fullscreenChart 
      ? {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1300,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }
      : {};

    const chartStyle = {
      width: '100%',
      height: fullscreenChart ? '90vh' : '500px',
    };

    switch (activeTab) {
      case 0: // 3D Orbit Visualization
        return (
          <Box sx={{ height: '600px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              3D Orbit Visualization
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              This feature requires CesiumJS integration. The 3D visualization will allow you to explore space debris orbits in an interactive globe.
            </Typography>
            <Box sx={{ mt: 2, p: 3, border: '1px dashed', borderColor: 'divider', borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="body2">
                Coming soon! Our team is working on implementing this feature.
              </Typography>
            </Box>
          </Box>
        );
      case 1: // Country Distribution
        return (
          <Box sx={chartContainerStyle}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Space Debris by Country of Origin
              </Typography>
              <IconButton onClick={toggleFullscreen} color="primary">
                {fullscreenChart ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
            </Box>
            <Plot
              data={getFilteredData(countryData?.data, 'country') || []}
              layout={{
                ...countryData?.layout,
                autosize: true,
                margin: { l: 50, r: 50, b: 100, t: 50, pad: 4 },
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                font: { color: '#ffffff' },
                xaxis: { 
                  ...countryData?.layout?.xaxis,
                  tickangle: -45,
                },
              }}
              style={chartStyle}
              config={{ responsive: true, displayModeBar: true }}
            />
          </Box>
        );
      case 2: // Size & Type Distribution
        return (
          <Box sx={chartContainerStyle}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Distribution by Size and Type
              </Typography>
              <IconButton onClick={toggleFullscreen} color="primary">
                {fullscreenChart ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
            </Box>
            <Plot
              data={[
                {
                  type: 'heatmap',
                  z: sizeTypeData ? sizeTypeData.map(item => item.count) : [],
                  x: sizeTypeData ? [...new Set(sizeTypeData.map(item => item.object_type))] : [],
                  y: sizeTypeData ? [...new Set(sizeTypeData.map(item => item.rcs_size))] : [],
                  colorscale: 'Viridis',
                  showscale: true,
                }
              ]}
              layout={{
                title: 'Object Count by Size and Type',
                autosize: true,
                margin: { l: 50, r: 50, b: 50, t: 50, pad: 4 },
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                font: { color: '#ffffff' },
                xaxis: { title: 'Object Type' },
                yaxis: { title: 'RCS Size' },
              }}
              style={chartStyle}
              config={{ responsive: true, displayModeBar: true }}
            />
          </Box>
        );
      case 3: // Orbital Parameters
        return (
          <Box sx={chartContainerStyle}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Orbital Parameters
              </Typography>
              <IconButton onClick={toggleFullscreen} color="primary">
                {fullscreenChart ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Eccentricity vs Period
                </Typography>
                <Plot
                  data={getFilteredData(orbitalParamsData?.eccentricity_period?.data, 'orbitalParams') || []}
                  layout={{
                    ...orbitalParamsData?.eccentricity_period?.layout,
                    autosize: true,
                    height: 400,
                    margin: { l: 50, r: 50, b: 50, t: 30, pad: 4 },
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    font: { color: '#ffffff' },
                  }}
                  style={{ width: '100%' }}
                  config={{ responsive: true, displayModeBar: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Inclination vs Eccentricity
                </Typography>
                <Plot
                  data={getFilteredData(orbitalParamsData?.inclination_eccentricity?.data, 'orbitalParams') || []}
                  layout={{
                    ...orbitalParamsData?.inclination_eccentricity?.layout,
                    autosize: true,
                    height: 400,
                    margin: { l: 50, r: 50, b: 50, t: 30, pad: 4 },
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    font: { color: '#ffffff' },
                  }}
                  style={{ width: '100%' }}
                  config={{ responsive: true, displayModeBar: true }}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 4: // Altitude Distribution
        return (
          <Box sx={chartContainerStyle}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Altitude Distribution by RCS Size
              </Typography>
              <IconButton onClick={toggleFullscreen} color="primary">
                {fullscreenChart ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
            </Box>
            <Plot
              data={getFilteredData(altitudeData?.data, 'altitude') || []}
              layout={{
                ...altitudeData?.layout,
                autosize: true,
                margin: { l: 50, r: 50, b: 50, t: 30, pad: 4 },
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                font: { color: '#ffffff' },
              }}
              style={chartStyle}
              config={{ responsive: true, displayModeBar: true }}
            />
          </Box>
        );
      case 5:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              3D Space Debris Visualization
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              This interactive 3D visualization shows the distribution of space debris objects around Earth.
              You can rotate, zoom, and pan the view to explore the debris field from different angles.
            </Typography>
            <ThreeDOrbitView debrisData={debrisData} isLoading={loading} />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="xl">
      <PageHeader
        title="Space Debris Visualization"
        subtitle="Interactive visualizations of orbital debris distribution and characteristics"
      />

      <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="visualization tabs"
        >
          {tabOptions.map((tab) => (
            <Tab 
              key={tab.value} 
              label={tab.label} 
              icon={tab.icon} 
              iconPosition={tab.icon ? 'start' : undefined}
            />
          ))}
        </Tabs>

        <Box sx={{ mt: 2 }}>
          {activeTab !== 5 && (
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="size-filter-label">Size</InputLabel>
                  <Select
                    labelId="size-filter-label"
                    id="size-filter"
                    value={sizeFilter}
                    label="Size"
                    onChange={handleSizeFilterChange}
                  >
                    <MenuItem value="all">All Sizes</MenuItem>
                    {rcsSizes.map((size) => (
                      <MenuItem key={size} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="country-filter-label">Country</InputLabel>
                  <Select
                    labelId="country-filter-label"
                    id="country-filter"
                    value={countryFilter}
                    label="Country"
                    onChange={handleCountryFilterChange}
                  >
                    <MenuItem value="all">All Countries</MenuItem>
                    {countries.map((country) => (
                      <MenuItem key={country} value={country}>
                        {country}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="type-filter-label">Type</InputLabel>
                  <Select
                    labelId="type-filter-label"
                    id="type-filter"
                    value={typeFilter}
                    label="Type"
                    onChange={handleTypeFilterChange}
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    {objectTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}

          {renderContent()}
        </Box>
      </Paper>
    </Container>
  );
};

export default VisualizationPage; 