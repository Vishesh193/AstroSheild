import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Import custom theme
import darkTheme from './utils/theme';

// Layout components
import Layout from './components/Layout';

// Pages
import HomePage from './pages/HomePage';
import VisualizationPage from './pages/VisualizationPage';
import DataExplorerPage from './pages/DataExplorerPage';
import PredictionPage from './pages/PredictionPage';
import EducationPage from './pages/EducationPage';
import MonitoringPage from './pages/MonitoringPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ResearchPage from './pages/ResearchPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="visualization" element={<VisualizationPage />} />
          <Route path="data-explorer" element={<DataExplorerPage />} />
          <Route path="prediction" element={<PredictionPage />} />
          <Route path="monitoring" element={<MonitoringPage />} />
          <Route path="education" element={<EducationPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="research" element={<ResearchPage />} />
          <Route path="privacy" element={<PrivacyPolicyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App; 