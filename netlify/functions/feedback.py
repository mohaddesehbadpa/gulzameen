"""
Netlify Function: Handle feedback submissions
Saves to dist/data/feedback.json
"""

import json
import os
import smtplib
import ssl
from email.message import EmailMessage
from datetime import datetime

# The destination email address for feedback notifications.
FEEDBACK_EMAIL_TO = os.environ.get('FEEDBACK_EMAIL_TO', 'mohaddesehbadpa0@gmail.com')
EMAIL_FROM = os.environ.get('EMAIL_FROM', 'no-reply@gulzameen.app')
SMTP_SERVER = os.environ.get('EMAIL_SMTP_SERVER', 'smtp.gmail.com')
SMTP_PORT = int(os.environ.get('EMAIL_SMTP_PORT', '587'))
SMTP_USER = os.environ.get('EMAIL_SMTP_USER')
SMTP_PASSWORD = os.environ.get('EMAIL_SMTP_PASSWORD')


def send_feedback_email(name, feedback_text):
    """Send a feedback notification email with the user's name and feedback."""
    if not SMTP_USER or not SMTP_PASSWORD:
        raise RuntimeError('SMTP credentials are not configured.')

    subject = f'New Feedback from {name or "Anonymous"}'
    body = (
        'Name: {}\n\n'
        'Feedback:\n{}\n\n'
        'Submitted: {}'
    ).format(
        name or 'Anonymous',
        feedback_text,
        datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')
    )

    message = EmailMessage()
    message['From'] = EMAIL_FROM
    message['To'] = FEEDBACK_EMAIL_TO
    message['Subject'] = subject
    message.set_content(body)

    context = ssl.create_default_context()
    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=30) as server:
        server.starttls(context=context)
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.send_message(message)


def handler(event, context):
    """Handle feedback POST requests"""
    if event['httpMethod'] != 'POST':
        return {
            'statusCode': 405,
            'body': json.dumps({'error': 'Method not allowed'})
        }

    try:
        body = json.loads(event['body'])
        name = body.get('name', 'Anonymous').strip()
        feedback_text = body.get('feedback', '').strip()

        if not feedback_text:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Feedback cannot be empty'})
            }

        # Create feedback entry
        entry = {
            'name': name,
            'feedback': feedback_text,
            'timestamp': datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')
        }

        # Save to file (in dist/data for Netlify)
        data_dir = os.path.join(os.path.dirname(__file__), '../../dist/data')
        os.makedirs(data_dir, exist_ok=True)

        feedback_file = os.path.join(data_dir, 'feedback.json')

        feedbacks = []
        if os.path.exists(feedback_file):
            with open(feedback_file, 'r', encoding='utf-8') as f:
                feedbacks = json.load(f)

        feedbacks.insert(0, entry)

        with open(feedback_file, 'w', encoding='utf-8') as f:
            json.dump(feedbacks, f, ensure_ascii=False, indent=2)

        # Send email notification
        send_feedback_email(name, feedback_text)

        return {
            'statusCode': 200,
            'body': json.dumps({'success': True, 'message': 'Feedback saved and emailed!'})
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
