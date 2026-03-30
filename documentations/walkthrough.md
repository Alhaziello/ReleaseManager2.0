# Modernization Walkthrough: CarinaRM

We have successfully overhauled the architecture of the **CarinaRM** application, moving it away from the old MERN/MEAN stack into a significantly simpler and more robust Python-based application using Flask and SQLite.

## What Did We Change?

### 1. Legacy Code Archived
The original NodeJS backend code, Mongoose schema models, and AngularJS frontend code have been cleanly tucked away inside the `/legacy` folder for your reference. This ensures the root folder is perfectly clean for the new Flask backend!

### 1. Architecture & Framework
The modernized system is a **Flask Web Application** using the **Application Factory** pattern for production reliability.
- `app/`: The core package containing `models.py`, `routes.py`, `static/`, and `templates/`.
- `config.py`: Centralized configuration handling (Database URLs, Secret Keys, Jenkins Paths).
- `run.py`: The entry point for starting the application.
- `carina.db`: A local SQLite database (used in development, easily swapped for Postgres/SQL Server in production via `config.py`).
- `requirements.txt`: Manages all Python dependencies (Flask, SQLAlchemy, WTForms, Flask-Migrate).

### 2. Relational Database Migration
We have migrated the original MongoDB schemas into a robust **SQLAlchemy Relational Model**.
- Data is normalized into linked tables (`Promote`, `PromoteMacro`, `PromoteProgram`).
- This allows for much faster querying of sub-modules and better data integrity than the original flat-file approach.
- **Flask-Migrate** is now included to handle future schema evolutions safely. We have custom-built three main pages located in the `templates/` directory:
- `index.html`: An entry dashboard summarizing CarinaRM functionality.
- `promotes.html`: A master table listing active promotes, heavily customized to mirror the exact columns requested (Date, ADO Ref, Programmer, Jenkins ID, Load Module, Status, and a link to Details). 
- `promote_detail.html`: A comprehensive, meticulously mapped Details page displaying deep meta-data (Macro Promotes, Programs, Testing Names, Fallback notes, and Carina Systems Use variables) using sleek Bootstrap Cards. This page replaces the raw legacy `PromoteSheet.html`.
- `serrcs.html`: A system log table for Serrcs with robust ticket creation capabilities.

### 3. Server Architecture setup 
- `app.py` serves as the core orchestration file linking everything together.
- `routes.py` manages all the URLs. The `/api/chunk/serrc` has effectively been migrated perfectly over, accepting identical JSON data lists and efficiently uploading them to the SQLite database.

### 4. Application UI (Modern Overhaul)
The new Frontend is powered by **Jinja2 Templates** matched with the **Bootstrap 5** framework to give a modern, robust interface out-of-the-box. We have custom-built three main pages located in the `templates/` directory:
- `index.html`: An entry dashboard summarizing CarinaRM functionality.
- `promotes.html`: A master table listing active promotes, heavily customized to mirror the exact columns requested (Date, ADO Ref, Programmer, Jenkins ID, Load Module, Status, and a link to Details). 
- `promote_detail.html`: A comprehensive, meticulously mapped Details page displaying deep meta-data (Macro Promotes, Programs, Testing Names, Fallback notes, and Carina Systems Use variables) using sleek Bootstrap Cards. This page replaces the raw legacy `PromoteSheet.html`.
- `serrcs.html`: A system log table for Serrcs with robust ticket creation capabilities.

---

## NEW: User Logic & Legacy Jenkins Sync
We have introduced a fast, rapid-development user management framework and successfully replicated the old Windows Server Jenkins file-shuffling mechanics using a mock local directory setup.

### 1. The Role Dropdown
Inside the navigation bar at the top right, you will see a dropdown allowing you to seamlessly switch between **DEV**, **QA**, and **ADMIN** roles. This role is saved directly into the Flask session.

### 2. Formatted Jenkins Shuffling
The backend now correctly manipulates the "Promote" pipeline by recreating the exact XML file movements previously seen on the Windows Server:
1. **DEV**: Creates a ticket (State: `TBC`). Opens the "Details" page. Clicks "Loaded to QUAL for UAT". The `{ticket_no}_module.xml` file is automatically moved from `QUAL_LOAD` to the `UAT` folder.
2. **QA**: Navigates to the Details page. Clicks "UAT Passed". The file is instantly shifted from the `UAT` folder into `PROD_LOAD`. 
3. **ADMIN**: Orchestrates the final load. Navigates to the details page, clicking "Load PROD" to move the state to A0, and then "Consolidate" which shifts the file perfectly into the final `CONSOLIDATED` folder.

All of these actions mirror the legacy functionality 1:1, meaning pointing this new Flask Application at your Windows Drive will let it resume its orchestrator role without disrupting your pipelines!

## How to use it?

1. Ensure the Python environment is activated: `source venv/bin/activate`
2. Start the server using: `python app.py`
3. Hit `http://127.0.0.1:3000/` in your browser.

> [!TIP]
> From here, you should add the new models, database, and backend routes to your normal Git tracking and ignore the `legacy` folder using `.gitignore` so your environment remains clean downstream!
