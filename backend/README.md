# R0TK Journal Backend

A comprehensive backend API for the R0TK Trading Journal application, built with Node.js, Express, TypeScript, and SQLite.

## Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Trade Management**: Full CRUD operations for trade entries
- **File Uploads**: Screenshot upload functionality with validation
- **Analytics**: Comprehensive trading analytics and performance metrics
- **Dashboard**: Real-time dashboard statistics
- **Security**: Rate limiting, CORS, helmet security headers
- **Data Validation**: Express-validator for request validation

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password
- `GET /api/auth/dashboard` - Get dashboard statistics
- `GET /api/auth/analytics` - Get analytics data

### Trades
- `GET /api/trades` - Get all trades (with filtering)
- `GET /api/trades/:id` - Get single trade
- `POST /api/trades` - Create new trade
- `PUT /api/trades/:id` - Update trade
- `DELETE /api/trades/:id` - Delete trade
- `POST /api/trades/:id/screenshots` - Upload screenshots

## Database Schema

### Users Table
- `id` (INTEGER PRIMARY KEY)
- `username` (TEXT UNIQUE)
- `email` (TEXT UNIQUE)
- `password_hash` (TEXT)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

### Trades Table
- `id` (INTEGER PRIMARY KEY)
- `user_id` (INTEGER FOREIGN KEY)
- `pair` (TEXT) - Currency pair
- `side` (TEXT) - Long/Short
- `lot_size` (REAL)
- `entry_price` (REAL)
- `exit_price` (REAL)
- `stop_loss` (REAL)
- `take_profit` (REAL)
- `session` (TEXT) - Trading session
- `strategy` (TEXT)
- `emotion` (TEXT)
- `confidence` (INTEGER 1-10)
- `notes` (TEXT)
- `pnl` (REAL)
- `trade_date` (DATETIME)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

### Screenshots Table
- `id` (INTEGER PRIMARY KEY)
- `trade_id` (INTEGER FOREIGN KEY)
- `filename` (TEXT)
- `original_name` (TEXT)
- `file_path` (TEXT)
- `file_size` (INTEGER)
- `mime_type` (TEXT)
- `created_at` (DATETIME)

## Environment Variables

Create a `.env` file based on `env.example`:

```env
PORT=3001
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DATABASE_PATH=./database.sqlite
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
CORS_ORIGIN=http://localhost:5173
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp env.example .env
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
npm start
```

## Development

- **Development**: `npm run dev` (uses tsx for hot reloading)
- **Build**: `npm run build` (compiles TypeScript to JavaScript)
- **Start**: `npm start` (runs compiled JavaScript)
- **Test**: `npm test` (runs Jest tests)

## Security Features

- JWT token authentication
- bcrypt password hashing (12 rounds)
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet security headers
- File upload validation
- Input validation with express-validator
- SQL injection protection with parameterized queries

## File Upload

- Supports image files (JPEG, PNG, GIF, WebP)
- Maximum file size: 10MB (configurable)
- Files stored in `./uploads` directory
- Automatic directory creation
- Unique filename generation

## Error Handling

- Comprehensive error handling middleware
- Validation error responses
- Graceful shutdown handling
- Development vs production error details

## Performance

- Database indexes on frequently queried columns
- Connection pooling
- Efficient SQL queries
- Static file serving optimization
