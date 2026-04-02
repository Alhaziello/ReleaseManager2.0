import os
import shutil
from flask import request, jsonify, current_app
from . import bp
from ..models import db, Promote, Serrc
from ..services.email_service import EmailService
from ..services.pac_service import PACService

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

@bp.route('/api/chunk/serrc', methods=['POST'])
def add_multiple_serrc():
    data = request.get_json()
    if not data or not isinstance(data, list):
        return jsonify({"error": "Expected a list of serrc objects"}), 400
        
    added = 0
    for item in data:
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
