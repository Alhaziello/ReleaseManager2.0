# CarinaRM Modernization Summary & Roadmap

We have successfully migrated the legacy **MEAN stack** (MongoDB, Express, AngularJS, NodeJS) to a high-performance **Python/Flask** architecture. The system is now structured for production stability and maintains 1:1 parity with the legacy Jenkins-based file shuffling pipeline, while adding strict Enterprise-Grade Governance controls.

## 🏗️ Architectural Overhaul
- **Application Factory Pattern**: The app is now a Python package (`app/`) using `Config` classes. Centralized extensions (`extensions.py`) eliminate circular dependency issues.
- **Relational Data Model**: Migrated MongoDB sub-documents into normalized SQL tables (`Promote`, `PromoteProgram`, `Serrc`).
- **Modern UI**: Replaced AngularJS with **Jinja2** and **Bootstrap 5**, meticulously restyled to match the original "Carina Red" aesthetic.

## 🛡️ Enterprise Governance & Integrations
We have retired the legacy "One-Click" shortcuts in favor of strict multi-stage authorizations dictated by target schemas:
- **Formal UAT/PROD Separation**: QAs must authorize UAT, and Admins must formally approve the Production (A0) landing windows.
- **ServiceNow PAC API Engine**: `app/services/pac_service.py` is capable of dynamically opening and closing formal Change Requests for every module load.
- **Email Notifications Engine**: `app/services/email_service.py` broadcasts branded `[MODULE LOADED TO PROD]` warnings via Flask-Mail to AD-lookup employees.

## 🔄 The Jenkins Simulator Engine (`mock_jenkins`)
To safely develop without a real CI/CD pipe, we built a fully autonomous Python-based Jenkins Simulator (`app/services/jenkins_service.py`):
- **Automatic File Shunts**: When an Admin clicks "Approve PROD", a background thread spins up, waits 5 seconds, and physically migrates `.xml` module files between the local `mock_jenkins/UAT` and `PROD_LOAD` folders.
- **Automated Webhooks**: Upon physical file movement, the Simulator fires an HTTP PUT request to the app's native webhook (`/api/promote/<id>/updjobstatus`).
- **Autopilot Archiving**: The webhook intelligently auto-closes the ServiceNow PAC and signals the app to flip the status to `Loaded To Production`.

## 🔗 Enterprise Integration Health Check (To-Do List)
The app is currently in a "Simulated" mode using a local SQLite database, mock login routes, and mock Jenkins folders. To connect it to the real AirNZ Windows/Linux infrastructure, the following integrations must be implemented:

### 1. Authentication & Active Directory (Identity)
Currently, users select their role from a mock dropdown form. To secure the app:
- [ ] **Implementation:** Install `Authlib` and configure OAuth 2.0 / OpenID Connect.
- [ ] **Endpoint Swap:** Destroy `app/templates/mock_login.html`. The `/login` route must immediately redirect to the AirNZ IDP (ServiceNow OAuth or Azure ADFS).
- [ ] **Data Extraction:** Extract the user's `worker_id`, Name, and AD Groups from the decoded JWT rather than assigning them locally.

### 2. ServiceNow (PAC Management API)
Currently, `app/services/pac_service.py` simply logs debug strings and returns artificial PAC numbers.
- [ ] **Auth Token:** Configure a dedicated Service Account OAuth token for the Flask backend to authenticate with ServiceNow.
- [ ] **REST Calls:** Replace the mock outputs with actual `requests.post()` and `requests.put()` payloads pointing at the ServiceNow `/api/now/table/change_request` endpoint.
- [ ] **Error Handling:** Build robust retry/fallback logic if ServiceNow APIs time out during a deployment window.

### 3. Communication (SMTP Relay)
Currently, `EmailService` relies on intercepting exceptions and printing `[MOCK EMAIL SENT]` dummy addresses to the console.
- [ ] **SMTP Configuration:** Update `config.py` to point to the live corporate Exchange/SMTP Relay server instead of `localhost:1025`.
- [ ] **AD Lookup:** Integrate an Active Directory search function to look up the true email addresses for the Admin/QA distribution lists rather than hardcoding.
- [ ] **HTML Branding:** Upgrade the plain-text `.body` strings to heavily branded `msg.html` templates.

### 4. Jenkins & Source Control (Deployment Execution)
Currently, `JenkinsService` fakes the deployment by physically shuffling mock `.xml` files and hitting its own webhooks locally.
- [ ] **Jenkins Outbound:** Rework `JenkinsService` to fire a POST request to your real Jenkins server (e.g., triggering a `Job/CARINA-Deploy`).
- [ ] **Git-Blit Connection:** Connect to Git-Blit/GitLab to pull the actual load module metadata instead of artificially generating XML files upon 'Success'.
- [ ] **Webhook Security:** Secure the `/api/promote` webhook endpoint so only the true Jenkins server is authorized to report successful test/load resolutions back to the web portal.
