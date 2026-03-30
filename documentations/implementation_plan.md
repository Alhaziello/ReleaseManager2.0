# Refactor to Production-Ready Flask Structure

## Goal
Transition from a flat-file structure to a modular, package-based application using the **Application Factory pattern**. This improves maintainability, testing, and production deployment stability.

## User Review Required
> [!IMPORTANT]
> This refactor will move almost all functional files. I will need to stop the current `python app.py` and start using `python run.py`. 

## Proposed Changes

### 1. New Directory Structure
I will create a root `app/` package to house the core logic:
```
/ (root)
├── app/
│   ├── __init__.py      # Flask Application Factory
│   ├── models.py        # Database Models
│   ├── routes.py        # Blueprints & Routes
│   ├── static/          # CSS, JS, and Mock listings
│   └── templates/       # Jinja2 Templates
├── config.py            # Configuration Classes (Dev/Prod)
├── run.py               # Entry point for development
├── requirements.txt     # Updated dependencies
└── .env                 # Environment variables (Secrets/Paths)
```

### 2. [NEW] [config.py](file:///Users/antoniobartone/CARINArm/carinarm-master@68aab8c5289/config.py)
Move all hardcoded configurations (SQLAlchemy URI, Secret Key, Jenkins Base Path) into a centralized `Config` class.

### 3. [MODIFY] [app.py](file:///Users/antoniobartone/CARINArm/carinarm-master@68aab8c5289/app.py) -> [app/__init__.py](file:///Users/antoniobartone/CARINArm/carinarm-master@68aab8c5289/app/__init__.py)
Refactor `create_app()` to use the new `Config` class and relative imports for blueprints and database initialization.

### 4. [MODIFY] [routes.py](file:///Users/antoniobartone/CARINArm/carinarm-master@68aab8c5289/routes.py) & [models.py](file:///Users/antoniobartone/CARINArm/carinarm-master@68aab8c5289/models.py)
Update imports to use the package structure (e.g., `from .models import db` instead of `from models import db`).

### 5. [NEW] [run.py](file:///Users/antoniobartone/CARINArm/carinarm-master@68aab8c5289/run.py)
A thin wrapper to boot the app:
```python
from app import create_app
app = create_app()
if __name__ == "__main__":
    app.run(debug=True, port=3000)
```

## Open Questions
- Do you want me to include **Flask-Migrate** now for handling database schema changes in production?

## Verification Plan
### Automated Tests
- Run `python run.py` and verify all routes (`/`, `/promotes`, `/serrcs`) load correctly.
- Verify that Role Switching and Advance Actions still function by performing a mock UAT Pass.

### Manual Verification
- I will use the browser tool to confirm the UI still renders perfectly after files move.
