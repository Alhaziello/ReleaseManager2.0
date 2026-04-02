import os

class Config:
    # Base directory for absolute paths
    BASE_DIR = os.path.abspath(os.path.dirname(__name__))
    
    # Flask configuration
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev_secret_key')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Database setting
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', f'sqlite:///{os.path.join(BASE_DIR, "carina.db")}')
    
    # Jenkins Base Path Configuration
    JENKINS_BASE_PATH = os.environ.get('JENKINS_BASE_PATH', os.path.join(BASE_DIR, 'mock_jenkins', 'jobs', 'binaries'))

    # Email Service Configuration (Flask-Mail)
    # Defaulting to local terminal output during development
    MAIL_SERVER = os.environ.get('MAIL_SERVER', 'localhost') 
    MAIL_PORT = int(os.environ.get('MAIL_PORT', 1025))
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', 'false').lower() == 'true'
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_DEFAULT_SENDER', 'carina-noreply@airnewzealand.co.nz')

    # ServiceNow PAC Service Configuration
    SERVICENOW_INSTANCE = os.environ.get('SERVICENOW_INSTANCE', 'airnz-dev.service-now.com')
    SERVICENOW_USER = os.environ.get('SERVICENOW_USER', 'carina_service_account')
