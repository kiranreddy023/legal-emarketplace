# MongoDB to PostgreSQL Migration Guide

## Migration Summary

This application has been successfully migrated from **MongoDB** to **PostgreSQL** using **Sequelize ORM**.

## Changes Made

### 1. **Database Connection** (`src/config/db.js`)
- Replaced Mongoose with Sequelize
- Updated to use PostgreSQL with environment variables for connection details
- Automatic model synchronization with `sequelize.sync()`

### 2. **Package Dependencies** (`package.json`)
- **Removed**: `mongoose`, `mongodb`
- **Added**: `sequelize`, `pg`, `pg-hstore`

### 3. **Models** (All converted to Sequelize)
- `src/models/User.js` - User authentication model
- `src/models/Provider.js` - Provider profile with foreign key to User
- `src/models/Booking.js` - Booking records with foreign keys to User and Provider
- `src/models/Review.js` - Reviews with foreign keys to Booking, User, and Provider
- `src/models/Incentive.js` - Incentive points with foreign key to Provider

**Key Changes in Models:**
- All IDs changed from MongoDB ObjectId to PostgreSQL UUID
- Foreign key relationships explicitly defined
- Timestamps automatically handled by Sequelize
- Boolean and JSON fields properly typed for PostgreSQL

### 4. **Controllers** (All updated for Sequelize queries)
- `src/controllers/authController.js` - Login/registration queries updated
- `src/controllers/providerController.js` - Provider search and updates refactored
- `src/controllers/bookingController.js` - Booking CRUD operations converted
- `src/controllers/reviewController.js` - Review creation updated
- `src/controllers/adminController.js` - Admin panel queries refactored

**Key Query Changes:**
- MongoDB operators (`$or`, `$gte`, `$in`, etc.) → Sequelize `Op` operators
- `findOne()` → `findOne({ where: {...} })`
- `find()` → `findAll({ where: {...} })`
- `populate()` → `include` with association options
- `.save()` remains same for updates

### 5. **Services** (`src/services/incentiveService.js`)
- Updated to use Sequelize for database operations
- Replaced `findByIdAndUpdate()` with explicit find + save pattern

### 6. **Seed Script** (`src/seed.js`)
- Updated to use Sequelize models
- Uses `User.destroy()` instead of `User.deleteMany()`

### 7. **Server** (`src/server.js`)
- Updated to import all models for proper Sequelize initialization
- Fixed `connectDB` destructuring from new export format

## Environment Variables Required

Create a `.env` file in the `backend/` directory with the following variables:

```env
# PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=legal_emarketplace
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development
```

## Setup Instructions

### 1. Install PostgreSQL
- Download and install PostgreSQL (v12 or higher recommended)
- Create a new database: `legal_emarketplace`
- Note down your credentials

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Configure Environment Variables
```bash
# Copy and update the .env file
cp .env.example .env
# Edit .env with your PostgreSQL credentials
```

### 4. Run Seed (Optional - Creates Admin User)
```bash
npm run seed
```

This creates an admin user:
- **Email**: kiran@kiran.com
- **Password**: Kiran@123
- **Role**: ADMIN

### 5. Start the Server
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

## Database Schema

### Tables Created Automatically:
1. **users** - User accounts with roles (CITIZEN, PROVIDER, ADMIN)
2. **providers** - Provider profiles linked to users
3. **bookings** - Service bookings between citizens and providers
4. **reviews** - Reviews for completed bookings
5. **incentives** - Incentive points history for providers

All tables include:
- `id` (UUID primary key)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

## Key Differences from MongoDB

| Feature | MongoDB | PostgreSQL |
|---------|---------|-----------|
| ID Type | ObjectId | UUID |
| Queries | `.find()`, `.findById()` | `.findAll()`, `.findByPk()` |
| Operators | `$or`, `$gte`, `$in` | `Op.or`, `Op.gte`, `Op.in` |
| Relationships | References in schema | Foreign Keys in schema |
| Updates | `.save()` | `.save()` or `.update()` |
| Transactions | Session-based | Transaction-based |

## Testing the Migration

### Register a Citizen
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

### Register a Provider
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

## Troubleshooting

### Connection Error
- Verify PostgreSQL is running: `psql -U postgres`
- Check database exists: `\l` (in psql)
- Verify .env credentials are correct

### Model Sync Error
- Check if tables already exist (may need to drop and recreate)
- Ensure database has proper permissions for the user

### UUID Issues
- Sequelize should handle UUID automatically with `DataTypes.UUIDV4`
- If issues persist, can revert to regular UUID strings

## Migration Completed ✅
All MongoDB references have been replaced with PostgreSQL/Sequelize equivalents.
