import os
from flask import Flask
from .models import db
from .routes import bp
from config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    
    # Register blueprints
    app.register_blueprint(bp)
    
    # Create tables automatically for dev
    with app.app_context():
        db.create_all()
        
    return app
