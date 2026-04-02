# CARINA Release Manager 2.0 - System Architecture & Workflow

This document outlines the target enterprise architecture, the planned integrations, and the full approval workflow for the Release Manager application based on the transition from the legacy application.

## 1. System Components & Modular Services

The system is transitioning from a monolithic setup to a multi-service orchestration paradigm.

- **Frontend (UI)**: Built with Flask Templates, leveraging "Air New Zealand" style themes (Teal/Dark Purple). Pages include Dashboard, SERRCs List, Promotes List, and specific Flight Path view.
- **Backend (Restful API)**: Drives the workflow, updates the state machine, and orchestrates file transfers and simulated deployments.
- **Database**: Currently SQLite for rapid development. Contains `Serrc` and `Promote` Collections.
- **Authentication Service**: Handled via local active role switching (simulating ServiceNow OAuth / AD mappings).
- **PAC Service (`pac_service.py`)**: Integrates with ServiceNow to Auto-Generate/Close Change Requests (PACs). Currently operating in Mock-Logging mode.
- **Email Service (`email_service.py`)**: Dispatches branded notices to Approvers and Developers. Currently operating in Mock-Logging mode.
- **Jenkins Service (`jenkins_service.py`)**: A local deployment simulator that handles the physical movement of binary module files across directories and fires webhooks upon completion.

## 2. Authentication Flow (Simulated Enterprise Identity)

To ensure enterprise security, the system does not utilize standard self-registration.
Instead, we rely on Identity Provider mapping to AirNZ network credentials.

1. **Login Trigger**: Employee enters "AirNZ LAN ID".
2. **Session Construction**: The Worker ID is verified against the database. The app checks local `users` mappings to determine if the Worker ID holds an `ADMIN`, `QA`, or `DEV` role.
3. **Current State (Mock)**: The system relies on seeded mock users.

### Seeded Development Accounts:
Make sure to seed the database (`python3 seed.py`).
- **`AIRNZ-NZ\ADMIN1`**: Granted full `ADMIN` rights for moving flights through QUAL/PROD/CONSOLIDATED stages.
- **`AIRNZ-NZ\QA1`**: Granted `QA` rights for approving UAT Flight Clearances.
- **`AIRNZ-NZ\DEV1`**: Granted standard `DEV` rights.

## 3. The Enterprise Deployment Workflow (Phase 3 Completed)

We enforce a strict 7-Step Enterprise Governance deployment workflow, completely removing legacy shortcuts. It relies heavily on Jenkins for automated execution, while the CARINA system tracks the state and facilitates the approvals.

| State | Primary Actor | Action Required | Next State -> |
|-------|---------------|-----------------|--------------|
| **1. TBC** | *Dev* | Push macro/program code via ADO | **Success** |
| **2. Success / QUAL Nomination** | *Dev* | Nominate QUAL load Date/Time | **Awaiting Approval (QUAL)** |
| **3. Awaiting Approval (QUAL)** | *Admin* | Approve QUAL Load | **Ready for Qual Deployment** |
| **4. Ready for Qual Deployment** | *Admin/Sys* | Simulate QUAL Landing | **UAT in Progress** |
| **5. UAT in Progress (PROD Nomination)** | *QA / Admin* | UAT Passed + Nominate PROD (A0) Date/Time | **Awaiting Approval (PROD)** |
| **6. Awaiting Approval (PROD)** | *Admin* | Approve PROD Load (Auto-triggers ServiceNow PAC & Jenkins deployment) | **Ready for Production (Deploying)** |
| **7. Loaded To Production (A0)** | *Jenkins System* | Webhook fired, PAC auto-closed. Admin clicks "Consolidate" | **Consolidated To A2ZDAT** |

> *Note on Automation*: In production, transitions into `Loaded To Production (A0)` are physically moved by Jenkins pulling the files into the respective folders. Our new `JenkinsService` simulates this via a background thread, physically migrating the files locally and auto-hitting the `/api/promote/<id>/updjobstatus` Webhook to close the ServiceNow ticket.
