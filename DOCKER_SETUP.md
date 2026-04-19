# Docker Setup Guide - Legal eMarketplace

## Overview

This project is fully containerized using Docker and Docker Compose. The setup includes:

- **PostgreSQL 16** - Database service
- **Backend (Node.js Express)** - REST API
- **Frontend (React)** - Web application

## Prerequisites

- Docker (v20.10+)
- Docker Compose (v2.0+)

## Quick Start

### 1. Clone and Navigate to Project
```bash
cd legal-emarketplace
```

### 2. Create Environment File
```bash
cp .env.example .env
# Edit .env with your configuration (optional - defaults are provided)
```

### 3. Start Services
```bash
docker-compose up -d
```

This will:
- Create a PostgreSQL database
- Build and start the backend server (http://localhost:5000)
- Build and start the frontend application (http://localhost:3000)

### 4. Seed Database (Optional)
```bash
docker-compose exec backend npm run seed
```

Creates an admin user:
- Email: `kiran@kiran.com`
- Password: `Kiran@123`
- Role: `ADMIN`

## Available Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Stop Services
```bash
docker-compose down
```

### Rebuild Images (after code changes)
```bash
docker-compose up -d --build
```

### Access Database
```bash
docker-compose exec postgres psql -U postgres -d legal_emarketplace
```

### View Running Containers
```bash
docker-compose ps
```

## Environment Variables

### Available Configuration (.env)

```env
# Database
DB_USER=postgres
DB_PASSWORD=your_secure_password_here
DB_NAME=legal_emarketplace
DB_PORT=5432

# JWT
JWT_SECRET=your_jwt_secret_key_change_me_in_production
JWT_EXPIRES_IN=7d

# Server
NODE_ENV=development
PORT=5000

# Frontend
REACT_APP_API_BASE_URL=http://localhost:5000
```

## Service Details

### Database (PostgreSQL)
- **Image**: `postgres:16-alpine`
- **Container**: `legal-emarketplace-db`
- **Port**: 5432
- **Volume**: `postgres_data` (persisted)
- **Health Check**: Enabled

### Backend (Node.js)
- **Dockerfile**: `backend/Dockerfile`
- **Container**: `legal-emarketplace-backend`
- **Port**: 5000
- **API Endpoints**: 
  - `GET /health` - Health check
  - `POST /api/auth/register/citizen`
  - `POST /api/auth/register/provider`
  - `POST /api/auth/login`
  - And more...
- **Health Check**: Enabled
- **Dev Mode**: Source code mounted for live changes

### Frontend (React + Nginx)
- **Dockerfile**: `frontend/Dockerfile`
- **Container**: `legal-emarketplace-frontend`
- **Port**: 3000
- **Build**: Multi-stage (Node.js build, Nginx serve)
- **Nginx Config**: `frontend/nginx.conf`
- **SPA Support**: Configured for React Router

## File Structure

```
legal-emarketplace/
├── docker-compose.yml          # Docker Compose configuration
├── .env.example                # Environment variables template
├── backend/
│   ├── Dockerfile              # Backend image definition
│   ├── .dockerignore           # Excludes from Docker context
│   ├── package.json
│   ├── src/
│   │   ├── server.js
│   │   ├── config/db.js
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── utils/
│   └── ...
├── frontend/
│   ├── Dockerfile              # Frontend image definition
│   ├── .dockerignore           # Excludes from Docker context
│   ├── nginx.conf              # Nginx configuration
│   ├── package.json
│   ├── public/
│   ├── src/
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── pages/
│   │   ├── components/
│   │   └── api.js
│   └── ...
└── README.md
```

## Network Setup

- **Network Name**: `legal-network`
- **Type**: Bridge network
- **DNS**: Services communicate via container names
  - Backend accessible from frontend as `http://backend:5000`
  - Database accessible from backend as `postgres:5432`

## Volumes

### PostgreSQL Data
- **Name**: `postgres_data`
- **Type**: Local driver
- **Purpose**: Persist database data between container restarts

### Backend Source Code (Development)
- **Path**: `./backend/src:/app/src`
- **Purpose**: Enable live code changes without rebuilding

## Health Checks

All services include health checks:

### Backend Health Check
```bash
curl http://localhost:5000/health
# Response: { "status": "ok" }
```

### Frontend Health Check
```bash
curl http://localhost:3000/
# Response: HTML content
```

### Database Health Check
```bash
docker-compose exec postgres pg_isready -U postgres
```

## Troubleshooting

### Port Already in Use
If ports 3000, 5000, or 5432 are already in use, modify docker-compose.yml:

```yaml
ports:
  - "8000:5000"  # Backend on 8000 instead of 5000
  - "8080:3000"  # Frontend on 8080 instead of 3000
  - "5433:5432"  # Database on 5433 instead of 5432
```

### Database Connection Issues
```bash
# Check if database is ready
docker-compose exec postgres pg_isready -U postgres

# View database logs
docker-compose logs postgres
```

### Backend Won't Start
```bash
# View backend logs
docker-compose logs -f backend

# Rebuild backend image
docker-compose up -d --build backend

# Check database connection
docker-compose exec backend npm run seed
```

### Frontend Build Issues
```bash
# Clear cache and rebuild
docker-compose down
docker volume prune
docker-compose up -d --build frontend
```

## Performance Tips

1. **Use `.dockerignore`** - Already configured to reduce context size
2. **Multi-stage Builds** - Both Dockerfiles use multi-stage builds
3. **Alpine Images** - Lightweight base images (Node.js Alpine, Nginx Alpine)
4. **Layer Caching** - Optimize dockerfile layer order for better caching
5. **Gzip Compression** - Nginx configured with gzip compression

## Production Considerations

Before deploying to production:

1. **Update JWT_SECRET** - Generate a strong secret
2. **Update DB_PASSWORD** - Use a secure password
3. **Set NODE_ENV=production** - Enable production optimizations
4. **Use Secrets Management** - Never commit .env to version control
5. **Configure HTTPS** - Add SSL/TLS certificates
6. **Set Up Monitoring** - Add logging and monitoring
7. **Database Backups** - Configure backup strategy
8. **Restart Policy** - Already set to `unless-stopped`

## API Testing

### Register Citizen
```bash
curl -X POST http://localhost:5000/api/auth/register/citizen \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "password": "password123"
  }'
```

### Register Provider
```bash
curl -X POST http://localhost:5000/api/auth/register/provider \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Provider",
    "email": "jane@example.com",
    "phone": "0987654321",
    "password": "password123",
    "experience": 5,
    "profession": "Advocate",
    "licenseNumber": "ADV123456"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "john@example.com",
    "password": "password123"
  }'
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [Nginx Configuration](https://nginx.org/en/docs/)

## Support

For issues or questions:
1. Check logs: `docker-compose logs -f`
2. Verify environment variables in `.env`
3. Ensure all prerequisites are installed
4. Check Docker daemon is running

## Summary

✅ All services containerized and ready to run  
✅ Development and production ready  
✅ Health checks configured  
✅ Persistent data storage  
✅ Optimized images with multi-stage builds  
✅ Complete docker-compose orchestration
