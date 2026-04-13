# Elite Aesthetic Clinic - Setup Guide

## Backend Setup

### Prerequisites
- Python 3.11+
- PostgreSQL 14+
- pip

### Installation

1. **Create and activate a virtual environment:**
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
or 
   source venv/bin/activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

   **Note for Windows users:** If `asyncpg` fails to build, you'll need to install [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/). Alternatively, you can use pre-built wheels:
   ```bash
   pip install asyncpg --only-binary=all
   ```

3. **Set up environment variables:**
   ```bash
   # Copy the example env file
   copy .env.example .env  # Windows
   cp .env.example .env    # Linux/Mac
   
   # Edit .env and set your DATABASE_URL and JWT_SECRET
   ```

4. **Run database migrations:**
   ```bash
   alembic upgrade head
   ```

5. **Start the development server:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

6. **Access API documentation:**
   - Swagger UI: http://localhost:8000/docs
   - Health check: http://localhost:8000/health

## Frontend Setup

### Prerequisites
- Node.js 18+
- npm

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   The `.env.local` file is already configured with:
   ```
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
   BACKEND_API_URL=http://127.0.0.1:8000
   ```
   The frontend now proxies browser requests through `/api`, so `BACKEND_API_URL` is the server-side target the Next.js app uses to reach FastAPI.

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000

## Production Deployment

### Backend
1. Set `APP_ENV=production` in `.env`
2. Generate a strong `JWT_SECRET` (at least 32 characters)
3. Update `ALLOWED_ORIGINS` to your production domain
4. Use a production-ready WSGI server:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
   ```

### Frontend
1. Update `BACKEND_API_URL` and `NEXT_PUBLIC_API_URL` to your production backend URL in `.env.local`
2. Build the application:
   ```bash
   npm run build
   ```
3. Start the production server:
   ```bash
   npm run start
   ```

## Security Checklist

- [x] JWT tokens use industry-standard expiry (30min access, 30 days refresh)
- [x] HttpOnly, Secure (production), SameSite=lax cookies
- [x] Token rotation on refresh (new access + refresh tokens issued)
- [x] Password hashing with bcrypt
- [x] CORS configured with specific origins (not wildcard)
- [x] Input validation with Pydantic schemas
- [x] Role-based access control (RBAC)
- [x] Frontend route protection with middleware
- [x] Automatic token refresh on 401 errors
- [x] Database connection pooling configured
- [x] SQL injection prevention (parameterized queries via SQLAlchemy)
- [x] X-Process-Time-Ms header for performance monitoring
- [x] Global exception handling (no stack traces exposed)

## Troubleshooting

### Backend Issues

**asyncpg won't install on Windows:**
- Install Microsoft C++ Build Tools from https://visualstudio.microsoft.com/visual-cpp-build-tools/
- Or use: `pip install asyncpg --only-binary=all`

**Database connection errors:**
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify database exists: `createdb clinic_db`

### Frontend Issues

**CORS errors:**
- Ensure backend ALLOWED_ORIGINS includes http://localhost:3000
- Both frontend and backend must be running

**Frontend reaches login page but backend never receives the request:**
- Ensure the frontend proxy target is correct in `BACKEND_API_URL`
- Ensure FastAPI is running on the configured backend host/port
- Restart the Next.js frontend after changing `.env.local`

**Authentication not working:**
- Ensure both frontend and backend are running on correct ports
- Check browser dev tools for cookie issues
- In development, cookies are set with secure=False for http://

## Project Structure

See `clinic_website_backend_guide.md` and `frontend_guide.md` for detailed architecture documentation.
