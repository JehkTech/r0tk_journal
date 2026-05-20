# R0TK Trading Journal Backend Architecture

## Overview
This document outlines the current backend architecture of the R0TK Trading Journal application and details the necessary enhancements to support production deployment and full frontend integration.

## Current Architecture

### Technology Stack
- **Runtime**: Node.js (v18+) with Express.js framework
- **Database**: LowDB (JSON file-based document store)
- **Authentication**: Custom JWT implementation with bcrypt password hashing
- **File Uploads**: Local filesystem storage with Multer middleware
- **Validation**: Express-validator for request validation
- **Security**: Helmet.js, CORS, rate limiting
- **Utilities**: date-fns for date manipulation
- **TypeScript**: For type safety and developer experience

### Architecture Patterns
1. **Layered Architecture**: Separation of concerns with distinct layers:
   - Presentation Layer: Express routes and controllers
   - Business Logic Layer: AuthService and TradeService
   - Data Access Layer: DatabaseManager abstraction
   - Cross-cutting Concerns: Middleware for security, validation, error handling

2. **Dependency Injection**: Services and database instances are injected into route handlers, promoting testability and loose coupling.

3. **Middleware Pipeline**: Express middleware chain for request processing:
   - Security middleware (helmet, cors, rate limiting)
   - Body parsing middleware
   - Authentication middleware
   - Validation middleware
   - Route handlers
   - Error handling middleware
   - 404 handler

4. **Repository Pattern**: DatabaseManager abstracts data operations, providing a clean interface for data access while hiding LowDB implementation details.

### File Structure
```
backend/
├── src/
│   ├── index.ts              # Application entry point and server configuration
│   ├── database/             # Database abstraction layer
│   │   └── index.ts          # LowDB database manager with schema definitions
│   ├── middleware/           # Custom Express middleware
│   │   └── auth.ts           # Authentication and validation middleware
│   ├── routes/               # API route definitions organized by domain
│   │   ├── auth.ts           # Authentication routes (login, register, profile)
│   │   └── trades.ts         # Trading journal routes (CRUD, analytics, file uploads)
│   ├── services/             # Business logic services
│   │   ├── AuthService.ts    # User authentication, password hashing, JWT handling
│   │   └── TradeService.ts   # Trade validation, PNL calculation, business rules
│   └── types/                # TypeScript type definitions and interfaces
│       └── index.ts          # Shared interfaces for users, trades, screenshots, etc.
```

## Current Endpoints

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | User registration with email/username/password | No |
| POST | `/login` | User login returning JWT token | No |
| GET | `/profile` | Get authenticated user's profile | Yes |
| PUT | `/profile` | Update user profile (username/email) | Yes |
| PUT | `/password` | Change user password | Yes |
| GET | `/dashboard` | Get dashboard statistics (PNL, win rate, trade count) | Yes |
| GET | `/analytics` | Get detailed analytics data for charts and reports | Yes |

### Trade Routes (`/api/trades`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all trades for user with filtering/pagination | Yes |
| GET | `/:id` | Get single trade by ID | Yes |
| POST | `/` | Create new trade | Yes |
| PUT | `/:id` | Update existing trade | Yes |
| DELETE | `/:id` | Delete trade | Yes |
| POST | `/:id/screenshots` | Upload screenshots for a trade (max 5 images) | Yes |

## Database Schema

### LowDB JSON Structure
Defined in `src/database/index.ts` with TypeScript interfaces:

#### Users Collection
```typescript
users: Array<{
  id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}>
```

