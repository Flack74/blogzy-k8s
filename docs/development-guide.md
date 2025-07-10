# Blogzy Development Guide

This guide provides instructions for setting up a development environment and contributing to the Blogzy project.

## Development Environment Setup

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ and npm
- Python 3.11+
- Git

### Clone the Repository

```bash
git clone https://github.com/yourusername/blogzy-k8s.git
cd blogzy-k8s
```

### Local Development with Docker Compose

The easiest way to get started is using Docker Compose, which sets up all the required services:

```bash
docker-compose up -d
```

This will start:
- Frontend on http://localhost:12000
- Backend API on http://localhost:5000
- PostgreSQL database

### Running Frontend and Backend Separately

#### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   export FLASK_APP=app
   export FLASK_ENV=development
   export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/blogzy
   ```

5. Run database migrations:
   ```bash
   flask db upgrade
   ```

6. Run the backend:
   ```bash
   flask run --host=0.0.0.0 --port=5000
   ```

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file:
   ```
   VITE_API_URL=http://localhost:5000
   ```

4. Run the frontend:
   ```bash
   npm start
   ```

## Project Structure

### Backend Structure

```
backend/
├── app/
│   ├── __init__.py        # Flask application factory
│   ├── api/               # API endpoints
│   │   ├── __init__.py
│   │   └── v1/            # API version 1
│   │       ├── __init__.py
│   │       ├── auth.py    # Authentication endpoints
│   │       ├── posts.py   # Post endpoints
│   │       ├── users.py   # User endpoints
│   │       └── tags.py    # Tag endpoints
│   ├── models/            # Database models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── post.py
│   │   ├── comment.py
│   │   └── tag.py
│   ├── schemas/           # Marshmallow schemas
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── post.py
│   │   ├── comment.py
│   │   └── tag.py
│   └── config/            # Configuration
│       ├── __init__.py
│       └── settings.py
├── migrations/            # Database migrations
├── tests/                 # Unit and integration tests
├── Dockerfile             # Docker configuration
└── requirements.txt       # Python dependencies
```

### Frontend Structure

```
frontend/
├── public/                # Static files
├── src/
│   ├── components/        # Reusable components
│   │   ├── Layout/
│   │   ├── Navbar/
│   │   ├── Footer/
│   │   └── ...
│   ├── pages/             # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── PostDetail.jsx
│   │   └── ...
│   ├── services/          # API services
│   │   ├── api.js
│   │   ├── auth.js
│   │   └── ...
│   ├── hooks/             # Custom React hooks
│   │   ├── useAuth.js
│   │   └── ...
│   ├── utils/             # Utility functions
│   │   ├── formatters.js
│   │   └── ...
│   ├── context/           # React context
│   │   ├── AuthContext.jsx
│   │   └── ...
│   ├── assets/            # Images, fonts, etc.
│   ├── App.jsx            # Main application component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── Dockerfile             # Docker configuration
├── package.json           # npm dependencies
└── vite.config.js         # Vite configuration
```

## Development Workflow

### Branching Strategy

We follow a simplified Git flow:

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: Feature branches
- `bugfix/*`: Bug fix branches
- `hotfix/*`: Urgent fixes for production

### Creating a New Feature

1. Create a new branch from `develop`:
   ```bash
   git checkout develop
   git pull
   git checkout -b feature/my-new-feature
   ```

2. Make your changes and commit them:
   ```bash
   git add .
   git commit -m "Add my new feature"
   ```

3. Push your branch:
   ```bash
   git push -u origin feature/my-new-feature
   ```

4. Create a pull request to merge into `develop`

### Code Style and Linting

#### Backend

We use Black for code formatting and Flake8 for linting:

```bash
# Install development dependencies
pip install black flake8

# Format code
black app tests

# Lint code
flake8 app tests
```

#### Frontend

We use ESLint and Prettier for code quality:

```bash
# Format code
npm run format

# Lint code
npm run lint
```

## Testing

### Backend Tests

We use pytest for testing the backend:

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app tests/
```

### Frontend Tests

We use Vitest and React Testing Library for frontend tests:

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage
```

## API Documentation

The API documentation is available at `/api/docs` when running the backend. It's generated using Swagger/OpenAPI.

## Database Migrations

We use Flask-Migrate (Alembic) for database migrations:

```bash
# Create a new migration
flask db migrate -m "Add new table"

# Apply migrations
flask db upgrade

# Rollback a migration
flask db downgrade
```

## Deployment

### Building Docker Images

```bash
# Build backend image
docker build -t blogzy-backend ./backend

# Build frontend image
docker build -t blogzy-frontend ./frontend
```

### Deploying to Kubernetes

```bash
# Apply Kubernetes configurations
kubectl apply -f k8s/

# Or deploy using Helm
helm install blogzy ./helm/blogzy
```

## Troubleshooting

### Common Issues

1. **Database connection errors**:
   - Check if PostgreSQL is running
   - Verify connection string in environment variables

2. **Frontend API connection issues**:
   - Ensure backend is running
   - Check CORS configuration
   - Verify API URL in frontend environment

3. **Docker issues**:
   - Run `docker-compose down -v` and then `docker-compose up -d` to reset
   - Check Docker logs with `docker-compose logs -f`

4. **Kubernetes deployment issues**:
   - Check pod status with `kubectl get pods -n blogzy`
   - View logs with `kubectl logs -n blogzy <pod-name>`