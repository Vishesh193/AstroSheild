from flask import Blueprint, jsonify, request
import pandas as pd
import os
import json

# Create blueprint
debris_routes = Blueprint('debris_routes', __name__)

# Get the absolute path to the project root directory
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
DATA_PATH = os.path.join(PROJECT_ROOT, 'space_debris_website', 'data', 'space_decay.csv')

print(f"Project root: {PROJECT_ROOT}")
print(f"Data path: {DATA_PATH}")

def load_data():
    """Load the space debris data from CSV file"""
    try:
        print(f"Current working directory: {os.getcwd()}")
        print(f"Attempting to load data from: {DATA_PATH}")
        print(f"Does file exist? {os.path.exists(DATA_PATH)}")
        
        if not os.path.exists(DATA_PATH):
            alt_path = os.path.join(os.getcwd(), 'space_debris_website', 'data', 'space_decay.csv')
            print(f"Trying alternative path: {alt_path}")
            if os.path.exists(alt_path):
                print("Found file at alternative path")
                return pd.read_csv(alt_path), None
            print(f"Data file not found at path: {DATA_PATH}")
            return None, "Data file not found"
            
        print(f"Loading data from: {DATA_PATH}")
        df = pd.read_csv(DATA_PATH)
        print(f"Data loaded. Shape: {df.shape if df is not None else 'None'}")
        
        if df is None or len(df) == 0:
            print("Data file is empty")
            return None, "Data file is empty"
            
        print(f"Successfully loaded {len(df)} rows of data")
        print(f"Columns: {df.columns.tolist()}")
        return df, None
    except Exception as e:
        error_msg = f"Error loading data: {str(e)}"
        print(error_msg)
        print(f"Current working directory: {os.getcwd()}")
        print(f"Attempted data path: {DATA_PATH}")
        import traceback
        print(f"Stack trace: {traceback.format_exc()}")
        return None, error_msg

@debris_routes.route('/', methods=['GET'])
def get_debris_data():
    """Get paginated debris data with optional filters"""
    # Get query parameters
    page = request.args.get('page', default=1, type=int)
    limit = request.args.get('limit', default=100, type=int)
    object_type = request.args.get('object_type', default=None, type=str)
    rcs_size = request.args.get('rcs_size', default=None, type=str)
    country_code = request.args.get('country_code', default=None, type=str)
    
    # Load data
    df, error = load_data()
    if df is None:
        return jsonify({'error': error or 'Failed to load data'}), 500
    
    # Apply filters
    if object_type:
        df = df[df['OBJECT_TYPE'] == object_type]
    if rcs_size:
        df = df[df['RCS_SIZE'] == rcs_size]
    if country_code:
        df = df[df['COUNTRY_CODE'] == country_code]
    
    # Calculate pagination
    total_records = len(df)
    total_pages = (total_records + limit - 1) // limit
    start_idx = (page - 1) * limit
    end_idx = min(start_idx + limit, total_records)
    
    # Get paginated data
    paginated_data = df.iloc[start_idx:end_idx].to_dict(orient='records')
    
    return jsonify({
        'data': paginated_data,
        'pagination': {
            'page': page,
            'limit': limit,
            'total_records': total_records,
            'total_pages': total_pages
        }
    })

@debris_routes.route('/stats', methods=['GET'])
def get_debris_stats():
    """Get statistical information about the debris data"""
    df, error = load_data()
    if df is None:
        return jsonify({'error': error or 'Failed to load data'}), 500
    
    # Calculate statistics
    stats = {
        'total_objects': len(df),
        'object_type_counts': df['OBJECT_TYPE'].value_counts().to_dict(),
        'rcs_size_counts': df['RCS_SIZE'].value_counts().to_dict(),
        'country_code_counts': df['COUNTRY_CODE'].value_counts().to_dict(),
        'launch_date_range': {
            'min': df['LAUNCH_DATE'].min() if 'LAUNCH_DATE' in df.columns else None,
            'max': df['LAUNCH_DATE'].max() if 'LAUNCH_DATE' in df.columns else None
        },
        'orbital_parameters': {
            'eccentricity': {
                'min': df['ECCENTRICITY'].min(),
                'max': df['ECCENTRICITY'].max(),
                'mean': df['ECCENTRICITY'].mean()
            },
            'inclination': {
                'min': df['INCLINATION'].min(),
                'max': df['INCLINATION'].max(),
                'mean': df['INCLINATION'].mean()
            },
            'period': {
                'min': df['PERIOD'].min(),
                'max': df['PERIOD'].max(),
                'mean': df['PERIOD'].mean()
            }
        }
    }
    
    return jsonify(stats)

@debris_routes.route('/countries', methods=['GET'])
def get_countries():
    """Get list of countries with debris counts"""
    df, error = load_data()
    if df is None:
        return jsonify({'error': error or 'Failed to load data'}), 500
    
    country_counts = df['COUNTRY_CODE'].value_counts().to_dict()
    countries = [{'code': code, 'count': count} for code, count in country_counts.items()]
    
    return jsonify(countries)

@debris_routes.route('/types', methods=['GET'])
def get_object_types():
    """Get list of object types with counts"""
    df, error = load_data()
    if df is None:
        return jsonify({'error': error or 'Failed to load data'}), 500
    
    type_counts = df['OBJECT_TYPE'].value_counts().to_dict()
    types = [{'type': obj_type, 'count': count} for obj_type, count in type_counts.items()]
    
    return jsonify(types)

@debris_routes.route('/sizes', methods=['GET'])
def get_rcs_sizes():
    """Get list of RCS sizes with counts"""
    df, error = load_data()
    if df is None:
        return jsonify({'error': error or 'Failed to load data'}), 500
    
    size_counts = df['RCS_SIZE'].value_counts().to_dict()
    sizes = [{'size': size, 'count': count} for size, count in size_counts.items()]
    
    return jsonify(sizes) 