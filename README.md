# Release Manager 2.0 (CARINA)

A powerful, Flask-based web application for managing releases and tracking deployments.

## Features
- **Release Tracking**: Manage and monitor ongoing software releases.
- **Mock Jenkins Integration**: Includes a mock Jenkins service for testing CI/CD workflows.
- **Database Support**: Built-in SQLite database support with migration capabilities.
- **User Dashboard**: Modern interface for visualizing release status.

## Getting Started

### Prerequisites
- Python 3.8+
- [Git](https://git-scm.com/)

### Installation

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/Alhaziello/ReleaseManager2.0.git
    cd ReleaseManager2.0
    ```

2.  **Create a Virtual Environment**:
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Seed the Database** (Optional):
    ```bash
    python seed.py
    ```

### Running the Application
To start the development server:
```bash
python run.py
```
The app will be available at `http://localhost:3000`.

## Project Structure
- `app/`: Main Flask application folder.
- `mock_jenkins/`: Mock service for role-playing CI/CD scenarios.
- `documentations/`: Detailed project documentation.
- `legacy/`: Historical codebase for reference.
- `config.py`: Application configurations.

---
Built with ❤️ by Antonio Bartone