#### Trades Collection
```typescript
trades: Array<{
  id: number;
  user_id: number;           // Foreign key to users
  pair: string;              // Currency pair (e.g., "EUR/USD")
  side: 'Long' | 'Short';
  lot_size: number;          // Position size in lots
  entry_price: number;
  exit_price?: number;       // Null for open trades
  stop_loss?: number;
  take_profit?: number;
  session: 'Asian' | 'London' | 'NY' | 'Overlap';
  strategy?: string;         // Trading strategy used
  emotion?: 'Confident' | 'Focused' | 'Calm' | 'Rushed' | 'Uncertain' | 'Fearful' | 'Greedy';
  confidence?: number;       // 1-10 scale
  notes?: string;            // Trader's notes and analysis
  pnl?: number;              // Profit/Loss in account currency
  trade_date: string;        // Date of trade (YYYY-MM-DD)
  created_at: string;
  updated_at: string;
}>
```

#### Screenshots Collection
```typescript
screenshots: Array<{
  id: number;
  trade_id: number;          // Foreign key to trades
  filename: string;          // Stored filename
  original_name: string;     // Original upload filename
  file_path: string;         // Filesystem path
  file_size: number;         // Size in bytes
  mime_type: string;         // MIME type (image/jpeg, image/png)
  created_at: string;
}>
```

#### Analytics Cache Collection
```typescript
analytics_cache: Array<{
  id: number;
  user_id: number;           // Foreign key to users
  cache_key: string;         // Unique key for cached data
  cache_data: string;        // JSON string of cached analytics
  expires_at: string;        // Expiration timestamp
  created_at: string;
}>
```

## Middleware and Security Features

### Implemented Middleware
1. **helmet()**: Sets security headers to protect against common vulnerabilities
2. **cors()**: Configures Cross-Origin Resource Sharing with credentials support
3. **rateLimit()**: Limits requests to 100 per 15 minutes per IP address
4. **express.json() & express.urlencoded()**: Parses JSON and URL-encoded bodies (10MB limit)
5. **express.static()**: Serves uploaded files from `/uploads` directory at `/uploads` endpoint
6. **Custom Auth Middleware** (`src/middleware/auth.ts`):
   - `authenticateToken`: Verifies JWT and attaches user to request object
   - `handleValidationErrors`: Formats express-validator errors for consistent responses
7. **Error Handling Middleware**: Centralized error processing with special handling for file upload errors
8. **404 Handler**: Returns consistent JSON error for undefined endpoints
9. **Graceful Shutdown**: Handles SIGINT/SIGTERM for clean application termination

### Security Features Implemented
- **Password Security**: bcrypt hashing with 12 salt rounds
- **Authentication**: JWT tokens with 7-day expiration, stored in HttpOnly cookies
- **Input Validation**: Comprehensive validation using express-validator for all endpoints
- **File Upload Security**: 
  - Restricted to image types (JPEG, PNG)
  - 10MB file size limit
  - Filename sanitization to prevent path traversal
- **Environment Configuration**: Secrets managed through environment variables
- **CORS Policy**: Configured to allow frontend origin with credentials
- **SQL Injection Protection**: While not applicable to LowDB, input validation prevents malicious data injection

## Required Enhancements for Production

### 1. Supabase Migration Strategy
Replace LowDB with Supabase for production-ready database functionality:

#### Database Schema Migration
Convert JSON collections to Supabase tables with proper relationships:

**users table**:
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

**trades table**:
```sql
CREATE TABLE trades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  pair VARCHAR(10) NOT NULL,
  side VARCHAR(4) NOT NULL CHECK (side IN ('Long', 'Short')),
  lot_size DECIMAL(10,2) NOT NULL CHECK (lot_size > 0),
  entry_price DECIMAL(10,5) NOT NULL,
  exit_price DECIMAL(10,5),
  stop_loss DECIMAL(10,5),
  take_profit DECIMAL(10,5),
  session VARCHAR(10) CHECK (session IN ('Asian', 'London', 'NY', 'Overlap')),
  strategy VARCHAR(50),
  emotion VARCHAR(10) CHECK (emotion IN ('Confident', 'Focused', 'Calm', 'Rushed', 'Uncertain', 'Fearful', 'Greedy')),
  confidence INTEGER CHECK (confidence BETWEEN 1 AND 10),
  notes TEXT,
  pnl DECIMAL(15,2),
  trade_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_trades_user_id ON trades(user_id);
CREATE INDEX idx_trades_trade_date ON trades(trade_date);
CREATE INDEX idx_trades_pair ON trades(pair);
CREATE INDEX idx_trades_session ON trades(session);
```

