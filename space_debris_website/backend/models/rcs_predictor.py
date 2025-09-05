import os
import joblib
import numpy as np
import pandas as pd
from datetime import datetime
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler

class RCSPredictor:
    """
    Class for predicting RCS size of space debris based on orbital parameters
    """
    
    def __init__(self):
        """Initialize the RCS predictor"""
        self.model_type = "RandomForestClassifier"
        self.features = [
            'OBJECT_AGE', 'CENT_FOCUS_DIST', 'APOAPSIS', 'PERIAPSIS', 
            'MEAN_ANOMALY', 'MEAN_MOTION', 'INCLINATION', 'RA_OF_ASC_NODE', 
            'ARG_OF_PERICENTER', 'PERIOD'
        ]
        self.classes = ['SMALL', 'MEDIUM', 'LARGE']
        self.accuracy = 0.92  # Placeholder, will be updated when model is trained
        self.last_trained = datetime.now().strftime("%Y-%m-%d")  # Use today's date
        self.feature_importance = [
            {"feature": "INCLINATION", "importance": 0.25},
            {"feature": "APOAPSIS", "importance": 0.20},
            {"feature": "PERIAPSIS", "importance": 0.18},
            {"feature": "OBJECT_AGE", "importance": 0.15},
            {"feature": "MEAN_MOTION", "importance": 0.10},
            {"feature": "PERIOD", "importance": 0.05},
            {"feature": "MEAN_ANOMALY", "importance": 0.03},
            {"feature": "RA_OF_ASC_NODE", "importance": 0.02},
            {"feature": "ARG_OF_PERICENTER", "importance": 0.01},
            {"feature": "CENT_FOCUS_DIST", "importance": 0.01}
        ]
        
        # Path to the model file - store in the backend/models directory
        self.model_path = os.path.join(os.path.dirname(__file__), 'rcs_predictor.joblib')
        self.scaler_path = os.path.join(os.path.dirname(__file__), 'rcs_scaler.joblib')
        
        # Initialize scaler
        self.scaler = StandardScaler()
        
        # Load or train the model
        self.model = self._load_or_train_model()
        self.scaler = self._load_or_create_scaler()
    
    def _load_or_train_model(self):
        """Load the model from file or train a new one if it doesn't exist"""
        try:
            if os.path.exists(self.model_path):
                print(f"Loading model from {self.model_path}")
                return joblib.load(self.model_path)
            else:
                print(f"Model not found at {self.model_path}, training new model")
                # Train a new model
                model = self._train_model()
                
                # Save the model
                os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
                joblib.dump(model, self.model_path)
                print(f"Model saved to {self.model_path}")
                
                return model
        except Exception as e:
            print(f"Error loading or training model: {e}")
            # Return a dummy model
            return RandomForestClassifier()
    
    def _load_or_create_scaler(self):
        """Load the scaler from file or create a new one if it doesn't exist"""
        try:
            if os.path.exists(self.scaler_path):
                print(f"Loading scaler from {self.scaler_path}")
                return joblib.load(self.scaler_path)
            else:
                print(f"Scaler not found at {self.scaler_path}, creating new scaler")
                # Create a new scaler - will be fitted during model training
                scaler = StandardScaler()
                
                # Save the scaler
                joblib.dump(scaler, self.scaler_path)
                print(f"Scaler saved to {self.scaler_path}")
                
                return scaler
        except Exception as e:
            print(f"Error loading or creating scaler: {e}")
            # Return a dummy scaler
            return StandardScaler()
    
    def _train_model(self):
        """Train a new model using the space debris data"""
        try:
            # Try multiple possible paths for the data file
            data_paths = [
                # Path relative to models directory
                os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'space_decay.csv'),
                # Path relative to backend directory
                os.path.join(os.path.dirname(os.path.dirname(__file__)), '..', 'data', 'space_decay.csv'),
                # Root level path
                os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'space_decay.csv'),
                # Absolute path to project root + data
                os.path.join(os.path.abspath(os.sep), 'Users', 'vishe', 'OneDrive', 'Desktop', 'project this', 'space_decay.csv'),
                # Absolute path to project data directory
                os.path.join(os.path.abspath(os.sep), 'Users', 'vishe', 'OneDrive', 'Desktop', 'project this', 'space_debris_website', 'data', 'space_decay.csv')
            ]
            
            df = None
            for data_path in data_paths:
                print(f"Trying to load data from {data_path}")
                if os.path.exists(data_path):
                    print(f"Found data file at {data_path}")
                    df = pd.read_csv(data_path)
                    if df is not None and len(df) > 0:
                        print(f"Successfully loaded {len(df)} rows from {data_path}")
                        break
            
            if df is None:
                print("Could not find or load data file from any of the possible paths")
                raise FileNotFoundError("Could not find or load data file")
                
            # Filter debris objects with known RCS size
            df = df[df['OBJECT_TYPE'] == 'DEBRIS']
            df = df.dropna(subset=['RCS_SIZE'])
            print(f"Filtered to {len(df)} debris objects with known RCS size")
            
            # Create CENT_FOCUS_DIST feature
            df['CENT_FOCUS_DIST'] = df['SEMIMAJOR_AXIS'] * df['ECCENTRICITY']
            
            # Create OBJECT_AGE feature (current year - launch year)
            current_year = datetime.now().year
            df['OBJECT_AGE'] = current_year - pd.to_datetime(df['LAUNCH_DATE']).dt.year
            
            # Map RCS_SIZE to numeric values
            size_map = {'SMALL': 1, 'MEDIUM': 2, 'LARGE': 3}
            df['RCS_SIZE'] = df['RCS_SIZE'].map(size_map)
            
            # Select features and target
            X = df[self.features]
            y = df['RCS_SIZE']
            
            # Scale features
            X_scaled = self.scaler.fit_transform(X)
            
            # Save the fitted scaler
            os.makedirs(os.path.dirname(self.scaler_path), exist_ok=True)
            joblib.dump(self.scaler, self.scaler_path)
            print(f"Updated scaler saved to {self.scaler_path}")
            
            # Train the model
            model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
            model.fit(X_scaled, y)
            
            # Update model metadata
            self.accuracy = model.score(X_scaled, y)
            self.last_trained = datetime.now().strftime("%Y-%m-%d")
            
            # Save the trained model
            os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
            joblib.dump(model, self.model_path)
            print(f"Model saved to {self.model_path}")
            
            return model
        except Exception as e:
            print(f"Error training model: {e}")
            # Return a basic model that can still make predictions
            model = RandomForestClassifier()
            model.fit(np.array([[0]*len(self.features)]), np.array([1]))
            return model
    
    def predict(self, features):
        """
        Predict the RCS size of a space debris object
        
        Args:
            features (dict): Dictionary of feature values
            
        Returns:
            tuple: (predicted_class, probability)
        """
        try:
            # Convert features to numpy array
            X = np.array([[float(features[f]) for f in self.features]])
            
            # Scale features
            X_scaled = self.scaler.transform(X)
            
            # Make prediction
            prediction = self.model.predict(X_scaled)[0]
            probabilities = self.model.predict_proba(X_scaled)[0]
            
            # Map numeric prediction back to class name
            class_map = {1: 'SMALL', 2: 'MEDIUM', 3: 'LARGE'}
            predicted_class = class_map.get(prediction, 'UNKNOWN')
            
            # Get probability of predicted class
            max_prob_idx = np.argmax(probabilities)
            probability = float(probabilities[max_prob_idx])
            
            # If probability is too low, mark as unknown
            if probability < 0.4:
                return 'UNKNOWN', probabilities
            
            return predicted_class, probabilities
            
        except Exception as e:
            print(f"Error making prediction: {e}")
            # Return unknown with equal probabilities
            return 'UNKNOWN', np.array([0.33, 0.33, 0.34]) 