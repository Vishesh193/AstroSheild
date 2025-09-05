from flask import Blueprint, jsonify, request
import datetime
import os
from functools import wraps

auth_routes = Blueprint('auth', __name__)

# Secret key should be loaded from environment variables in production
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'development_secret_key')

# User database - would be a real database in production
USERS = {
    'admin@space-debris.org': {
        'password': 'admin123',  # Would be hashed in production
        'role': 'admin'
    },
    'user@space-debris.org': {
        'password': 'user123',  # Would be hashed in production
        'role': 'user'
    }
}

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            # In production, use a proper JWT library
            # For simplicity, we're just checking if token exists in this example
            if token != 'valid_token_placeholder':
                raise Exception("Invalid token")
            current_user = 'admin@space-debris.org'  # Placeholder
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
            
        return f(current_user, *args, **kwargs)
    
    return decorated

@auth_routes.route('/login', methods=['POST'])
def login():
    auth = request.json
    
    if not auth or not auth.get('email') or not auth.get('password'):
        return jsonify({'message': 'Missing email or password'}), 401
    
    if auth['email'] not in USERS:
        return jsonify({'message': 'User not found!'}), 401
        
    if USERS[auth['email']]['password'] != auth['password']:
        return jsonify({'message': 'Invalid password!'}), 401
    
    # In production, use a proper JWT implementation
    token = 'valid_token_placeholder'
    
    return jsonify({
        'token': token,
        'user': {
            'email': auth['email'],
            'role': USERS[auth['email']]['role']
        }
    })

@auth_routes.route('/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    return jsonify({
        'email': current_user,
        'role': USERS[current_user]['role'] if current_user in USERS else 'unknown'
    }) 