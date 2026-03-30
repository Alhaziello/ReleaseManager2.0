# Refactor Tasks

- [/] Create directory structure (`app/`, `app/static/`, `app/templates/`)
- [ ] Create `config.py` with environment-aware settings
- [ ] Refactor `app.py` into `app/__init__.py` using the Application Factory pattern
- [ ] Move and update `models.py` to `app/models.py`
- [ ] Move and update `routes.py` to `app/routes.py`
- [ ] Move all templates to `app/templates/`
- [ ] Create `run.py` as the new entry point
- [ ] Update `seed.py` to point to the new package structure
- [ ] Add `flask-migrate` and initialize migrations for production DB stability
- [ ] Clean up redundant root files (`app.py`, `models.py`, `routes.py`)
- [ ] Verify functionality via `python run.py`
