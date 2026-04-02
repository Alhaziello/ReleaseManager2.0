import os
from flask import render_template, request, redirect, url_for, session, flash
from . import bp
from ..models import db, Promote
from ..services.promote_service import PromoteService

@bp.route('/promotes')
def promotes_list():
    promotes = Promote.query.order_by(Promote.promote_date.desc()).all()
    return render_template('promotes.html', promotes=promotes)

@bp.route('/promotes/add', methods=['POST'])
def add_promote():
    try:
        PromoteService.create_promote(request.form)
        db.session.commit()
        flash('New promote ticket created.', 'success')
    except ValueError as e:
        flash(str(e), 'danger')
    except Exception as e:
        flash(f'Error creating promote: {str(e)}', 'danger')
        
    return redirect(url_for('main.promotes_list'))

@bp.route('/promotes/<int:id>')
def promote_detail(id):
    promote = Promote.query.get_or_404(id)
    return render_template('promote_detail.html', p=promote)

@bp.route('/promotes/delete/<int:id>', methods=['POST'])
def delete_promote(id):
    try:
        PromoteService.delete_promote(id, session.get('role'))
        db.session.commit()
        flash('Promote deleted.', 'success')
    except PermissionError as e:
        flash(str(e), 'danger')
    except Exception as e:
        flash(f'Error deleting promote: {str(e)}', 'danger')
        
    return redirect(url_for('main.promotes_list'))

@bp.route('/promotes/<int:id>/advance/<action>', methods=['POST'])
def advance_promote(id, action):
    promote = Promote.query.get_or_404(id)
    role = session.get('role', '')
    data = dict(request.form)
    
    try:
        category, message = PromoteService.execute(promote, action, role, data)
        db.session.commit()
        if category and message:
            flash(message, category)
    except PermissionError as pe:
        flash(str(pe), 'danger')
    except ValueError as ve:
        flash(str(ve), 'danger')
    except Exception as e:
        flash(f'System Error: {str(e)}', 'danger')
        
    return redirect(url_for('main.promote_detail', id=promote.id))
