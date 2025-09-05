# Space Debris Monitoring Project

This project provides a web-based platform for monitoring and analyzing space debris.

## Project Structure

- `space_debris_website/` - Main project directory
  - `frontend/` - React frontend application
  - `backend/` - Python Flask backend API
  - `public/` - Public assets including images
  - `data/` - Data files for the project
  - `models/` - Machine learning models

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- pip (Python package manager)
- npm (Node.js package manager)

### Installation

1. Clone the repository or download the project files
2. Run the setup script to install all dependencies:
   - Double-click `setup.bat` in the root directory
   - This will install all required Python and Node.js packages

### Running the Project

#### Easy Method (Windows)

1. Double-click the `start.bat` file in the root directory
2. Choose an option:
   - Option 1: Start Frontend Only
   - Option 2: Start Backend Only
   - Option 3: Start Both Frontend and Backend (recommended)

#### Manual Method

##### Backend

```bash
cd space_debris_website/backend
pip install -r requirements.txt  # Only needed first time
python app.py
```

##### Frontend

```bash
cd space_debris_website/frontend
npm install  # Only needed first time
npm start
```

## Accessing the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

- `/api/health` - Health check endpoint
- `/api/info` - API information
- `/api/debris` - Space debris data endpoints
- `/api/prediction` - RCS size prediction endpoints
- `/api/visualization` - Data visualization endpoints

## Troubleshooting

### Image Loading Issues

If images don't load properly, make sure they are placed in the correct directory:
- Frontend public images: `space_debris_website/frontend/public/static/images/`
- Shared public images: `space_debris_website/public/static/images/`

### Proxy Errors

If you see proxy errors in the console, it means the backend server is not running. You can:
1. Make sure the backend server is running on port 5000
2. Check if there are any Python dependency issues
3. Look for error messages in the backend terminal

### Package.json Not Found Error

If you see an error about package.json not being found, make sure you're running the commands from the correct directory:
- For frontend: Run commands from `space_debris_website/frontend`
- For backend: Run commands from `space_debris_website/backend`
- Or use the provided `start.bat` script which handles directory navigation

## Team

- Prachi Bansal - Lead Researcher and ML Engineer
- Vishesh Arora - Data Scientist and Full Stack Developer
- Prabhrehmat Kaur - Lead Researcher and ML Engineer 