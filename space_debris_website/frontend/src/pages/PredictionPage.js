import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  TextField,
  Button,
  Typography,
  Divider,
  Tooltip,
  IconButton,
  Chip,
  Card,
  CardContent,
  Alert,
  AlertTitle,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import RefreshIcon from '@mui/icons-material/Refresh';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

// Import components
import PageHeader from '../components/PageHeader';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorMessage from '../components/ErrorMessage';
import DataCard from '../components/DataCard';

// Import API utilities
import { predictionAPI } from '../utils/api';

// Import formatters
import { formatNumber, formatRCSSize } from '../utils/formatters';

const PredictionPage = () => {
  // Form state with all possible fields
  const [formData, setFormData] = useState({
    // RCS Model fields
    OBJECT_AGE: '',
    CENT_FOCUS_DIST: '',
    APOAPSIS: '',
    PERIAPSIS: '',
    MEAN_ANOMALY: '',
    MEAN_MOTION: '',
    INCLINATION: '',
    RA_OF_ASC_NODE: '',
    ARG_OF_PERICENTER: '',
    PERIOD: '',
    // Additional fields for Risk and Decay models
    ECCENTRICITY: '',
    SEMIMAJOR_AXIS: '',
    ORBITAL_ENERGY: '',
    ORBITAL_PERIOD: '',
    MEAN_VELOCITY: '',
    AGE: '',
    OBJECT_TYPE: '',
    ORBIT_CLASS: ''
  });

  // Define which fields to show for each model
  const modelFields = {
    rcs: [
      'OBJECT_AGE',
      'CENT_FOCUS_DIST',
      'APOAPSIS',
      'PERIAPSIS',
      'MEAN_ANOMALY',
      'MEAN_MOTION',
      'INCLINATION',
      'RA_OF_ASC_NODE',
      'ARG_OF_PERICENTER',
      'PERIOD'
    ],
    risk: [
      'MEAN_MOTION',
      'ECCENTRICITY',
      'INCLINATION',
      'SEMIMAJOR_AXIS',
      'PERIOD',
      'APOAPSIS',
      'PERIAPSIS',
      'ORBITAL_ENERGY',
      'ORBITAL_PERIOD',
      'MEAN_VELOCITY',
      'AGE',
      'OBJECT_TYPE',
      'ORBIT_CLASS'
    ],
    decay: [
      'MEAN_MOTION',
      'ECCENTRICITY',
      'INCLINATION',
      'SEMIMAJOR_AXIS',
      'PERIOD',
      'APOAPSIS',
      'PERIAPSIS',
      'ORBITAL_ENERGY',
      'ORBITAL_PERIOD',
      'MEAN_VELOCITY',
      'AGE',
      'OBJECT_TYPE',
      'ORBIT_CLASS'
    ]
  };

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [activeModel, setActiveModel] = useState('rcs'); // Default to RCS model

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;
    
    // Only validate fields for the active model
    modelFields[activeModel].forEach(field => {
      if (!formData[field]) {
        errors[field] = 'This field is required';
        isValid = false;
      } else if (isNaN(parseFloat(formData[field])) && !['OBJECT_TYPE', 'ORBIT_CLASS'].includes(field)) {
        errors[field] = 'Must be a number';
        isValid = false;
      }
    });
    
    setFormErrors(errors);
    return isValid;
  };

  const handlePredict = async (modelType) => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    setPrediction(null);
    setActiveModel(modelType);
    
    try {
      // Get required fields based on model type
      const requiredFields = modelType === 'rcs' ? [
        'OBJECT_AGE', 'CENT_FOCUS_DIST', 'APOAPSIS', 'PERIAPSIS', 
        'MEAN_ANOMALY', 'MEAN_MOTION', 'INCLINATION', 'RA_OF_ASC_NODE', 
        'ARG_OF_PERICENTER', 'PERIOD'
      ] : [
        'MEAN_MOTION', 'ECCENTRICITY', 'INCLINATION', 'SEMIMAJOR_AXIS',
        'PERIOD', 'APOAPSIS', 'PERIAPSIS', 'ORBITAL_ENERGY', 'ORBITAL_PERIOD',
        'MEAN_VELOCITY', 'AGE', 'OBJECT_TYPE', 'ORBIT_CLASS'
      ];

      // Only send required fields for the selected model
      const modelData = {};
      requiredFields.forEach(field => {
        if (['OBJECT_TYPE', 'ORBIT_CLASS'].includes(field)) {
          modelData[field] = formData[field];
        } else {
          modelData[field] = parseFloat(formData[field]);
        }
      });

      const response = await predictionAPI.predict(modelType, modelData);
      
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      
      setPrediction(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error making prediction:', err);
      setError(err.response?.data?.error || err.message || 'Failed to make prediction. Please try again later.');
      setLoading(false);
    }
  };

  const handleReset = () => {
    const resetData = {};
    Object.keys(formData).forEach(key => {
      resetData[key] = '';
    });
    setFormData(resetData);
    setFormErrors({});
    setPrediction(null);
    setActiveModel('rcs');
  };

  const handleSampleData = () => {
    // Update sample data based on active model
    if (activeModel === 'rcs') {
      setFormData({
        ...formData,
        OBJECT_AGE: '15.7',
        CENT_FOCUS_DIST: '0.0004',
        APOAPSIS: '7028.14',
        PERIAPSIS: '6999.86',
        MEAN_ANOMALY: '59.3',
        MEAN_MOTION: '14.4',
        INCLINATION: '98.2',
        RA_OF_ASC_NODE: '227.5',
        ARG_OF_PERICENTER: '301.2',
        PERIOD: '100.1'
      });
    } else {
      // Sample data for risk and decay models
      setFormData({
        ...formData,
        MEAN_MOTION: '14.4',
        ECCENTRICITY: '0.0004',
        INCLINATION: '98.2',
        SEMIMAJOR_AXIS: '7014',
        PERIOD: '100.1',
        APOAPSIS: '7028.14',
        PERIAPSIS: '6999.86',
        ORBITAL_ENERGY: '-27.9',
        ORBITAL_PERIOD: '100.1',
        MEAN_VELOCITY: '7.1',
        AGE: '5475',
        OBJECT_TYPE: '1',
        ORBIT_CLASS: '0'
      });
    }
    setFormErrors({});
  };

  const renderPredictionResults = () => {
    if (!prediction || !activeModel || loading) return null;

    // Handle error state
    if (error) {
      return (
        <Box sx={{ mt: 3 }}>
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        </Box>
      );
    }

    // Render different cards based on active model
    switch (activeModel) {
      case 'rcs':
        if (!prediction.predicted_class) return null;
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              RCS Size Prediction Results
            </Typography>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  RCS Size Prediction
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Predicted Class: <strong>{prediction.predicted_class}</strong>
                </Typography>
                <Typography variant="subtitle2" sx={{ mt: 2 }}>Class Probabilities:</Typography>
                {prediction.class_probabilities?.map((prob) => (
                  <Box key={prob.class} sx={{ mt: 1 }}>
                    <Typography variant="body2">
                      {prob.class}: {(prob.probability * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Box>
        );

      case 'decay':
        if (!prediction.decay_probability) return null;
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Decay Prediction Results
            </Typography>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Decay Prediction
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Decay Probability: <strong>{(prediction.decay_probability * 100).toFixed(1)}%</strong>
                </Typography>
                <Alert 
                  severity={prediction.likely_to_decay ? "warning" : "info"}
                  sx={{ mt: 2 }}
                >
                  <AlertTitle>
                    {prediction.likely_to_decay ? "High Decay Risk" : "Low Decay Risk"}
                  </AlertTitle>
                  {prediction.likely_to_decay 
                    ? "This object is likely to decay from its orbit"
                    : "This object is likely to maintain its orbit"}
                </Alert>
              </CardContent>
            </Card>
          </Box>
        );

      case 'risk':
        if (!prediction.risk_level) return null;
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Risk Assessment Results
            </Typography>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Collision Risk Assessment
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Risk Level: <strong>{prediction.risk_level.toUpperCase()}</strong>
                </Typography>
                {prediction.risk_probabilities && (
                  <>
                    <Typography variant="subtitle2" sx={{ mt: 2 }}>Risk Probabilities:</Typography>
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2">
                        Low: {(prediction.risk_probabilities.low * 100).toFixed(1)}%
                      </Typography>
                      <Typography variant="body2">
                        Medium: {(prediction.risk_probabilities.medium * 100).toFixed(1)}%
                      </Typography>
                      <Typography variant="body2">
                        High: {(prediction.risk_probabilities.high * 100).toFixed(1)}%
                      </Typography>
                    </Box>
                  </>
                )}
                <Alert 
                  severity={
                    prediction.risk_level === 'high' ? "error" :
                    prediction.risk_level === 'medium' ? "warning" : "info"
                  }
                  sx={{ mt: 2 }}
                >
                  <AlertTitle>
                    {prediction.risk_level === 'high' ? "High Risk" :
                     prediction.risk_level === 'medium' ? "Medium Risk" : "Low Risk"}
                  </AlertTitle>
                  {prediction.risk_level === 'high' 
                    ? "Immediate attention required - high collision risk"
                    : prediction.risk_level === 'medium'
                    ? "Monitor closely - moderate collision risk"
                    : "Normal monitoring - low collision risk"}
                </Alert>
              </CardContent>
            </Card>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg">
      <PageHeader
        title="Space Debris Analysis"
        description="Predict RCS size, decay probability, and collision risk based on orbital parameters."
      />

      <Grid container spacing={3}>
        {/* Input form */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Orbital Parameters
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant={activeModel === 'rcs' ? "contained" : "outlined"}
                  onClick={() => setActiveModel('rcs')}
                >
                  RCS Model
                </Button>
                <Button 
                  variant={activeModel === 'decay' ? "contained" : "outlined"}
                  onClick={() => setActiveModel('decay')}
                >
                  Decay Model
                </Button>
                <Button 
                  variant={activeModel === 'risk' ? "contained" : "outlined"}
                  onClick={() => setActiveModel('risk')}
                >
                  Risk Model
                </Button>
              </Box>
            </Box>
            
            {error && (
              <ErrorMessage 
                message={error} 
                severity="error" 
                sx={{ mb: 3 }}
              />
            )}
            
            <form>
              <Grid container spacing={2}>
                {modelFields[activeModel].map((field) => (
                  <Grid item xs={12} sm={6} key={field}>
                    <TextField
                      fullWidth
                      label={field}
                      name={field}
                      value={formData[field]}
                      onChange={handleInputChange}
                      error={!!formErrors[field]}
                      helperText={formErrors[field]}
                      type={['OBJECT_TYPE', 'ORBIT_CLASS'].includes(field) ? 'text' : 'number'}
                    />
                  </Grid>
                ))}

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button 
                      variant="outlined" 
                      onClick={handleSampleData}
                      startIcon={<AutorenewIcon />}
                    >
                      Use Sample Data
                    </Button>
                    <Box>
                      <Button 
                        variant="outlined" 
                        onClick={handleReset} 
                        sx={{ mr: 1 }}
                      >
                        Reset
                      </Button>
                      <Button 
                        variant="contained" 
                        color="primary"
                        onClick={() => handlePredict(activeModel)}
                        disabled={loading}
                      >
                        {loading ? 'Predicting...' : `Predict ${activeModel.toUpperCase()}`}
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
        
        {/* Prediction Results */}
        <Grid item xs={12}>
          {loading ? (
            <Paper sx={{ p: 3 }}>
              <LoadingIndicator message="Calculating prediction..." />
            </Paper>
          ) : (
            prediction && (
              <Paper sx={{ p: 3 }}>
                {renderPredictionResults()}
              </Paper>
            )
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default PredictionPage; 