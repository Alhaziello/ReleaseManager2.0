import os
import shutil
from flask import Blueprint, render_template, request, redirect, url_for, jsonify, session, current_app, flash, g
from .models import db, Serrc, Promote, PromoteProgram, User, SystemConfig
from .services.email_service import EmailService
from .services.pac_service import PACService
from .services.jenkins_service import JenkinsService

bp = Blueprint('main', __name__)

@bp.before_app_request
def load_config():
    # Load all system configs into g for easy access in templates
    configs = SystemConfig.query.all()
    g.config = {c.key: c.value for c in configs}
    
    # Also ensure current_user is available in g if logged in
    g.user = None
    if 'worker_id' in session:
        g.user = User.query.filter_by(worker_id=session['worker_id']).first()

# TODO(Integration): Replace these mock routes with Authlib ServiceNow OAuth 2.0 flow
@bp.route('/login', methods=['GET'])
def login():
    # TODO(Integration): Implementation of Authlib OpenID Connect Redirect to AirNZ IDP (ADFS/Azure)
    return render_template('mock_login.html')

@bp.route('/callback', methods=['POST'])
def callback():
    # TODO(Integration): Extract worker_id from ServiceNow OAuth Access Token profile instead of form
    worker_id = request.form.get('worker_id')
    user = User.query.filter_by(worker_id=worker_id).first()
    
    if not user:
        # Auto-register new employees as a standalone, restricted NEW role
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
    promotes = Promote.query.order_by(Promote.promote_date.desc()).all()
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
    is_admin = (role == 'ADMIN')
    base_path = current_app.config['JENKINS_BASE_PATH']
    filename = f"{promote.load_module}.xml"
    
    try:
        # --- 1. QUAL NOMINATION: Success -> Ready for Qual Deployment ---
        if action == 'nominate_q0' and promote.job_status == 'Success':
            if role in ['DEV', 'ADMIN']:
                promote.job_status = 'Ready for Qual Deployment'
                
                # INTEGRATION: Notify Admin
                try:
                    EmailService.send_qual_nomination_to_admin(
                        promote.programmer, promote.ticket_no
                    )
                except Exception as e:
                    current_app.logger.warning(f"Email Service Failed: {str(e)}")
                    flash("Nomination saved, but notification email could not be sent to Admin.", "warning")
                
                flash(f'Nominated for QUAL Deployment: {promote.ticket_no} is now waiting for Admin execution.', 'info')
            else:
                flash('Only DEV/ADMIN can nominate for QUAL load.', 'danger')                
        # --- 3. QUAL LOAD: Ready for Qual Deployment -> UAT in Progress ---
        elif action == 'to_uat' and promote.job_status == 'Ready for Qual Deployment':
            if is_admin: # Admin action
                src = os.path.join(base_path, 'QUAL_LOAD', filename)
                dst = os.path.join(base_path, 'UAT', filename)
                if os.path.exists(src): shutil.move(src, dst)
                promote.job_status = 'UAT in Progress'
                
                # INTEGRATION: Notify QA and DEV
                try:
                    EmailService.send_qual_loaded_notification(promote.q0_approver, promote.programmer, promote.ticket_no)
                except Exception as e:
                    pass
                
                flash(f'Flight Loaded to QUAL (UAT) Successfully. QA and DEV notified.', 'success')
            else:
                flash('Only ADMIN can finalize QUAL load.', 'danger')
                
        # --- 4a. UAT FAILED: UAT in Progress -> UAT Failed ---
        elif action == 'uat_failed' and promote.job_status == 'UAT in Progress':
            if role in ['QA', 'ADMIN']:
                promote.job_status = 'UAT Failed'
                
                # INTEGRATION: Notify Admin and DEV
                try:
                    EmailService.send_uat_failed_alert("ADMIN", promote.programmer, promote.ticket_no)
                except Exception as e:
                    pass
                
                flash(f'Flight {promote.ticket_no} marked as UAT FAILED. Fallback required.', 'danger')
            else:
                flash('Only QA can mark UAT results.', 'danger')
                
        # --- 4b. PROD NOMINATION (UAT PASSED): UAT in Progress -> Awaiting Approval (PROD) ---
        elif action == 'nominate_a0' and promote.job_status == 'UAT in Progress':
            if role in ['QA', 'ADMIN']:
                promote.a0_nomination_date = request.form.get('a0_date')
                promote.a0_nomination_time = request.form.get('a0_time')
                promote.a0_approver = request.form.get('a0_approver')
                promote.job_status = 'Awaiting Approval (PROD)'
                
                # INTEGRATION: Notify Admin and Dev
                try:
                    EmailService.send_prod_nomination(
                        promote.a0_approver, promote.programmer, promote.ticket_no, promote.a0_nomination_date, promote.a0_nomination_time
                    )
                except Exception as e:
                    current_app.logger.warning(f"Email Service Failed: {str(e)}")
                    flash("PROD Nomination saved, but notification email failed.", "warning")
                
                flash(f'UAT PASSED! PROD Nomination Submitted: {promote.ticket_no} is Awaiting Approval from {promote.a0_approver}.', 'info')
            else:
                flash('Only QA can nominate for Production.', 'danger')
                
        # --- 5. PROD APPROVAL: Awaiting Approval (PROD) -> Ready for Production ---
        elif action == 'approve_a0' and promote.job_status == 'Awaiting Approval (PROD)':
            if is_admin:
                # TODO(Integration): ServiceNow REST call to /api/now/table/change_request
                # Expected Payload: { "short_description": "Release Module", "risk": "Low", ... }
                
                # For now, we return a mock PAC number for the specific module
                pac_no = "MOCK-PAC-ERROR"
                try:
                    pac_no = PACService.create_change_request(
                        promote.id, promote.ticket_no, promote.description, promote.programmer
                    )
                except Exception as e:
                    current_app.logger.error(f"ServiceNow Integration Failed: {str(e)}")
                    flash("Admin Approval recorded, but ServiceNow PAC could not be generated. Please create PAC manually.", "warning")
                
                promote.change_number = pac_no
                promote.job_status = 'Ready for Production'
                
                # INTEGRATION: Notify Developer of Approval
                try:
                    EmailService.send_approval_confirmation(promote.ticket_no, promote.programmer, pac_no)
                except:
                    pass
                
                # PHASE 3: Trigger the Automated Jenkins Mock Deployment!
                # We dynamically pass the port to ensure the webhook works in different dev envs
                api_port = current_app.config.get('SERVER_NAME', '3000').split(':')[-1] if current_app.config.get('SERVER_NAME') else '3000'
                JenkinsService.trigger_production_deploy(promote.id, promote.load_module, api_port)
                
                flash(f'PROD Load Approved! PAC {pac_no} referenced and deployment triggered.', 'success')
            else:
                flash('Only ADMIN can approve PROD nominations.', 'danger')
            
        # --- 6. PROD LOAD: Ready for Production -> Loaded To Production (A0) ---
        elif action == 'load_prod' and promote.job_status == 'Ready for Production':
            if is_admin:
                src = os.path.join(base_path, 'UAT', filename)
                dst = os.path.join(base_path, 'PROD_LOAD', filename)
                if os.path.exists(src): shutil.move(src, dst)
                promote.job_status = 'Loaded To Production (A0)'
                flash(f'Module {promote.load_module} LOADED TO PROD Successfully.', 'success')
            else:
                flash('Only ADMIN (or Jenkins Service) can finalize PROD load.', 'danger')
            
        # --- 7. CONSOLIDATE: Loaded -> Consolidated ---
        elif action == 'consolidate' and promote.job_status == 'Loaded To Production (A0)':
            if is_admin:
                # INTEGRATION: Close the PAC in ServiceNow
                if promote.change_number:
                    PACService.close_change_request(promote.change_number)
                
                src = os.path.join(base_path, 'PROD_FBK', filename)
                dst = os.path.join(base_path, 'CONSOLIDATED', filename)
                if not os.path.exists(src): 
                    os.makedirs(os.path.dirname(src), exist_ok=True)
                    with open(src, 'w') as f: f.write('<dummy/>')
                shutil.move(src, dst)
                promote.job_status = 'Consolidated To A2ZDAT'
                flash(f'Flight Data Archived and PAC Closed Successfully.', 'success')
            else:
                flash('Only ADMIN can consolidate flight data.', 'danger')
        
        # --- MOCK JENKINS SUCCESS (for TBC) ---
        elif action == 'to_success' and promote.job_status == 'TBC':
            if role in ['DEV', 'ADMIN']:
                promote.job_status = 'Success'
            else:
                flash('Only DEV/ADMIN can simulate build success.', 'danger')
                return redirect(url_for('main.promote_detail', id=promote.id))
            
        else:
            flash(f'Invalid flight sequence or unauthorized role: {promote.job_status} -> {action}', 'danger')
            return redirect(url_for('main.promote_detail', id=promote.id))
            
        db.session.commit()
        
    except Exception as e:
        flash(f'Jenkins/System Error: {str(e)}', 'danger')
        
    return redirect(url_for('main.promote_detail', id=promote.id))

# API for Jenkins Automation (Legacy Compatible)
@bp.route('/api/promote/<int:promote_id>/updjobstatus', methods=['PUT'])
def update_promote_status(promote_id):
    promote = Promote.query.get_or_404(promote_id)
    data = request.get_json()
    new_status = data.get('jobStatus')
    
    if new_status:
        promote.job_status = new_status
        # Handle file move if locations provided
        old_loc = data.get('oldLocation')
        new_loc = data.get('newLocation')
        if old_loc and new_loc and os.path.exists(old_loc):
            try:
                shutil.move(old_loc, new_loc)
            except Exception as e:
                return jsonify({"error": f"File Move Failed: {str(e)}"}), 500
        
        # Phase 3 Automation: If Jenkins reports "Loaded To Production (A0)", close the PAC!
        if new_status == 'Loaded To Production (A0)':
            if promote.change_number:
                PACService.close_change_request(promote.change_number)
            EmailService.send_module_loaded_notification(promote.ticket_no, promote.programmer, promote.load_module)
        
        db.session.commit()
        return jsonify({"message": f"Status updated to {new_status}"}), 200
    return jsonify({"error": "Missing status"}), 400

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

# === ADMIN ROUTES (Phase 1) ===

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
