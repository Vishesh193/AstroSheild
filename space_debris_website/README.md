# Space Debris Visualization and Prediction Platform

A comprehensive web platform for visualizing and analyzing space debris data, with machine learning capabilities for predicting RCS (Radar Cross Section) size.

## Features

- Interactive 3D visualization of space debris orbits
- Statistical analysis of debris distribution
- Filtering by debris type, size, orbit, and country of origin
- RCS size prediction using machine learning models
- Educational resources about space debris

## Project Structure

```
space_debris_website/
├── frontend/           # React frontend application
│   ├── public/         # Static files
│   └── src/            # Source code
│       ├── components/ # Reusable UI components
│       ├── pages/      # Page components
│       ├── assets/     # Images, fonts, etc.
│       └── utils/      # Utility functions
├── backend/            # Python Flask backend
│   ├── api/            # API endpoints
│   ├── models/         # ML model integration
│   ├── utils/          # Utility functions
│   └── config/         # Configuration files
├── data/               # Data files
│   └── processed/      # Processed datasets
└── models/             # Trained ML models
```

## Technology Stack

- **Frontend**: React.js, Three.js, D3.js
- **Backend**: Python, Flask
- **Data Processing**: Pandas, NumPy
- **Machine Learning**: Scikit-learn
- **Visualization**: CesiumJS, Plotly

## Getting Started

### Prerequisites

- Node.js (v14+)
- Python (v3.8+)
- pip

### Installation

1. Clone the repository
2. Set up the backend:
   ```
   cd space_debris_website/backend
   pip install -r requirements.txt
   ```
3. Set up the frontend:
   ```
   cd space_debris_website/frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   cd space_debris_website/backend
   python app.py
   ```
2. Start the frontend development server:
   ```
   cd space_debris_website/frontend
   npm start
   ```

## Data Sources

The platform uses space debris data from the following sources:
- Space-Track.org
- ESA's DISCOS database
- NASA Orbital Debris Program Office

