from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta

events_routes = Blueprint('events', __name__)

@events_routes.route('/', methods=['GET'])
def get_events():
    """Get upcoming and past space events related to debris"""
    # Filter by date range if provided
    start_date = request.args.get('start_date', (datetime.now() - timedelta(days=30)).isoformat())
    end_date = request.args.get('end_date', (datetime.now() + timedelta(days=30)).isoformat())
    
    # Sample events data - would come from database in production
    events = [
        {
            'id': 'EVT-2023-001',
            'title': 'Planned ISS debris avoidance maneuver',
            'type': 'maneuver',
            'date': '2023-05-15T08:00:00Z',
            'description': 'ISS will perform debris avoidance maneuver to avoid conjunction with COSMOS 1408 debris'
        },
        {
            'id': 'EVT-2023-002',
            'title': 'SpaceX Starlink de-orbit test',
            'type': 'deorbit',
            'date': '2023-06-01T00:00:00Z',
            'description': 'Planned de-orbit of Starlink satellite as part of end-of-life testing'
        },
        {
            'id': 'EVT-2023-003',
            'title': 'Chinese ASAT test anniversary',
            'type': 'historical',
            'date': '2023-01-11T00:00:00Z',
            'description': 'Anniversary of 2007 Chinese ASAT test that created thousands of debris pieces'
        }
    ]
    
    # Filter by date
    filtered_events = [e for e in events if start_date <= e['date'] <= end_date]
    
    return jsonify({'events': filtered_events})

@events_routes.route('/types', methods=['GET'])
def get_event_types():
    """Get all event types for filtering"""
    event_types = [
        {'id': 'launch', 'name': 'Launch', 'description': 'Satellite or spacecraft launch'},
        {'id': 'maneuver', 'name': 'Avoidance Maneuver', 'description': 'Debris avoidance maneuvers'},
        {'id': 'deorbit', 'name': 'De-orbit', 'description': 'Planned de-orbiting of spacecraft'},
        {'id': 'breakup', 'name': 'Breakup Event', 'description': 'Satellite or debris breakup events'},
        {'id': 'historical', 'name': 'Historical Event', 'description': 'Significant historical events'}
    ]
    return jsonify({'event_types': event_types}) 