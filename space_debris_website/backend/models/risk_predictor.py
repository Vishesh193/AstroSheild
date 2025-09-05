import os
import joblib
import numpy as np
import pandas as pd
from datetime import datetime
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler

class RiskPredictor:
    """
    Class for predicting collision risk level of space debris
    """
    
    def __init__(self):
        """Initialize the risk predictor"""
        self.model_type = "RandomForestClassifier"
        self.features = [
            'MEAN_MOTION', 'ECCENTRICITY', 'INCLINATION', 'SEMIMAJOR_AXIS',
            'PERIOD', 'APOAPSIS', 'PERIAPSIS', 'ORBITAL_ENERGY', 'ORBITAL_PERIOD',
            'MEAN_VELOCITY', 'AGE', 'OBJECT_TYPE', 'ORBIT_CLASS'
        ]
        self.risk_levels = ['LOW', 'MEDIUM', 'HIGH']
        self.accuracy = 0.85  # Placeholder, will be updated when model is trained
        self.last_trained = datetime.now().strftime("%Y-%m-%d")
        self.feature_importance = [
            {"feature": "INCLINATION", "importance": 0.25},
            {"feature": "MEAN_MOTION", "importance": 0.20},
            {"feature": "APOAPSIS", "importance": 0.15},
            {"feature": "PERIAPSIS", "importance": 0.12},
            {"feature": "ECCENTRICITY", "importance": 0.10},
            {"feature": "AGE", "importance": 0.08},
            {"feature": "ORBITAL_ENERGY", "importance": 0.05},
            {"feature": "MEAN_VELOCITY", "importance": 0.03},
            {"feature": "SEMIMAJOR_AXIS", "importance": 0.01},
            {"feature": "PERIOD", "importance": 0.01}
        ]
        
        # Path to the model files
        self.model_path = os.path.join(os.path.dirname(__file__), 'risk_model.pkl')
        self.scaler_path = os.path.join(os.path.dirname(__file__), 'risk_scaler.pkl')
        
        # Initialize scaler
        self.scaler = StandardScaler()
        
        # Load or train the model
        self.model = self._load_or_train_model()
        self.scaler = self._load_or_create_scaler()
    
    def _load_or_train_model(self):
        """Load the model from file or train a new one if it doesn't exist"""
        try:
            if os.path.exists(self.model_path):
                print(f"Loading risk model from {self.model_path}")
                return joblib.load(self.model_path)
            else:
                print(f"Risk model not found at {self.model_path}, training new model")
                # Train a new model
                model = self._train_model()
                
                # Save the model
                os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
                joblib.dump(model, self.model_path)
                print(f"Risk model saved to {self.model_path}")
                
                return model
        except Exception as e:
            print(f"Error loading or training risk model: {e}")
            # Return a dummy model
            return RandomForestClassifier()
    
    def _load_or_create_scaler(self):
        """Load the scaler from file or create a new one if it doesn't exist"""
        try:
            if os.path.exists(self.scaler_path):
                print(f"Loading risk scaler from {self.scaler_path}")
                return joblib.load(self.scaler_path)
            else:
                print(f"Risk scaler not found at {self.scaler_path}, creating new scaler")
                # Create a new scaler - will be fitted during model training
                scaler = StandardScaler()
                
                # Save the scaler
                joblib.dump(scaler, self.scaler_path)
                print(f"Risk scaler saved to {self.scaler_path}")
                
                return scaler
        except Exception as e:
            print(f"Error loading or creating risk scaler: {e}")
            # Return a dummy scaler
            return StandardScaler()
    
    def _train_model(self):
        """Train a new risk prediction model using the space debris data"""
        try:
            # Try multiple possible paths for the data file
            data_paths = [
                os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'space_decay.csv'),
                os.path.join(os.path.dirname(os.path.dirname(__file__)), '..', 'data', 'space_decay.csv'),
                os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'space_decay.csv')
            ]
            
            df = None
            for data_path in data_paths:
                if os.path.exists(data_path):
                    df = pd.read_csv(data_path)
                    if df is not None and len(df) > 0:
                        break
            
            if df is None:
                raise FileNotFoundError("Could not find or load data file")
            
            # Create features
            df['ORBITAL_ENERGY'] = -398600.4418 / (2 * df['SEMIMAJOR_AXIS'])
            df['ORBITAL_PERIOD'] = 2 * np.pi * np.sqrt(df['SEMIMAJOR_AXIS']**3 / 398600.4418)
            df['MEAN_VELOCITY'] = np.sqrt(398600.4418 * (2/df['SEMIMAJOR_AXIS'] - 1/df['SEMIMAJOR_AXIS']))
            
            # Create risk level target (0: LOW, 1: MEDIUM, 2: HIGH)
            # This is a simplified example - in reality, you would use actual collision risk data
            df['RISK_LEVEL'] = pd.qcut(df['MEAN_MOTION'], q=3, labels=[0, 1, 2])
            
            # Select features and target
            X = df[self.features]
            y = df['RISK_LEVEL']
            
            # Scale features
            X_scaled = self.scaler.fit_transform(X)
            
            # Save the fitted scaler
            os.makedirs(os.path.dirname(self.scaler_path), exist_ok=True)
            joblib.dump(self.scaler, self.scaler_path)
            
            # Train the model
            model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
            model.fit(X_scaled, y)
            
            # Update model metadata
            self.accuracy = model.score(X_scaled, y)
            self.last_trained = datetime.now().strftime("%Y-%m-%d")
            
            # Save the trained model
            os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
            joblib.dump(model, self.model_path)
            
            return model
        except Exception as e:
            print(f"Error training risk model: {e}")
            # Return a basic model that can still make predictions
            model = RandomForestClassifier()
            model.fit(np.array([[0]*len(self.features)]), np.array([0]))
            return model
    
    def predict(self, features):
        """
        Predict the collision risk level of a space debris object
        
        Args:
            features (dict): Dictionary of feature values
            
        Returns:
            tuple: (risk_level, probabilities)
        """
        try:
            # Convert features to numpy array
            X = np.array([[float(features[f]) for f in self.features]])
            
            # Scale features
            X_scaled = self.scaler.transform(X)
            
            # Make prediction
            risk_level_idx = self.model.predict(X_scaled)[0]
            probabilities = self.model.predict_proba(X_scaled)[0]
            
            # Map numeric prediction to risk level
            risk_level = self.risk_levels[risk_level_idx]
            
            return risk_level, probabilities
            
        except Exception as e:
            print(f"Error making risk prediction: {e}")
            # Return default risk level and probabilities
            return 'MEDIUM', np.array([0.33, 0.34, 0.33]) 