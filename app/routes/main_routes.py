from flask import render_template, session, g
from . import bp
from ..models import User, SystemConfig

@bp.before_app_request
def load_config():
    # Load all system configs into g for easy access in templates
    configs = SystemConfig.query.all()
    g.config = {c.key: c.value for c in configs}
    
    # Also ensure current_user is available in g if logged in
    g.user = None
    if 'worker_id' in session:
        g.user = User.query.filter_by(worker_id=session['worker_id']).first()

@bp.route('/')
def index():
    return render_template('index.html')
