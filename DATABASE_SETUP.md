# Database Setup Guide

## Database Configuration

### Default Database Settings

- **Database Name:** `ml_community`
- **Username:** `ml_admin`
- **Password:** `ML_Community_2024!`
- **Host:** `localhost` (development) / `db` (Docker)
- **Port:** `5432`

### Connection String

```
postgresql://ml_admin:ML_Community_2024!@localhost:5432/ml_community
```

## Quick Setup

### 1. Local Development Setup

```bash
# Start PostgreSQL service
sudo systemctl start postgresql
# or
sudo service postgresql start

# Run database initialization script
cd /workspace/backend
./scripts/init_database.sh
```

### 2. Docker Setup

```bash
# Run with Docker Compose
docker-compose up -d db

# Initialize database
docker-compose exec backend ./scripts/docker_init_db.sh
```

## Manual Setup

### 1. Create Database and User

Connect to PostgreSQL as superuser:

```sql
-- Create user
CREATE ROLE ml_admin WITH LOGIN PASSWORD 'ML_Community_2024!';

-- Create database
CREATE DATABASE ml_community OWNER ml_admin;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE ml_community TO ml_admin;
GRANT ALL ON SCHEMA public TO ml_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ml_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ml_admin;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ml_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ml_admin;
```

### 2. Run Migrations

```bash
cd /workspace/backend
export PATH="/home/ubuntu/.local/bin:$PATH"
alembic upgrade head
```

## Environment Variables

### Development (.env)

```env
# Database Configuration
DATABASE_URL=postgresql://ml_admin:ML_Community_2024!@localhost:5432/ml_community

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Security Configuration
SECRET_KEY=ML_Community_Super_Secret_Key_2024_Change_In_Production_At_Least_32_Chars

# Environment Settings
ENVIRONMENT=development
DEBUG=true

# Database Connection Pool Settings
DB_POOL_SIZE=10
DB_MAX_OVERFLOW=20
DB_POOL_TIMEOUT=30
DB_POOL_RECYCLE=3600
```

### Production

For production, change the following:

1. **Database Password:** Use a strong, unique password
2. **Secret Key:** Generate a secure random key (at least 32 characters)
3. **Database Host:** Use your production database host
4. **Redis Host:** Use your production Redis host

## Security Notes

⚠️ **Important Security Considerations:**

1. **Change Default Passwords:** Always change default passwords in production
2. **Use Environment Variables:** Never hardcode credentials in source code
3. **Restrict Database Access:** Limit database access to application servers only
4. **Use SSL/TLS:** Enable encrypted connections in production
5. **Regular Backups:** Implement automated database backups

## Troubleshooting

### Common Issues

1. **Connection Refused:**
   ```bash
   # Check if PostgreSQL is running
   sudo systemctl status postgresql
   
   # Start PostgreSQL
   sudo systemctl start postgresql
   ```

2. **Authentication Failed:**
   ```bash
   # Reset password
   sudo -u postgres psql
   ALTER USER ml_admin PASSWORD 'ML_Community_2024!';
   ```

3. **Database Not Found:**
   ```bash
   # Create database manually
   sudo -u postgres createdb -O ml_admin ml_community
   ```

4. **Migration Errors:**
   ```bash
   # Check Alembic status
   alembic current
   
   # Show migration history
   alembic history
   
   # Run specific migration
   alembic upgrade <revision_id>
   ```

### Verification

Test database connection:

```bash
# Test connection
PGPASSWORD=ML_Community_2024! psql -h localhost -p 5432 -U ml_admin -d ml_community -c "SELECT 1;"

# Check tables
PGPASSWORD=ML_Community_2024! psql -h localhost -p 5432 -U ml_admin -d ml_community -c "\dt"
```

## Database Schema

The database includes the following tables:

- `users` - User accounts and profiles
- `heroes` - Mobile Legends heroes data
- `items` - Game items and equipment
- `emblems` - Hero emblems and talents
- `build_guides` - User-created hero build guides
- `comments` - Comments on guides
- `guide_ratings` - User ratings for guides
- `hero_counters` - Hero counter relationships
- `hero_synergies` - Hero synergy relationships
- `news` - Platform news and articles

## Backup and Restore

### Backup Database

```bash
# Full backup
PGPASSWORD=ML_Community_2024! pg_dump -h localhost -p 5432 -U ml_admin ml_community > backup.sql

# Schema only
PGPASSWORD=ML_Community_2024! pg_dump -h localhost -p 5432 -U ml_admin -s ml_community > schema.sql

# Data only
PGPASSWORD=ML_Community_2024! pg_dump -h localhost -p 5432 -U ml_admin -a ml_community > data.sql
```

### Restore Database

```bash
# Restore from backup
PGPASSWORD=ML_Community_2024! psql -h localhost -p 5432 -U ml_admin ml_community < backup.sql
```

## Performance Optimization

### Connection Pool Settings

```python
# In app/core/config.py
DB_POOL_SIZE = 10          # Base number of connections
DB_MAX_OVERFLOW = 20       # Additional connections when needed
DB_POOL_TIMEOUT = 30       # Seconds to wait for connection
DB_POOL_RECYCLE = 3600     # Seconds before recycling connection
```

### Database Indexes

The following indexes are automatically created:

- `ix_users_email` - Unique index on user email
- `ix_users_username` - Unique index on username
- `ix_heroes_name` - Unique index on hero name
- `ix_items_name` - Unique index on item name
- `ix_emblems_name` - Unique index on emblem name

## Monitoring

### Check Database Status

```bash
# Check active connections
PGPASSWORD=ML_Community_2024! psql -h localhost -p 5432 -U ml_admin ml_community -c "SELECT count(*) FROM pg_stat_activity;"

# Check database size
PGPASSWORD=ML_Community_2024! psql -h localhost -p 5432 -U ml_admin ml_community -c "SELECT pg_size_pretty(pg_database_size('ml_community'));"
```

## Support

For database-related issues:

1. Check the logs: `tail -f /var/log/postgresql/postgresql-*.log`
2. Verify configuration: `alembic check`
3. Test connection: Use the verification commands above
4. Check Alembic status: `alembic current`