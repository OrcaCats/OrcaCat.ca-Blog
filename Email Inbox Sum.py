from flask import Flask, render_template, request, redirect, url_for
import os.path
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

# Scopes for Gmail API
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

app = Flask(__name__)

def authenticate_gmail():
    """Authenticate and return the Gmail API service."""
    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
            creds = flow.run_local_server(port=8080)
        # Save the credentials for future use
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    return build('gmail', 'v1', credentials=creds)

def get_unread_emails(service):
    """Retrieve unread emails from the Gmail inbox."""
    results = service.users().messages().list(userId='me', labelIds=['INBOX'], q='is:unread').execute()
    messages = results.get('messages', [])
    emails = []

    if messages:
        for message in messages:
            msg = service.users().messages().get(userId='me', id=message['id']).execute()
            headers = msg.get('payload', {}).get('headers', [])
            subject = [header['value'] for header in headers if header['name'] == 'Subject']
            from_email = [header['value'] for header in headers if header['name'] == 'From']
            emails.append({
                "from": from_email[0] if from_email else 'Unknown',
                "subject": subject[0] if subject else 'No Subject'
            })
    return emails

@app.route('/')
def index():
    """Homepage that displays unread emails."""
    service = authenticate_gmail()
    emails = get_unread_emails(service)
    return render_template('index.html', emails=emails)

@app.route('/')
def index():
    try:
        return '<a href="/authorize">Authorize Gmail</a>'
    except Exception as e:
        return f"Error: {str(e)}", 500

if __name__ == '__main__':
    app.run(debug=True, port=8080)