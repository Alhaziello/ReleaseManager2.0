# Release Manager 2.0 (CARINA)

A powerful, Flask-based web application for managing releases and tracking deployments.

## Features
- **Release Tracking**: Manage and monitor ongoing software releases.
- **Mock Jenkins Integration**: Includes a mock Jenkins service for testing CI/CD workflows.
- **Database Support**: Built-in SQLite database support with migration capabilities.
- **User Dashboard**: Modern interface for visualizing release status.

## Getting Started

### Prerequisites
- Python 3.8+ (Python 3.13 recommended)
- [Git](https://git-scm.com/)

---

### Installation & Setup

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/Alhaziello/ReleaseManager2.0.git
    cd ReleaseManager2.0
    ```

2.  **Create a Virtual Environment**:
    A virtual environment ensures your project dependencies don't interfere with your system Python.
    ```bash
    python3 -m venv venv
    ```

3.  **Activate the Environment**:
    - **macOS / Linux**:
      ```bash
      source venv/bin/activate
      ```
    - **Windows**:
      ```bash
      venv\Scripts\activate
      ```

4.  **Install Dependencies**:
    ```bash
    python3 -m pip install -r requirements.txt
    ```

5.  **Seed the Database & Mock Users**:
    Running the seeder clears the database and populates it with 30 mock ticket promotions and the essential Mock SSO Users required for log in:
    ```bash
    python3 seed.py
    ```
    
    > **Testing Accounts**
    > You must use one of these worker IDs to log into the application:
    > - `AIRNZ-NZ\ADMIN1` (Grants ADMIN role)
    > - `AIRNZ-NZ\QA1` (Grants QA role)
    > - `AIRNZ-NZ\DEV1` (Grants DEV role)

---

### Running the Application

To start the development server, ensure your virtual environment is active and run:
```bash
python3 run.py
```
> [!TIP]
> The app will be available at [http://localhost:3000](http://localhost:3000)

---

## Troubleshooting

### "Externally Managed Environment" Error
If you see this error while installing packages, it means you're trying to install into your system Python. **Ensure you have activated your virtual environment** (`source venv/bin/activate`) before running the install command.

### "AssertionError" on Python 3.13
This is caused by an outdated version of SQLAlchemy. We have updated `requirements.txt` to use SQLAlchemy>=2.0.35, which fixes this issue for Python 3.13.

---

## Project Structure
- `app/`: Core application logic (Flask).
- `mock_jenkins/`: Mock CI/CD integration tools.
- `documentations/`: Project guidelines and architecture.
- `legacy/`: Historical codebase.
- `config.py`: Application settings.

---
Built with ❤️ by Antonio Bartone
