from flask import render_template, request, redirect, url_for, session, flash, jsonify
from . import bp
from ..models import db, User, SystemConfig

@bp.route('/admin')
def admin_dashboard():
    if session.get('role') != 'ADMIN':
        flash('Unauthorized Access', 'danger')
        return redirect(url_for('main.index'))
    
    users = User.query.all()
    configs = SystemConfig.query.all()
    return render_template('admin_dashboard.html', users=users, configs=configs)

@bp.route('/admin/user/update', methods=['POST'])
def update_user():
    if session.get('role') != 'ADMIN':
        return jsonify({"error": "Unauthorized"}), 403
        
    worker_id = request.form.get('worker_id')
    role = request.form.get('role')
    
    user = User.query.filter_by(worker_id=worker_id).first()
    if user:
        user.role = role
    else:
        new_user = User(worker_id=worker_id, role=role)
        db.session.add(new_user)
        
    db.session.commit()
    flash(f'User {worker_id} updated to {role}.', 'success')
    return redirect(url_for('main.admin_dashboard'))

@bp.route('/admin/user/delete/<int:id>', methods=['POST'])
def delete_user(id):
    if session.get('role') != 'ADMIN':
        return jsonify({"error": "Unauthorized"}), 403
        
    user = User.query.get_or_404(id)
    # Prevent self-deletion if logged in as this user (Safety first)
    if user.worker_id == session.get('worker_id'):
        flash('Cannot delete your own admin account.', 'warning')
        return redirect(url_for('main.admin_dashboard'))
        
    db.session.delete(user)
    db.session.commit()
    flash('User removed.', 'success')
    return redirect(url_for('main.admin_dashboard'))

@bp.route('/admin/config/update', methods=['POST'])
def update_admin_config():
    if session.get('role') != 'ADMIN':
        return jsonify({"error": "Unauthorized"}), 403
        
    key = request.form.get('key')
    value = request.form.get('value')
    
    config = SystemConfig.query.filter_by(key=key).first()
    if config:
        config.value = value
        db.session.commit()
        flash(f'System Rule Updated: {key} is now {value}.', 'success')
    
    return redirect(url_for('main.admin_dashboard'))
