import os
import shutil
from flask import current_app

from .email_service import EmailService
from .pac_service import PACService
from .jenkins_service import JenkinsService

class PromoteService:
    @staticmethod
    def _handle_nominate_q0(promote, role, data):
        if promote.job_status != 'Success':
            raise ValueError(f"Invalid state for nominate_q0: {promote.job_status}")
        if role not in ['DEV', 'ADMIN']:
            raise PermissionError('Only DEV/ADMIN can nominate for QUAL load.')
            
        promote.job_status = 'Ready for Qual Deployment'
        try:
            EmailService.send_qual_nomination_to_admin(promote.programmer, promote.ticket_no)
        except Exception as e:
            current_app.logger.warning(f"Email Service Failed: {str(e)}")
            return 'warning', "Nomination saved, but notification email could not be sent to Admin."
            
        return 'info', f'Nominated for QUAL Deployment: {promote.ticket_no} is now waiting for Admin execution.'

    @staticmethod
    def _handle_to_uat(promote, role, data):
        if promote.job_status != 'Ready for Qual Deployment':
            raise ValueError(f"Invalid state for to_uat: {promote.job_status}")
        if role != 'ADMIN':
            raise PermissionError('Only ADMIN can finalize QUAL load.')
            
        base_path = current_app.config['JENKINS_BASE_PATH']
        filename = f"{promote.load_module}.xml"
        src = os.path.join(base_path, 'QUAL_LOAD', filename)
        dst = os.path.join(base_path, 'UAT', filename)
        if os.path.exists(src):
            shutil.move(src, dst)
            
        promote.job_status = 'UAT in Progress'
        try:
            EmailService.send_qual_loaded_notification(promote.q0_approver, promote.programmer, promote.ticket_no)
        except Exception:
            pass
            
        return 'success', f'Flight Loaded to QUAL (UAT) Successfully. QA and DEV notified.'

    @staticmethod
    def _handle_uat_failed(promote, role, data):
        if promote.job_status != 'UAT in Progress':
            raise ValueError(f"Invalid state for uat_failed: {promote.job_status}")
        if role not in ['QA', 'ADMIN']:
            raise PermissionError('Only QA can mark UAT results.')
            
        promote.job_status = 'UAT Failed'
        try:
            EmailService.send_uat_failed_alert("ADMIN", promote.programmer, promote.ticket_no)
        except Exception:
            pass
            
        return 'danger', f'Flight {promote.ticket_no} marked as UAT FAILED. Fallback required.'

    @staticmethod
    def _handle_nominate_a0(promote, role, data):
        if promote.job_status != 'UAT in Progress':
            raise ValueError(f"Invalid state for nominate_a0: {promote.job_status}")
        if role not in ['QA', 'ADMIN']:
            raise PermissionError('Only QA can nominate for Production.')
            
        promote.a0_nomination_date = data.get('a0_date')
        promote.a0_nomination_time = data.get('a0_time')
        promote.a0_approver = data.get('a0_approver')
        promote.job_status = 'Awaiting Approval (PROD)'
        try:
            EmailService.send_prod_nomination(
                promote.a0_approver, promote.programmer, promote.ticket_no, promote.a0_nomination_date, promote.a0_nomination_time
            )
        except Exception as e:
            current_app.logger.warning(f"Email Service Failed: {str(e)}")
            return 'warning', "PROD Nomination saved, but notification email failed."
            
        return 'info', f'UAT PASSED! PROD Nomination Submitted: {promote.ticket_no} is Awaiting Approval from {promote.a0_approver}.'

    @staticmethod
    def _handle_approve_a0(promote, role, data):
        if promote.job_status != 'Awaiting Approval (PROD)':
            raise ValueError(f"Invalid state for approve_a0: {promote.job_status}")
        if role != 'ADMIN':
            raise PermissionError('Only ADMIN can approve PROD nominations.')
            
        pac_no = "MOCK-PAC-ERROR"
        warning_msg = None
        try:
            pac_no = PACService.create_change_request(
                promote.id, promote.ticket_no, promote.description, promote.programmer
            )
        except Exception as e:
            current_app.logger.error(f"ServiceNow Integration Failed: {str(e)}")
            warning_msg = "Admin Approval recorded, but ServiceNow PAC could not be generated. Please create PAC manually."
            
        promote.change_number = pac_no
        promote.job_status = 'Ready for Production'
        try:
            EmailService.send_approval_confirmation(promote.ticket_no, promote.programmer, pac_no)
        except Exception:
            pass
            
        api_port = current_app.config.get('SERVER_NAME', '3000')
        if api_port:
            api_port = api_port.split(':')[-1]
        else:
            api_port = '3000'
            
        JenkinsService.trigger_production_deploy(promote.id, promote.load_module, api_port)
        
        if warning_msg:
            return 'warning', warning_msg
        return 'success', f'PROD Load Approved! PAC {pac_no} referenced and deployment triggered.'

    @staticmethod
    def _handle_load_prod(promote, role, data):
        if promote.job_status != 'Ready for Production':
            raise ValueError(f"Invalid state for load_prod: {promote.job_status}")
        if role != 'ADMIN':
            raise PermissionError('Only ADMIN (or Jenkins Service) can finalize PROD load.')
            
        base_path = current_app.config['JENKINS_BASE_PATH']
        filename = f"{promote.load_module}.xml"
        src = os.path.join(base_path, 'UAT', filename)
        dst = os.path.join(base_path, 'PROD_LOAD', filename)
        if os.path.exists(src):
            shutil.move(src, dst)
            
        promote.job_status = 'Loaded To Production (A0)'
        return 'success', f'Module {promote.load_module} LOADED TO PROD Successfully.'

    @staticmethod
    def _handle_consolidate(promote, role, data):
        if promote.job_status != 'Loaded To Production (A0)':
            raise ValueError(f"Invalid state for consolidate: {promote.job_status}")
        if role != 'ADMIN':
            raise PermissionError('Only ADMIN can consolidate flight data.')
            
        if promote.change_number:
            PACService.close_change_request(promote.change_number)
            
        base_path = current_app.config['JENKINS_BASE_PATH']
        filename = f"{promote.load_module}.xml"
        src = os.path.join(base_path, 'PROD_FBK', filename)
        dst = os.path.join(base_path, 'CONSOLIDATED', filename)
        
        if not os.path.exists(src):
            os.makedirs(os.path.dirname(src), exist_ok=True)
            with open(src, 'w') as f:
                f.write('<dummy/>')
        
        shutil.move(src, dst)
        promote.job_status = 'Consolidated To A2ZDAT'
        return 'success', f'Flight Data Archived and PAC Closed Successfully.'

    @staticmethod
    def _handle_to_success(promote, role, data):
        if promote.job_status != 'TBC':
            raise ValueError(f"Invalid state for to_success: {promote.job_status}")
        if role not in ['DEV', 'ADMIN']:
            raise PermissionError('Only DEV/ADMIN can simulate build success.')
            
        promote.job_status = 'Success'
        return None, None

    _actions = {
        'nominate_q0': _handle_nominate_q0,
        'to_uat': _handle_to_uat,
        'uat_failed': _handle_uat_failed,
        'nominate_a0': _handle_nominate_a0,
        'approve_a0': _handle_approve_a0,
        'load_prod': _handle_load_prod,
        'consolidate': _handle_consolidate,
        'to_success': _handle_to_success
    }

    @classmethod
    def execute(cls, promote, action, role, data):
        handler = cls._actions.get(action)
        if not handler:
            raise ValueError(f"Invalid action requested: {action}")
        return handler(promote, role, data)

    @staticmethod
    def create_promote(data):
        from ..models import db, Promote, PromoteProgram
        ticket_no = data.get('ticket_no')
        programmer = data.get('programmer')
        description = data.get('description')
        program_name = data.get('program_name')
        
        if not ticket_no:
            raise ValueError("Ticket number is required.")
            
        new_promote = Promote(ticket_no=ticket_no, programmer=programmer, description=description, job_status="TBC")
        new_promote.load_module = f"{ticket_no}_module"
        
        db.session.add(new_promote)
        db.session.flush()
        
        qual_load_path = os.path.join(current_app.config['JENKINS_BASE_PATH'], 'QUAL_LOAD')
        os.makedirs(qual_load_path, exist_ok=True)
        with open(os.path.join(qual_load_path, f"{new_promote.load_module}.xml"), 'w') as f:
            f.write("<dummy>This is a Jenkins payload</dummy>")
        
        if program_name:
            new_prog = PromoteProgram(promote_id=new_promote.id, program=program_name)
            db.session.add(new_prog)
            
        return new_promote

    @staticmethod
    def delete_promote(promote_id, role):
        from ..models import db, Promote
        if role != 'ADMIN':
            raise PermissionError('Unauthorized')
            
        promote = Promote.query.get_or_404(promote_id)
        db.session.delete(promote)
        return promote
