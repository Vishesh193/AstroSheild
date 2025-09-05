import axios from 'axios';

// Base API URL
const API_BASE_URL = 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle token refresh for 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          const { token } = response.data;
          localStorage.setItem('authToken', token);
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Redirect to login page or show auth error
      }
    }
    
    return Promise.reject(error);
  }
);

// API functions for debris data
export const debrisAPI = {
  // Get overall statistics
  getStats: async () => {
    try {
      const response = await api.get('/api/debris-data/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching debris stats:', error);
      throw error;
    }
  },
  
  // Get paginated list of debris objects with filters
  getDebrisList: async (page = 1, limit = 10, filters = {}) => {
    try {
      const response = await api.get('/api/debris-data', {
        params: {
          page,
          limit,
          ...filters,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching debris list:', error);
      throw error;
    }
  },
  
  // Get details for a specific debris object
  getDebrisDetails: async (id) => {
    try {
      const response = await api.get(`/api/debris-data/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching debris details for ID ${id}:`, error);
      throw error;
    }
  },
  
  // Get paginated debris data with filters
  getDebrisData: async (page = 1, limit = 10, filters = {}) => {
    try {
      console.log('Fetching debris data with params:', { page, limit, ...filters });
      const response = await api.get('/api/debris-data', {
        params: {
          page,
          limit,
          ...filters,
        },
      });
      console.log('Received debris data:', response.data);
      if (!response.data || !response.data.data) {
        throw new Error('Invalid response format from server');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching debris data:', error);
      throw error;
    }
  },
  
  // Get list of countries with debris counts
  getCountries: async () => {
    try {
      const response = await api.get('/api/debris-data/countries');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching countries:', error);
      return [];
    }
  },
  
  // Get list of object types with counts
  getObjectTypes: async () => {
    try {
      const response = await api.get('/api/debris-data/types');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching object types:', error);
      return [];
    }
  },
  
  // Get list of RCS sizes with counts
  getRCSSizes: async () => {
    try {
      const response = await api.get('/api/debris-data/sizes');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching RCS sizes:', error);
      return [];
    }
  }
};

// API functions for visualization data
export const visualizationAPI = {
  // Get data for visualizations
  getVisualizationData: async (type, params = {}) => {
    try {
      console.log(`Fetching visualization data for type: ${type}`);
      const response = await api.get('/api/visualization/data', {
        params: {
          type,
          ...params,
        },
      });
      console.log(`Received visualization data for type ${type}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching visualization data for type ${type}:`, error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      throw error;
    }
  },
  
  // Get orbit distribution data
  getOrbitDistribution: async () => {
    try {
      console.log('Fetching orbit distribution data');
      const response = await api.get('/api/visualization/orbit-distribution');
      console.log('Received orbit distribution data');
      return response;
    } catch (error) {
      console.error('Error fetching orbit distribution data:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      throw error;
    }
  },
  
  // Get country distribution data
  getCountryDistribution: async () => {
    try {
      console.log('Fetching country distribution data');
      const response = await api.get('/api/visualization/country-distribution');
      console.log('Received country distribution data');
      return response;
    } catch (error) {
      console.error('Error fetching country distribution data:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      throw error;
    }
  },
  
  // Get size and type distribution data
  getSizeTypeDistribution: async () => {
    try {
      console.log('Fetching size and type distribution data');
      const response = await api.get('/api/visualization/size-type-distribution');
      console.log('Received size and type distribution data');
      return response;
    } catch (error) {
      console.error('Error fetching size and type distribution data:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      throw error;
    }
  },
  
  // Get orbital parameters data
  getOrbitalParameters: async () => {
    try {
      console.log('Fetching orbital parameters data');
      const response = await api.get('/api/visualization/orbital-parameters');
      console.log('Received orbital parameters data');
      return response;
    } catch (error) {
      console.error('Error fetching orbital parameters data:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      throw error;
    }
  },
  
  // Get altitude distribution data
  getAltitudeDistribution: async () => {
    try {
      console.log('Fetching altitude distribution data');
      const response = await api.get('/api/visualization/altitude-distribution');
      console.log('Received altitude distribution data');
      return response;
    } catch (error) {
      console.error('Error fetching altitude distribution data:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      throw error;
    }
  }
};

// API functions for prediction
export const predictionAPI = {
  // Get model information
  getModelInfo: async () => {
    try {
      const response = await api.get('/api/prediction/model-info');
      return response;
    } catch (error) {
      console.error('Error fetching model info:', error);
      throw error;
    }
  },

  // Make predictions using any model
  predict: async (modelType, data) => {
    try {
      console.log(`Making ${modelType} prediction with data:`, data);
      const response = await api.post(`/api/prediction/${modelType}`, data);
      console.log(`Received ${modelType} prediction:`, response.data);
      return response;
    } catch (error) {
      console.error(`Error making ${modelType} prediction:`, error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      throw error;
    }
  }
};

// API functions for user management
export const userAPI = {
  // User login
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, refreshToken, user } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  // User logout
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },
  
  // Get current user profile
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },
};

export default api; 