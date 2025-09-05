import os
from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
from dotenv import load_dotenv
from datetime import datetime
from flask_socketio import SocketIO

# Import API routes
from api.debris_data import debris_routes
from api.prediction import prediction_routes
from api.visualization import visualization_routes
from api.newsletter import newsletter_routes
from api.real_time import real_time_routes
from api.events import events_routes
from api.auth import auth_routes

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes with more permissive settings
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Initialize SocketIO
socketio = SocketIO(app, cors_allowed_origins="*")

# Register API blueprints
app.register_blueprint(debris_routes, url_prefix='/api/debris-data')
app.register_blueprint(prediction_routes, url_prefix='/api/prediction')
app.register_blueprint(visualization_routes, url_prefix='/api/visualization')
app.register_blueprint(newsletter_routes, url_prefix='/api/newsletter')
app.register_blueprint(real_time_routes, url_prefix='/api/real-time')
app.register_blueprint(events_routes, url_prefix='/api/events')
app.register_blueprint(auth_routes, url_prefix='/api/auth')

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint to verify API is running"""
    return jsonify({
        'status': 'success',
        'message': 'Space Debris API is running'
    })

@app.route('/api/info', methods=['GET'])
def api_info():
    """Endpoint to provide information about the API"""
    return jsonify({
        'name': 'Space Debris API',
        'version': '1.1.0',
        'description': 'API for space debris visualization and prediction',
        'endpoints': [
            '/api/debris-data - Space debris data endpoints',
            '/api/prediction - RCS size prediction endpoints',
            '/api/visualization - Data visualization endpoints',
            '/api/real-time - Real-time debris tracking and alerts',
            '/api/events - Space events calendar',
            '/api/auth - User authentication',
            '/api/health - Health check endpoint',
            '/api/info - API information endpoint'
        ]
    })

# WebSocket event handlers
@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('subscribe_debris_updates')
def handle_debris_subscription(data):
    # Handle subscription to real-time debris updates
    socketio.emit('debris_update', {
        'timestamp': datetime.now().isoformat(),
        'message': 'Subscribed to debris updates'
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    socketio.run(app, host='0.0.0.0', port=port, debug=True) 