from flask_mail import Message
from flask import current_app, render_template
from ..extensions import mail

class EmailService:
    @staticmethod
    def send_qual_nomination_to_admin(dev_name, promote_ticket):
        """Notifies Admin that a developer has pushed a module to Ready for QUAL Deployment."""
        subject = f"ACTION REQUIRED: Module {promote_ticket} Ready for QUAL Deployment"
        recipients = ["admin-mock@airnewzealand.co.nz"]
        
        msg = Message(subject, recipients=recipients)
        msg.body = f"""
        Kia Ora Admin Team,
        
        The developer {dev_name} has nominated Load Module {promote_ticket} for QUAL Deployment.
        
        The module is now sitting in the QUEUE and is Ready for Qual Deployment.
        
        Please log in to CARINA 2.0 to formally load this environment for UAT.
        
        Regards,
        CARINA Release Management System
        """
        try:
            if current_app.config.get('MAIL_SERVER') == 'localhost' and current_app.config.get('MAIL_PORT') == 1025:
                current_app.logger.info(f"[MOCK EMAIL SENT] To: Admin Team ({','.join(recipients)}) | Subject: {subject}")
            mail.send(msg)
            return True
        except Exception as e:
            current_app.logger.error(f"Failed to send qual nomination email to admin: {str(e)}")
            return False

    @staticmethod
    def send_approval_confirmation(promote_ticket, developer_name, pac_number=None):
        """Notifies the developer that their flight has been approved."""
        subject = f"APPROVED: Flight {promote_ticket} Flight Path Is Clear"
        recipient = "dev-mock@airnewzealand.co.nz"
        
        msg = Message(subject, recipients=[recipient])
        pac_info = f"ServiceNow PAC {pac_number} has been opened." if pac_number else ""
        
        msg.body = f"""
        Kia Ora {developer_name},
        
        Your flight path for {promote_ticket} has been officially approved for the next release window.
        
        {pac_info}
        
        The flight will proceed automatically via Jenkins once the release window opens.
        
        Regards,
        CARINA Release Management System
        """
        
        try:
            # Check if we are in testing/dev mode to avoid connection errors if no SMTP is running
            if current_app.config.get('MAIL_SERVER') == 'localhost' and current_app.config.get('MAIL_PORT') == 1025:
                current_app.logger.info(f"[MOCK EMAIL SENT] To: {developer_name} ({recipient}) | Subject: {subject}")
                # We still try to send; if a local mail server like MailHog isn't running, it fails gracefully
                
            mail.send(msg)
            return True
        except Exception as e:
            current_app.logger.error(f"Failed to send approval email: {str(e)}")
            return False

    @staticmethod
    def send_module_loaded_notification(promote_ticket, developer_name, load_module):
        """Notifies the developer that their module has successfully loaded to production."""
        subject = f"COMPLETED: MODULE LOADED TO PROD - {load_module}"
        recipient = "dev-mock@airnewzealand.co.nz"
        
        msg = Message(subject, recipients=[recipient])
        msg.body = f"""
        Kia Ora {developer_name},
        
        This is an automated notification from the Jenkins Deployment Engine.
        
        MODULE LOADED TO PROD Successfully:
        - Ticket: {promote_ticket}
        - Module: {load_module}
        
        Your flight path has been completed and the ServiceNow PAC will be automatically closed.
        
        Regards,
        CARINA Release Management System
        """
        
        try:
            if current_app.config.get('MAIL_SERVER') == 'localhost' and current_app.config.get('MAIL_PORT') == 1025:
                current_app.logger.info(f"[MOCK EMAIL SENT] To: {developer_name} ({recipient}) | Subject: {subject}")
                
            mail.send(msg)
            return True
        except Exception as e:
            current_app.logger.error(f"Failed to send loaded notification email: {str(e)}")
            return False

    @staticmethod
    def send_qual_loaded_notification(qa_name, dev_name, promote_ticket):
        """Notifies QA and Dev that Admin has loaded the module to QUAL."""
        subject = f"UAT READY: Flight {promote_ticket} Loaded to QUAL"
        recipients = ["qa-mock@airnewzealand.co.nz", "dev-mock@airnewzealand.co.nz"]
        
        msg = Message(subject, recipients=recipients)
        msg.body = f"""
        Kia Ora {qa_name} & {dev_name},
        
        Flight Path {promote_ticket} has been formally loaded into the QUAL environment by the Admin team.
        
        UAT is now in progress. QA can log into CARINA 2.0 to record the UAT result (Pass/Fail).
        
        Regards,
        CARINA Release Management System
        """
        try:
            if current_app.config.get('MAIL_SERVER') == 'localhost' and current_app.config.get('MAIL_PORT') == 1025:
                current_app.logger.info(f"[MOCK EMAIL SENT] To: {qa_name},{dev_name} ({','.join(recipients)}) | Subject: {subject}")
            mail.send(msg)
            return True
        except Exception as e:
            current_app.logger.error(f"Failed to send qual loaded email: {str(e)}")
            return False

    @staticmethod
    def send_uat_failed_alert(admin_name, dev_name, promote_ticket):
        """Notifies Admin and Dev that UAT has failed."""
        subject = f"URGENT: UAT FAILED for Flight {promote_ticket} (Fallback Required)"
        recipients = ["admin-mock@airnewzealand.co.nz", "dev-mock@airnewzealand.co.nz"]
        
        msg = Message(subject, recipients=recipients)
        msg.body = f"""
        Kia Ora {admin_name} & {dev_name},
        
        QA has marked Flight Path {promote_ticket} as UAT FAILED.
        
        A fallback procedure is required. Please coordinate to resolve the issue.
        
        Regards,
        CARINA Release Management System
        """
        try:
            if current_app.config.get('MAIL_SERVER') == 'localhost' and current_app.config.get('MAIL_PORT') == 1025:
                current_app.logger.info(f"[MOCK EMAIL SENT] To: {admin_name},{dev_name} ({','.join(recipients)}) | Subject: {subject}")
            mail.send(msg)
            return True
        except Exception as e:
            current_app.logger.error(f"Failed to send uat failed email: {str(e)}")
            return False

    @staticmethod
    def send_prod_nomination(admin_name, dev_name, promote_ticket, date, time):
        """Notifies Admin and Dev that UAT passed and PROD is nominated."""
        subject = f"ACTION REQUIRED: UAT Passed & PROD Nomination for {promote_ticket}"
        recipients = ["admin-mock@airnewzealand.co.nz", "dev-mock@airnewzealand.co.nz"]
        
        msg = Message(subject, recipients=recipients)
        msg.body = f"""
        Kia Ora {admin_name} & {dev_name},
        
        QA has marked Flight Path {promote_ticket} as UAT PASSED and submitted a PROD Nomination.
        
        Proposed Release: {date} @ {time}
        
        Admin action is required to officially approve this PROD window.
        
        Regards,
        CARINA Release Management System
        """
        try:
            if current_app.config.get('MAIL_SERVER') == 'localhost' and current_app.config.get('MAIL_PORT') == 1025:
                current_app.logger.info(f"[MOCK EMAIL SENT] To: {admin_name},{dev_name} ({','.join(recipients)}) | Subject: {subject}")
            mail.send(msg)
            return True
        except Exception as e:
            current_app.logger.error(f"Failed to send prod nomination email: {str(e)}")
            return False

