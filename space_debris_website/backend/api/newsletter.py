from flask import Blueprint, request, jsonify
import os
import traceback
from dotenv import load_dotenv
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize blueprint
newsletter_routes = Blueprint('newsletter', __name__)

def send_email(recipient, subject, body):
    """
    Send an email using Gmail SMTP.
    """
    # Gmail SMTP credentials - use the actual values from environment variables
    smtp_server = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
    smtp_port = int(os.getenv('MAIL_PORT', 587))
    smtp_username = 'spacedebrispro@gmail.com'  # Hardcode the email since we know it
    smtp_password = 'ekersycvpsbfztiw'  # Use the App Password
    sender_email = smtp_username

    logger.info(f"Attempting to send email to {recipient}")
    logger.info(f"Using SMTP server: {smtp_server}:{smtp_port}")
    logger.info(f"Using sender email: {sender_email}")

    if not all([smtp_username, smtp_password]):
        logger.warning("Gmail credentials not configured. Falling back to test mode.")
        print("=" * 50)
        print("SENDING EMAIL (TEST MODE)")
        print(f"To: {recipient}")
        print(f"Subject: {subject}")
        print(f"Body: {body}")
        print("=" * 50)
        return True, "Email logged (test mode)"

    try:
        # Create message
        message = MIMEMultipart()
        message['From'] = f"Space Debris Monitoring Team <{sender_email}>"
        message['To'] = recipient
        message['Subject'] = subject

        # Add body
        message.attach(MIMEText(body, 'plain'))

        # Create SMTP session
        logger.info("Creating SMTP session...")
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            logger.info("Starting TLS...")
            server.starttls()
            logger.info("Logging in to SMTP server...")
            logger.info(f"Using username: {smtp_username}")
            logger.info(f"Password length: {len(smtp_password)} characters")
            server.login(smtp_username, smtp_password)
            
            # Send email
            logger.info("Sending email...")
            server.send_message(message)
            logger.info(f"Email sent successfully to {recipient}")
            return True, "Email sent successfully"

    except smtplib.SMTPAuthenticationError as e:
        error_message = f"""SMTP Authentication failed. Please check your Gmail credentials.
        Error details: {str(e)}
        Make sure you:
        1. Have enabled 2-Step Verification
        2. Are using an App Password (16 characters without spaces)
        3. Have entered the correct email address"""
        logger.error(f"Authentication Error: {str(e)}")
        return False, error_message
    except smtplib.SMTPException as e:
        error_message = f"SMTP Error: {str(e)}"
        logger.error(error_message)
        return False, error_message
    except Exception as e:
        error_message = str(e)
        logger.error(f"Unexpected error while sending email: {error_message}")
        logger.error(traceback.format_exc())
        return False, f"Failed to send email: {error_message}"

@newsletter_routes.route('/subscribe', methods=['POST'])
def subscribe():
    """Handle newsletter subscription and send confirmation email"""
    try:
        data = request.get_json()
        if not data:
            logger.error("No JSON data received in request")
            return jsonify({
                'status': 'error',
                'message': 'No data received'
            }), 400

        email = data.get('email')
        logger.info(f"Received subscription request for email: {email}")
        
        if not email:
            logger.error("No email address provided")
            return jsonify({
                'status': 'error',
                'message': 'Email address is required'
            }), 400

        # Email content
        subject = 'Welcome to Space Debris Newsletter!'
        body = """
Thank you for subscribing to the Space Debris Newsletter!

You will now receive regular updates about:
- Latest space debris tracking data
- New research and findings
- Space sustainability initiatives
- Important updates about space debris monitoring

Best regards,
The Space Debris Monitoring Team
        """
        
        # Send email
        success, message = send_email(email, subject, body)
        
        if success:
            logger.info(f"Successfully subscribed {email} to newsletter")
            return jsonify({
                'status': 'success',
                'message': 'Successfully subscribed to newsletter!'
            })
        else:
            logger.error(f"Failed to send confirmation email: {message}")
            return jsonify({
                'status': 'error',
                'message': message
            }), 500
        
    except Exception as e:
        error_details = traceback.format_exc()
        logger.error(f"Error in subscribe endpoint: {str(e)}")
        logger.error(f"Error details: {error_details}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500 