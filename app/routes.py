import os
import shutil
from flask import Blueprint, render_template, request, redirect, url_for, jsonify, session, current_app, flash
from .models import db, Serrc, Promote, PromoteProgram

bp = Blueprint('main', __name__)

@bp.route('/set_role/<role>')
def set_role(role):
    if role in ['ADMIN', 'QA', 'DEV']:
        session['role'] = role
        flash(f'Role switched to {role}', 'success')
    return redirect(request.referrer or url_for('main.index'))

@bp.route('/')
def index():
    return render_template('index.html')

# === SERRC ROUTES ===

@bp.route('/serrcs')
def serrcs_list():
    serrcs = Serrc.query.all()
    return render_template('serrcs.html', serrcs=serrcs)

@bp.route('/serrcs/add', methods=['POST'])
def add_serrc():
    serrc_no = request.form.get('serrc_no')
    program_name = request.form.get('program_name')
    cause = request.form.get('cause')
    action = request.form.get('action')
    
    if serrc_no and program_name:
        new_serrc = Serrc(serrc_no=serrc_no, program_name=program_name, cause=cause, action=action)
        db.session.add(new_serrc)
        db.session.commit()
        
    return redirect(url_for('main.serrcs_list'))

@bp.route('/serrcs/delete/<int:id>', methods=['POST'])
def delete_serrc(id):
    serrc = Serrc.query.get_or_404(id)
    db.session.delete(serrc)
    db.session.commit()
    return redirect(url_for('main.serrcs_list'))

# === PROMOTE ROUTES ===

@bp.route('/promotes')
def promotes_list():
    promotes = Promote.query.order_by(Promote.id.desc()).all()
    return render_template('promotes.html', promotes=promotes)

@bp.route('/promotes/add', methods=['POST'])
def add_promote():
    ticket_no = request.form.get('ticket_no')
    programmer = request.form.get('programmer')
    description = request.form.get('description')
    
    if ticket_no:
        new_promote = Promote(ticket_no=ticket_no, programmer=programmer, description=description, job_status="TBC")
        
        # Set a dummy load module name for testing Jenkins moves
        new_promote.load_module = f"{ticket_no}_module"
        
        db.session.add(new_promote)
        db.session.commit()
        
        # Create a mock XML file in QUAL_LOAD for DEV to move later
        qual_load_path = os.path.join(current_app.config['JENKINS_BASE_PATH'], 'QUAL_LOAD')
        os.makedirs(qual_load_path, exist_ok=True)
        with open(os.path.join(qual_load_path, f"{new_promote.load_module}.xml"), 'w') as f:
            f.write("<dummy>This is a Jenkins payload</dummy>")
        
        # Optionally add a program to it
        program_name = request.form.get('program_name')
        if program_name:
            new_prog = PromoteProgram(promote_id=new_promote.id, program=program_name)
            db.session.add(new_prog)
            db.session.commit()
            
    return redirect(url_for('main.promotes_list'))

@bp.route('/promotes/<int:id>')
def promote_detail(id):
    promote = Promote.query.get_or_404(id)
    return render_template('promote_detail.html', p=promote)

@bp.route('/promotes/delete/<int:id>', methods=['POST'])
def delete_promote(id):
    if session.get('role') != 'ADMIN':
        flash('Unauthorized', 'danger')
        return redirect(url_for('main.promotes_list'))
        
    promote = Promote.query.get_or_404(id)
    db.session.delete(promote)
    db.session.commit()
    flash('Promote deleted.', 'success')
    return redirect(url_for('main.promotes_list'))

@bp.route('/promotes/<int:id>/advance/<action>', methods=['POST'])
def advance_promote(id, action):
    promote = Promote.query.get_or_404(id)
    role = session.get('role', '')
    base_path = current_app.config['JENKINS_BASE_PATH']
    filename = f"{promote.load_module}.xml"
    
    try:
        if action == 'to_uat' and promote.job_status == 'TBC' and role in ['DEV', 'ADMIN']:
            src = os.path.join(base_path, 'QUAL_LOAD', filename)
            dst = os.path.join(base_path, 'UAT', filename)
            if os.path.exists(src): shutil.move(src, dst)
            promote.job_status = 'UAT in Progress'
            
        elif action == 'to_prod' and promote.job_status == 'UAT in Progress' and role in ['QA', 'ADMIN']:
            src = os.path.join(base_path, 'UAT', filename)
            dst = os.path.join(base_path, 'PROD_LOAD', filename)
            if os.path.exists(src): shutil.move(src, dst)
            promote.job_status = 'Ready for Production'
            
        elif action == 'load_prod' and promote.job_status == 'Ready for Production' and role == 'ADMIN':
            # Simulating A0 load - just status update
            promote.job_status = 'Loaded To Production (A0)'
            
        elif action == 'consolidate' and promote.job_status == 'Loaded To Production (A0)' and role == 'ADMIN':
            # Create dummy PROD_FBK if it doesn't exist just to test move
            src = os.path.join(base_path, 'PROD_FBK', filename)
            dst = os.path.join(base_path, 'CONSOLIDATED', filename)
            if not os.path.exists(src): # Mocking the existence for testing
                os.makedirs(os.path.dirname(src), exist_ok=True)
                with open(src, 'w') as f: f.write('<dummy/>')
            shutil.move(src, dst)
            promote.job_status = 'Consolidated To A2ZDAT'
            
        else:
            flash('Invalid action or unauthorized role for this state.', 'danger')
            return redirect(url_for('main.promote_detail', id=promote.id))
            
        db.session.commit()
        flash(f'Promote advanced successfully to {promote.job_status}. Jenkins file moved.', 'success')
        
    except Exception as e:
        flash(f'Error moving Jenkins file: {str(e)}', 'danger')
        
    return redirect(url_for('main.promote_detail', id=promote.id))

# === API CHUNK ROUTE === (To support the 1.5k upload feature specified in original spec)
@bp.route('/api/chunk/serrc', methods=['POST'])
def add_multiple_serrc():
    data = request.get_json()
    if not data or not isinstance(data, list):
        return jsonify({"error": "Expected a list of serrc objects"}), 400
        
    added = 0
    for item in data:
        # Ignore if it already exists to simplify
        if not Serrc.query.filter_by(serrc_no=item.get('serrc_no')).first():
            new_s = Serrc(
                serrc_no=item.get('serrc_no'),
                program_name=item.get('program_name'),
                cause=item.get('cause'),
                action=item.get('action')
            )
            db.session.add(new_s)
            added += 1
            
    db.session.commit()
    return jsonify({"message": f"Successfully added {added} records"})
