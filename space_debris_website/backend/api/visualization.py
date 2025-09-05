from flask import Blueprint, jsonify, request
import pandas as pd
import numpy as np
import os
import json
import plotly.express as px
import plotly.graph_objects as go
import plotly.utils

# Create blueprint
visualization_routes = Blueprint('visualization_routes', __name__)

# Path to the data file
# Try multiple possible paths to find the data file
DATA_PATHS = [
    # Original path
    os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data', 'space_decay.csv'),
    # Alternative path relative to backend
    os.path.join(os.path.dirname(os.path.dirname(__file__)), '..', 'data', 'space_decay.csv'),
    # Root level path
    os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 'space_decay.csv'),
    # Absolute path to project root + data
    os.path.join(os.path.abspath(os.sep), 'Users', 'vishe', 'OneDrive', 'Desktop', 'project this', 'space_decay.csv'),
    # Absolute path to project data directory
    os.path.join(os.path.abspath(os.sep), 'Users', 'vishe', 'OneDrive', 'Desktop', 'project this', 'space_debris_website', 'data', 'space_decay.csv')
]

def load_data():
    """Load the space debris data from CSV file"""
    for path in DATA_PATHS:
        try:
            print(f"Trying to load data from {path}")
            if os.path.exists(path):
                print(f"Found data file at: {path}")
                df = pd.read_csv(path)
                if df is not None and len(df) > 0:
                    print(f"Successfully loaded {len(df)} rows of data")
                    
                    # Add computed columns that might be needed
                    try:
                        # Calculate altitude from semimajor axis
                        df['ALTITUDE_KM'] = df['SEMIMAJOR_AXIS'] - 6371  # Earth radius in km
                        
                        # Calculate orbital period in hours
                        df['PERIOD_HOURS'] = df['PERIOD'] / 60
                        
                        print("Successfully added computed columns")
                    except Exception as e:
                        print(f"Warning: Error adding computed columns: {e}")
                    
                    return df
                else:
                    print(f"Warning: Data file at {path} is empty")
            else:
                print(f"Data file not found at {path}")
        except Exception as e:
            print(f"Error loading data from {path}: {e}")
            continue
    
    # If we get here, we couldn't find the data file
    print("Failed to load data from any of the possible paths")
    print("Searched paths:")
    for path in DATA_PATHS:
        print(f"  - {path}")
    return None

@visualization_routes.route('/orbit-distribution', methods=['GET'])
def get_orbit_distribution():
    """Get orbit distribution visualization data"""
    df = load_data()
    if df is None:
        return jsonify({'error': 'Failed to load data'}), 500
    
    # Filter out rows with missing values
    df = df.dropna(subset=['PERIOD', 'INCLINATION'])
    
    # Create a new column for period in hours
    df['PERIOD_HOURS'] = df['PERIOD'] / 60
    
    # Create scatter plot data
    scatter_data = []
    
    # Group by RCS_SIZE
    for rcs_size in df['RCS_SIZE'].unique():
        if pd.isna(rcs_size):
            continue
            
        size_df = df[df['RCS_SIZE'] == rcs_size]
        
        scatter_data.append({
            'x': size_df['PERIOD_HOURS'].tolist(),
            'y': size_df['INCLINATION'].tolist(),
            'mode': 'markers',
            'type': 'scatter',
            'name': rcs_size,
            'text': [f"Object Type: {obj_type}<br>Country: {country}<br>Period: {period:.2f} hours<br>Inclination: {incl:.2f}°"
                    for obj_type, country, period, incl in zip(
                        size_df['OBJECT_TYPE'], 
                        size_df['COUNTRY_CODE'], 
                        size_df['PERIOD_HOURS'], 
                        size_df['INCLINATION']
                    )],
            'hoverinfo': 'text'
        })
    
    # Create layout
    layout = {
        'title': 'Orbit Distribution by RCS Size',
        'xaxis': {
            'title': 'Period (hours)',
            'range': [0, 30]
        },
        'yaxis': {
            'title': 'Inclination (degrees)',
            'range': [0, 180]
        },
        'hovermode': 'closest'
    }
    
    return jsonify({
        'data': scatter_data,
        'layout': layout
    })

@visualization_routes.route('/country-distribution', methods=['GET'])
def get_country_distribution():
    """Get country distribution visualization data"""
    df = load_data()
    if df is None:
        return jsonify({'error': 'Failed to load data'}), 500
    
    # Count objects by country
    country_counts = df['COUNTRY_CODE'].value_counts().reset_index()
    country_counts.columns = ['country', 'count']
    
    # Get top 10 countries
    top_countries = country_counts.head(10)
    
    # Create bar chart data
    bar_data = [{
        'x': top_countries['country'].tolist(),
        'y': top_countries['count'].tolist(),
        'type': 'bar',
        'marker': {
            'color': 'rgba(50, 171, 96, 0.7)'
        }
    }]
    
    # Create layout
    layout = {
        'title': 'Space Debris by Country of Origin',
        'xaxis': {
            'title': 'Country'
        },
        'yaxis': {
            'title': 'Number of Objects'
        }
    }
    
    return jsonify({
        'data': bar_data,
        'layout': layout
    })

