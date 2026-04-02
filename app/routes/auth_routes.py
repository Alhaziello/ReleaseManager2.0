from flask import render_template, request, redirect, url_for, session, flash
from . import bp
from ..models import db, User

@bp.route('/login', methods=['GET'])
def login():
    return render_template('mock_login.html')

@bp.route('/callback', methods=['POST'])
def callback():
    worker_id = request.form.get('worker_id')
    user = User.query.filter_by(worker_id=worker_id).first()
    
    if not user:
        user = User(worker_id=worker_id, role='NEW')
        db.session.add(user)
        db.session.commit()
        flash(f'Welcome to CARINA! Your account ({worker_id}) has been registered. Please await Admin permission assignment.', 'success')
    else:
        flash(f'Sign In Successful: {user.worker_id} (Authenticated via AirNZ AD)', 'success')
        
    session['worker_id'] = user.worker_id
    session['role'] = user.role
    return redirect(url_for('main.index'))

@bp.route('/logout')
def logout():
    session.pop('worker_id', None)
    session.pop('role', None)
    flash('You have successfully logged out of CARINA.', 'info')
    return redirect(url_for('main.index'))