**trade_screenshots table**:
```sql
CREATE TABLE trade_screenshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trade_id UUID REFERENCES trades(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL CHECK (file_size >= 0),
  mime_type VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_screenshots_trade_id ON trade_screenshots(trade_id);
```

#### Supabase Integration Steps
1. Install `@supabase/supabase-js` package
2. Initialize Supabase client with service role key for backend operations
3. Replace LowDB operations with Supabase queries
4. Implement proper error handling for Supabase responses
5. Add connection pooling and retry logic
6. Implement database migrations using Supabase CLI

### 2. Enhanced Authentication System
Leverage Supabase Auth instead of custom JWT implementation:

#### Features to Implement
- **Email Verification**: Automatic email verification on registration
- **Password Reset**: Secure password reset flow with token expiration
- **Social Logins**: Google, GitHub, etc. OAuth providers (if needed)
- **Session Management**: Refresh token rotation for improved security
- **Multi-Factor Authentication**: Optional TOTP or SMS-based 2FA
- **Role-Based Access Control**: Admin/user roles for future administrative features

#### Implementation Approach
1. Use Supabase Auth helpers for user management
2. Replace custom JWT verification with Supabase session validation
3. Implement email confirmation redirects and handling
4. Add password reset endpoint with secure token validation
5. Update user profile endpoints to work with Supabase user metadata

### 3. File Upload Enhancements
Replace local filesystem storage with Supabase Storage:

#### Supabase Storage Integration
1. Create storage bucket for trade screenshots
2. Implement secure upload with signed URLs
3. Add file type validation and virus scanning (if required)
4. Implement automatic thumbnail generation for images
5. Add CDN caching and optimization
6. Implement file expiration and cleanup policies
7. Add access controls to ensure users can only access their own files

#### Upload Flow Improvements
1. Generate signed URLs for secure direct browser uploads
2. Implement client-side image resizing/compression before upload
3. Add upload progress indicators
4. Implement retry logic for failed uploads
5. Add file deduplication based on content hashing

### 4. Missing API Endpoints for Frontend Features

#### Advanced Analytics Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trades/analytics/performance-over-time` | PNL and equity curve over time |
| GET | `/api/trades/analytics/by-pair` | Performance breakdown by currency pair |
| GET | `/api/trades/analytics/by-session` | Performance by trading session |
| GET | `/api/trades/analytics/by-emotion` | Performance correlation with emotional state |
| GET | `/api/trades/analytics/win-rate-by-strategy` | Win rate analysis by trading strategy |
| GET | `/api/trades/analytics/risk-reward-distribution` | Distribution of risk/reward ratios |
| GET | `/api/trades/analytics/drawdown-analysis` | Maximum drawdown and recovery periods |
| GET | `/api/trades/analytics/trade-frequency` | Trading frequency patterns over time |