@visualization_routes.route('/size-type-distribution', methods=['GET'])
def get_size_type_distribution():
    """Get size and type distribution visualization data"""
    df = load_data()
    if df is None:
        return jsonify({'error': 'Failed to load data'}), 500
    
    # Create a pivot table of object type vs RCS size
    pivot_df = pd.pivot_table(
        df, 
        values='OBJECT_ID', 
        index='OBJECT_TYPE', 
        columns='RCS_SIZE', 
        aggfunc='count',
        fill_value=0
    ).reset_index()
    
    # Convert to list of dictionaries for JSON serialization
    heatmap_data = []
    for _, row in pivot_df.iterrows():
        obj_type = row['OBJECT_TYPE']
        for size in pivot_df.columns[1:]:  # Skip the first column (OBJECT_TYPE)
            if not pd.isna(size):
                heatmap_data.append({
                    'object_type': obj_type,
                    'rcs_size': size,
                    'count': int(row[size])
                })
    
    return jsonify(heatmap_data)

@visualization_routes.route('/orbital-parameters', methods=['GET'])
def get_orbital_parameters():
    """Get orbital parameters visualization data"""
    df = load_data()
    if df is None:
        return jsonify({'error': 'Failed to load data'}), 500
    
    # Filter out rows with missing values
    df = df.dropna(subset=['ECCENTRICITY', 'INCLINATION', 'PERIOD'])
    
    # Create a new column for period in hours
    df['PERIOD_HOURS'] = df['PERIOD'] / 60
    
    # Create scatter plot data for eccentricity vs period
    ecc_period_data = []
    
    # Group by RCS_SIZE
    for rcs_size in df['RCS_SIZE'].unique():
        if pd.isna(rcs_size):
            continue
            
        size_df = df[df['RCS_SIZE'] == rcs_size]
        
        ecc_period_data.append({
            'x': size_df['PERIOD_HOURS'].tolist(),
            'y': size_df['ECCENTRICITY'].tolist(),
            'mode': 'markers',
            'type': 'scatter',
            'name': rcs_size,
            'text': [f"Object Type: {obj_type}<br>Country: {country}<br>Period: {period:.2f} hours<br>Eccentricity: {ecc:.4f}"
                    for obj_type, country, period, ecc in zip(
                        size_df['OBJECT_TYPE'], 
                        size_df['COUNTRY_CODE'], 
                        size_df['PERIOD_HOURS'], 
                        size_df['ECCENTRICITY']
                    )],
            'hoverinfo': 'text'
        })
    
    # Create layout for eccentricity vs period
    ecc_period_layout = {
        'title': 'Eccentricity vs Period by RCS Size',
        'xaxis': {
            'title': 'Period (hours)',
            'range': [0, 30]
        },
        'yaxis': {
            'title': 'Eccentricity',
            'range': [0, 1]
        },
        'hovermode': 'closest'
    }
    
    # Create scatter plot data for inclination vs eccentricity
    inc_ecc_data = []
    
    # Group by RCS_SIZE
    for rcs_size in df['RCS_SIZE'].unique():
        if pd.isna(rcs_size):
            continue
            
        size_df = df[df['RCS_SIZE'] == rcs_size]
        
        inc_ecc_data.append({
            'x': size_df['ECCENTRICITY'].tolist(),
            'y': size_df['INCLINATION'].tolist(),
            'mode': 'markers',
            'type': 'scatter',
            'name': rcs_size,
            'text': [f"Object Type: {obj_type}<br>Country: {country}<br>Eccentricity: {ecc:.4f}<br>Inclination: {incl:.2f}°"
                    for obj_type, country, ecc, incl in zip(
                        size_df['OBJECT_TYPE'], 
                        size_df['COUNTRY_CODE'], 
                        size_df['ECCENTRICITY'], 
                        size_df['INCLINATION']
                    )],
            'hoverinfo': 'text'
        })
    
    # Create layout for inclination vs eccentricity
    inc_ecc_layout = {
        'title': 'Inclination vs Eccentricity by RCS Size',
        'xaxis': {
            'title': 'Eccentricity',
            'range': [0, 1]
        },
        'yaxis': {
            'title': 'Inclination (degrees)',
            'range': [0, 180]
        },
        'hovermode': 'closest'
    }
    
    return jsonify({
        'eccentricity_period': {
            'data': ecc_period_data,
            'layout': ecc_period_layout
        },
        'inclination_eccentricity': {
            'data': inc_ecc_data,
            'layout': inc_ecc_layout
        }
    })

@visualization_routes.route('/altitude-distribution', methods=['GET'])
def get_altitude_distribution():
    """Get altitude distribution visualization data"""
    df = load_data()
    if df is None:
        return jsonify({'error': 'Failed to load data'}), 500
    
    # Calculate altitude (km) from semimajor axis (Earth radius ~ 6371 km)
    df['ALTITUDE_KM'] = df['SEMIMAJOR_AXIS'] - 6371
    
    # Filter out negative altitudes (should not happen, but just in case)
    df = df[df['ALTITUDE_KM'] > 0]
    
    # Create histogram data
    histogram_data = []
    
    # Group by RCS_SIZE
    for rcs_size in df['RCS_SIZE'].unique():
        if pd.isna(rcs_size):
            continue
            
        size_df = df[df['RCS_SIZE'] == rcs_size]
        
        histogram_data.append({
            'x': size_df['ALTITUDE_KM'].tolist(),
            'type': 'histogram',
            'name': rcs_size,
            'opacity': 0.7,
            'nbinsx': 50
        })
    
    # Create layout
    layout = {
        'title': 'Altitude Distribution by RCS Size',
        'xaxis': {
            'title': 'Altitude (km)',
            'range': [0, 40000]
        },
        'yaxis': {
            'title': 'Count'
        },
        'barmode': 'overlay'
    }
    
    return jsonify({
        'data': histogram_data,
        'layout': layout
    }) 