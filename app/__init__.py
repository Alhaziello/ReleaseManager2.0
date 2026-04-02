import os
from flask import Flask
from .routes import bp
from .extensions import db, mail
from config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    mail.init_app(app)
    
    # Register blueprints
    app.register_blueprint(bp)
    
    # Custom Date Filter
    @app.template_filter('format_date')
    def format_date_filter(value):
        if not value: return '---'
        try:
            parts = str(value).split(' ')[0].split('-')
            if len(parts) == 3:
                return f"{parts[2]}/{parts[1]}/{parts[0]}"
        except: pass
        return value
    
    # Create tables automatically for dev
    with app.app_context():
        db.create_all()
        
    return app
