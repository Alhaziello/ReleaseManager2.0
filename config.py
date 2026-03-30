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
    # Defaults to a local mock folder unless specified via environment variable
    JENKINS_BASE_PATH = os.environ.get('JENKINS_BASE_PATH', os.path.join(BASE_DIR, 'mock_jenkins', 'jobs', 'binaries'))
