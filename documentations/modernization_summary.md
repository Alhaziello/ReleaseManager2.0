# CarinaRM Modernization Summary & Roadmap

We have successfully migrated the legacy **MEAN stack** (MongoDB, Express, AngularJS, NodeJS) to a high-performance **Python/Flask** architecture. The system is now structured for production stability and maintains 1:1 parity with the legacy Jenkins-based file shuffling pipeline.

## 🏗️ Architectural Overhaul
- **Application Factory Pattern**: The app is now a Python package (`app/`) using `Config` classes. This separates development from production environments easily.
- **Relational Data Model**: Migrated MongoDB sub-documents into normalized SQL tables (`Promote`, `PromoteMacro`, `PromoteProgram`).
- **Modern UI**: Replaced AngularJS with **Jinja2** and **Bootstrap 5**, meticulously restyled to match the original "Carina Red" aesthetic.

## 🔄 Legacy Pipeline Preservation
The "Heart" of CarinaRM was its ability to orchestrate Jenkins by moving files on a Windows network drive. We have preserved this exactly:
- **Automatic File Shunts**: When you click "UAT Passed" or "Consolidated" in the UI, the backend uses `shutil.move` to shift `.xml` modules between the `QUAL_LOAD`, `UAT`, `PROD_LOAD`, and `CONSOLIDATED` folders.
- **Configurable Paths**: The `JENKINS_BASE_PATH` in `config.py` can be pointed to any network drive (e.g., `E:\\JENKINS\\...`) without code changes.

## 🔗 Readiness for Connection
The app is currently in a "Simulated" mode using a local SQLite database and mock Jenkins folders. To connect it to the real Windows environment, you only need to:
1. Update `SQLALCHEMY_DATABASE_URI` in `config.py` to point to your Production SQL Server/Postgres.
2. Update `JENKINS_BASE_PATH` to the actual Windows network mount.
3. Deploy behind a WSGI server like **Waitress** (Windows) or **Gunicorn** (Linux).

---

## 📋 Requirements for Final Connection
Based on a final audit of the legacy `routes.js`, here are the remaining "Touch Points" that need attention before a full switch-over:

### 1. Missing Field Update Endpoints
The legacy system had several individual REST endpoints for updating specific ticket fields. While we support these via the main UI, an external tool calling these APIs would need:
- `[ ]` `PUT /api/promote/<id>/updldate`: Update Load Date.
- `[ ]` `PUT /api/promote/<id>/updnote`: Update Promote Note.
- `[ ]` `PUT /api/promote/<id>/updcdate`: Update Consolidated Date.
- `[ ]` `PUT /api/promote/<id>/updcmod`: Update Consolidated Module name.
- `[ ]` `PUT /api/promote/<id>/updcnum`: Update Service Now Change Number.
- `[ ]` `PUT /api/promote/<id>/updsplrequirement`: Update Special Requirements text.

### 2. Authentication Bridge
- `[ ]` **Windows SSPI/NTLM**: The legacy app used `node-sspi` to automatically grab the Windows username (`req.connection.user`). 
    - *Modern approach*: If you deploy on Windows with IIS, you can pass the headers to Flask. For now, we use the manual **Role Switcher** in the navbar.

### 3. File Assets
- `[ ]` **Program Listings**: The "Program Listing" column in the details view expects `.html` files in `/static/listing/<jenkins_job_id>/`. You will need to migrate the historical listing archives into the new `app/static/listing` folder.

### 4. Git Integration
- `[ ]` **Source Code Viewer**: The links now point to `git.airnz.co.nz`. Ensure the production server has network access to the Git-Blit / GitLab instance to render source code from the `git_sha` stored in the database.
