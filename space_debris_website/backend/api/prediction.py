from flask import Blueprint, jsonify, request
import pandas as pd
import numpy as np
import joblib
import os
import sys

# Add the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

# Import model utilities
from models.rcs_predictor import RCSPredictor
from models.decay_predictor import DecayPredictor
from models.risk_predictor import RiskPredictor

# Create blueprint
prediction_routes = Blueprint('prediction_routes', __name__)

# Initialize the predictors
rcs_predictor = RCSPredictor()
decay_predictor = DecayPredictor()
risk_predictor = RiskPredictor()

# Define required fields for each model
rcs_fields = [
    'OBJECT_AGE', 'CENT_FOCUS_DIST', 'APOAPSIS', 'PERIAPSIS', 
    'MEAN_ANOMALY', 'MEAN_MOTION', 'INCLINATION', 'RA_OF_ASC_NODE', 
    'ARG_OF_PERICENTER', 'PERIOD'
]

decay_risk_fields = [
    'MEAN_MOTION', 'ECCENTRICITY', 'INCLINATION', 'SEMIMAJOR_AXIS',
    'PERIOD', 'APOAPSIS', 'PERIAPSIS', 'ORBITAL_ENERGY', 'ORBITAL_PERIOD',
    'MEAN_VELOCITY', 'AGE', 'OBJECT_TYPE', 'ORBIT_CLASS'
]

@prediction_routes.route('/rcs', methods=['POST'])
def predict_rcs():
    """Predict RCS size based on orbital parameters"""
    try:
        data = request.get_json()
        
        # Validate required fields
        for field in rcs_fields:
            if field not in data:
                return jsonify({
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Create input features
        features = {field: float(data[field]) for field in rcs_fields}
        
        # Make RCS prediction
        rcs_class, probabilities = rcs_predictor.predict(features)
        
        # Format probabilities for each class
        rcs_class_probabilities = [
            {"class": "SMALL", "probability": float(probabilities[0])},
            {"class": "MEDIUM", "probability": float(probabilities[1])},
            {"class": "LARGE", "probability": float(probabilities[2])}
        ]
        
        return jsonify({
            'predicted_class': rcs_class,
            'class_probabilities': rcs_class_probabilities,
            'input_features': features
        })
    
    except Exception as e:
        return jsonify({
            'error': f'RCS prediction error: {str(e)}'
        }), 500

@prediction_routes.route('/decay', methods=['POST'])
def predict_decay():
    """Predict decay probability based on orbital parameters"""
    try:
        data = request.get_json()
        
        # Validate required fields
        for field in decay_risk_fields:
            if field not in data:
                return jsonify({
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Make prediction
        decay_prob, probabilities = decay_predictor.predict(data)
        
        return jsonify({
            'decay_probability': decay_prob,
            'likely_to_decay': decay_prob > 0.5,
            'input_features': data
        })
    
    except Exception as e:
        return jsonify({
            'error': f'Decay prediction error: {str(e)}'
        }), 500

@prediction_routes.route('/risk', methods=['POST'])
def predict_risk():
    """Predict collision risk based on orbital parameters"""
    try:
        data = request.get_json()
        
        # Validate required fields
        for field in decay_risk_fields:
            if field not in data:
                return jsonify({
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Make prediction
        risk_level, probabilities = risk_predictor.predict(data)
        
        return jsonify({
            'risk_level': risk_level,
            'risk_probabilities': {
                'low': float(probabilities[0]),
                'medium': float(probabilities[1]),
                'high': float(probabilities[2])
            },
            'input_features': data
        })
    
    except Exception as e:
        return jsonify({
            'error': f'Risk prediction error: {str(e)}'
        }), 500

@prediction_routes.route('/model-info', methods=['GET'])
def get_model_info():
    """Get information about all prediction models"""
    try:
        return jsonify({
            'rcs_model': {
                'model_type': rcs_predictor.model_type,
                'accuracy': rcs_predictor.accuracy,
                'training_samples': 5000,
                'last_updated': rcs_predictor.last_trained,
                'feature_importance': rcs_predictor.feature_importance,
                'required_fields': rcs_fields
            },
            'decay_model': {
                'model_type': decay_predictor.model_type,
                'accuracy': decay_predictor.accuracy,
                'last_updated': decay_predictor.last_trained,
                'feature_importance': decay_predictor.feature_importance,
                'required_fields': decay_risk_fields
            },
            'risk_model': {
                'model_type': risk_predictor.model_type,
                'accuracy': risk_predictor.accuracy,
                'last_updated': risk_predictor.last_trained,
                'feature_importance': risk_predictor.feature_importance,
                'required_fields': decay_risk_fields
            }
        })
    except Exception as e:
        return jsonify({
            'error': f'Error getting model info: {str(e)}'
        }), 500 