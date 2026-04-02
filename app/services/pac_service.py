from flask import current_app
import random

class PACService:
    @staticmethod
    def create_change_request(promote_id, ticket_no, description, programmer):
        """
        Interacts with the ServiceNow Change Management API to open a new PAC (Change Request).
        One unique PAC is created for every promoted flight module.
        """
        
        # TODO(ServiceNow Integration): Actual REST call to /api/now/table/change_request
        # For now, we return a mock PAC number for the specific module
        pac_number = f"CHG-{random.randint(10000, 99999)}"
        
        current_app.logger.info(f"[SERVICENOW PAC CREATED] PAC: {pac_number} | Ticket: {ticket_no} | Module: {promote_id}")
        
        # Integration Detail: We would send the following metadata to ServiceNow
        # {
        #   "short_description": f"Release Module: {ticket_no}",
        #   "description": f"Automated Release from CARINA 2.0. Developer: {programmer}. Reason: {description}",
        #   "justification": "Weekly Scheduled Production Landing",
        #   "risk": "Low",
        #   "type": "Normal"
        # }
        
        return pac_number

    @staticmethod
    def update_change_request(pac_number, state):
        """
        Updates the state of an existing PAC in ServiceNow (e.g. Approved, Implemented, Closed).
        """
        
        # TODO(ServiceNow Integration): Actual REST call to update record state
        current_app.logger.info(f"[SERVICENOW PAC UPDATED] PAC: {pac_number} | New State: {state}")
        
        return True

    @staticmethod
    def close_change_request(pac_number):
        """
        Closes the PAC in ServiceNow once the module has successfully landed in Production.
        """
        
        # TODO(ServiceNow Integration): Actual REST call to close the record
        current_app.logger.info(f"[SERVICENOW PAC CLOSED] PAC: {pac_number}")
        
        return True