#### Trade Management Enhancements
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trades/export` | Export trades as CSV or JSON |
| POST | `/api/trades/import` | Import trades from CSV or JSON |
| GET | `/api/trades/stats/summary` | Aggregated statistics (total PNL, win rate, etc.) |
| GET | `/api/trades/open` | Get all currently open trades |
| GET | `/api/trades/closed` | Get all closed trades with performance metrics |
| POST | `/api/trades/:id/close` | Close an open trade with exit price |
| POST | `/api/trades/:id/duplicate` | Create a duplicate of an existing trade |

#### User and Settings Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Admin: List all users with pagination |
| GET | `/api/users/:id` | Admin: Get specific user details |
| DELETE | `/api/users/:id` | Admin: Deactivate/delete user |
| POST | `/api/users/:id/toggle-status` | Admin: Activate/deactivate user |
| GET | `/api/settings` | Get user preferences and settings |
| PUT | `/api/settings` | Update user preferences |
| GET | `/api/settings/preferences` | Get default preference values |
| PUT | `/api/settings/preferences` | Update default preferences |

#### Notification System
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get user notifications with pagination |
| POST | `/api/notifications/:id/read` | Mark notification as read |
| DELETE | `/api/notifications/:id` | Delete notification |
| POST | `/api/notifications/preferences` | Update notification preferences |

### 5. Production Infrastructure Requirements

#### Containerization and Orchestration
- **Dockerfile**: Multi-stage build for optimized production image
- **docker-compose.yml**: Development and production environment definitions
- **Health Checks**: Container-level health checks for orchestration platforms
- **Resource Limits**: CPU and memory constraints for containerized deployment

#### Configuration and Environment Management
- **Environment Separation**: Distinct configurations for development, staging, production
- **Secret Management**: Secure handling of API keys, database credentials, etc.
- **Feature Flags**: Toggle system for gradual feature rollouts
- **Configuration Validation**: Startup validation of required environment variables

#### Monitoring and Observability
- **Structured Logging**: JSON-formatted logs with correlation IDs
- **Metrics Collection**: Prometheus-compatible metrics endpoint
- **Distributed Tracing**: OpenTelemetry integration for request tracing
- **Application Performance Monitoring**: Integration with APM tools
- **Health Endpoints**: Liveness and readiness probes for Kubernetes

#### Security Enhancements
- **Regular Dependency Scanning**: Automated vulnerability scanning
- **Penetration Testing**: Scheduled security assessments
- **Security Headers**: Enhanced helmet configuration for production
- **Request Size Limits**: Protection against DoS attacks via large payloads
- **IP Whitelisting/Blacklisting**: Administrative access controls
- **Audit Logging**: Comprehensive logging of security-relevant events

#### Backup and Disaster Recovery
- **Automated Backups**: Scheduled database backups to object storage
- **Point-in-Time Recovery**: Ability to restore to specific timestamps
- **Cross-Region Replication**: Geographic redundancy for disaster recovery
- **Backup Validation**: Regular testing of backup restoration procedures
- **Runbooks**: Documented procedures for incident response and recovery

### 6. Code Quality and Maintenance Improvements

#### Testing Strategy
- **Unit Tests**: Jest/Vitest tests for services, utilities, and helpers
- **Integration Tests**: Supertest-based API endpoint testing
- **End-to-End Tests**: Cypress or Playwright for user flow validation
- **Test Coverage**: Minimum 80% coverage threshold for new code
- **Continuous Integration**: Automated testing on pull requests

#### Development Practices
- **Code Formatting**: Prettier configuration with pre-commit hooks
- **Linting**: ESLint with TypeScript plugin and strict rules
- **Type Safety**: Strict TypeScript configuration (noImplicitAny, strictNullChecks)
- **Documentation**: JSDoc comments and automated API documentation generation
- **Code Reviews**: Mandatory pull request reviews for all changes
- **Branch Protection**: Required status checks and review approvals

#### Documentation Standards
- **API Documentation**: OpenAPI/Swagger specification with UI
- **Architecture Decision Records**: ADRs for significant architectural choices
- **Runbooks**: Operational procedures for deployment, scaling, and troubleshooting
- **Onboarding Guide**: Developer setup and contribution guidelines
- **Troubleshooting Guide**: Common issues and resolution procedures

## Migration Path from LowDB to Supabase

### Phase 1: Preparation
1. [ ] Create Supabase project and obtain API keys
2. [ ] Install `@supabase/supabase-js` in backend
3. [ ] Design database schema matching current LowDB structure
4. [ ] Create backup of existing LowDB data
5. [ ] Develop migration scripts for data transfer

### Phase 2: Implementation
1. [ ] Replace DatabaseManager with Supabase client wrapper
2. [ ] Update AuthService to use Supabase Auth
3. [ ] Modify TradeService for Supabase query operations
4. [ ] Implement Supabase Storage for file uploads
5. [ ] Update all route handlers to use new data access layer
6. [ ] Add comprehensive error handling for Supabase operations

### Phase 3: Testing and Validation
1. [ ] Write unit tests for Supabase integration layer
2. [ ] Perform integration testing of all API endpoints
3. [ ] Validate data integrity after migration
4. [ ] Performance testing with realistic data volumes
5. [ ] Security testing of authentication and authorization
6. [ ] User acceptance testing with staging environment

### Phase 4: Deployment
1. [ ] Configure environment variables for Supabase connection
2. [ ] Update deployment scripts and CI/CD pipeline
3. [ ] Perform blue-green deployment to minimize downtime
4. [ ] Monitor application metrics and error rates post-deployment
5. [ ] Validate backup and recovery procedures
6. [ ] Document migration process and lessons learned

## Risks and Mitigation Strategies

### Technical Risks
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Data loss during migration | Low | High | Comprehensive backups, staged migration, rollback procedures |
| Performance degradation | Medium | Medium | Index optimization, query profiling, caching layer |
| Authentication failures | Low | High | Parallel run of old/new auth systems, extensive testing |
| File upload issues | Medium | Medium | Dual storage during transition, validation checks |
| API breaking changes | Low | High | Versioned API, backward compatibility layer |

### Operational Risks
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Deployment failures | Medium | Medium | Blue-green deployment, automated rollback, health checks |
| Configuration errors | Low | Medium | Environment validation, configuration testing, secrets management |
| Monitoring blind spots | Medium | Low | Comprehensive logging, metrics instrumentation, alerting |
| Vendor lock-in | Low | Low | Abstract data access layer, migration feasibility analysis |

## Success Criteria

### Functional Requirements
✅ All existing frontend features work with real backend data  
✅ Authentication system secure and user-friendly  
✅ File upload/download reliable and secure  
✅ Analytics endpoints provide accurate data for visualizations  
✅ Trade import/export functionality works correctly  
✅ Administrative features (if implemented) function as expected  

### Non-Functional Requirements
✅ Response times under 200ms for 95% of requests  
✅ System handles 100 concurrent users without degradation  
✅ 99.9% uptime SLA achievable with proper monitoring  
✅ Data backup and recovery tested quarterly  
✅ Security vulnerabilities addressed within 48 hours of discovery  
✅ Code coverage maintained above 80% for new code  

### Operational Excellence
✅ Deployment process automated and repeatable  
✅ Rollback capability tested and documented  
✅ Monitoring alerts actionable and not overly noisy  
✅ Runbooks cover common operational scenarios  
✅ Performance benchmarks established and tracked  
✅ Capacity planning data collected and analyzed  

## Conclusion

The current backend provides a solid foundation with proper separation of concerns, security practices, and API design. The primary enhancements needed for production readiness involve:

1. **Database Migration**: Moving from LowDB to Supabase for scalability, reliability, and production features
2. **Authentication Enhancement**: Leveraging Supabase Auth for secure, feature-rich authentication
3. **Storage Integration**: Using Supabase Storage for scalable, secure file handling
4. **API Expansion**: Implementing missing endpoints to support full frontend functionality
5. **Production Infrastructure**: Adding containerization, monitoring, logging, and DevOps practices
6. **Quality Improvements**: Comprehensive testing, documentation, and code quality practices

By following the outlined 5-day sprint plan and addressing the enhancements detailed in this document, the R0TK Trading Journal application will be production-ready with a robust, scalable backend that fully supports the frontend user experience.

--- 
*Document Version: 1.0*  
*Last Updated: 2026-05-20*  
*Author: Backend Architecture Analysis Agent*