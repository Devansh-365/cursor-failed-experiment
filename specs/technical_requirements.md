# Technical Requirements Document

## Technology Stack Overview

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes (REST API)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **Deployment**: Vercel (recommended)

## Frontend Requirements

### Framework & Architecture
- Utilize Next.js App Router for routing and server components
- Implement TypeScript for type safety
- Use Tailwind CSS for styling with the design system specified in UI Requirements
- Incorporate shadcn/ui components for consistent UI elements

### Client-Side Features
- Form handling with client-side validation
- Success/error state management
- Responsive design implementation
- Animations for enhanced UX

### Performance Considerations
- Implement route prefetching for instantaneous navigation
- Optimize assets with Next.js Image component
- Minimize client-side JavaScript
- Leverage server components where appropriate

## Backend Requirements

### API Development

We will implement a REST API using Next.js API Routes for the waitlist functionality:

#### Endpoints

1. **POST /api/waitlist**
   - Purpose: Register a new user for the waitlist
   - Request body: `{ email: string }`
   - Response: `{ success: boolean, message: string }`
   - Status codes: 201 (Created), 400 (Bad Request), 409 (Conflict), 500 (Server Error)

2. **GET /api/waitlist/count** (Optional, admin only)
   - Purpose: Get current waitlist count
   - Response: `{ count: number }`
   - Authentication: Required (admin only)
   - Status codes: 200 (OK), 401 (Unauthorized), 500 (Server Error)

### Form Validation

Zod will be used for form validation to ensure data integrity:

```typescript
import { z } from 'zod';

export const WaitlistSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(100, 'Email must be less than 100 characters'),
});

export type WaitlistFormData = z.infer<typeof WaitlistSchema>;
```

## Database Requirements

### PostgreSQL Schema

The database schema will be focused on collecting and managing waitlist subscribers:

#### Tables

##### `Subscriber`
| Column       | Type       | Constraints       | Description                           |
|--------------|------------|-------------------|---------------------------------------|
| id           | UUID       | PK, NOT NULL      | Unique identifier                     |
| email        | VARCHAR    | UNIQUE, NOT NULL  | Subscriber's email address            |
| createdAt    | TIMESTAMP  | NOT NULL          | When the subscriber joined            |
| referralCode | VARCHAR    | NULLABLE          | Unique referral code for subscriber   |
| referredBy   | UUID       | FK, NULLABLE      | ID of subscriber who referred this one|
| verified     | BOOLEAN    | DEFAULT false     | Whether email has been verified       |

#### Relationships
- Self-referential relationship in `Subscriber` table:
  - A subscriber can refer multiple new subscribers
  - The `referredBy` column links to the `id` of the referring subscriber

### Prisma ORM Configuration

The Prisma schema will define our database models and relationships:

```prisma
// schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Subscriber {
  id           String       @id @default(uuid())
  email        String       @unique
  createdAt    DateTime     @default(now())
  referralCode String?      @unique
  referredBy   String?
  verified     Boolean      @default(false)
  
  // Self-referential relationship
  referrer     Subscriber?  @relation("ReferralRelation", fields: [referredBy], references: [id])
  referrals    Subscriber[] @relation("ReferralRelation")
}
```

### Database Operations

The following operations will be implemented using Prisma:

1. **Create Subscriber**
   ```typescript
   const createSubscriber = async (email: string, referredBy?: string) => {
     return await prisma.subscriber.create({
       data: {
         email,
         referredBy,
         referralCode: generateUniqueCode(),
       },
     });
   };
   ```

2. **Check Existing Email**
   ```typescript
   const checkExistingEmail = async (email: string) => {
     return await prisma.subscriber.findUnique({
       where: { email },
     });
   };
   ```

3. **Get Waitlist Count**
   ```typescript
   const getWaitlistCount = async () => {
     return await prisma.subscriber.count();
   };
   ```

## Deployment Requirements

### Environment Setup
- Development, staging, and production environments
- Environment variables for database connections and API keys
- PostgreSQL database instance accessible to deployment environment

### Database Migration Strategy
- Utilize Prisma migrations for schema changes
- Implement seed data for development environments
- Plan for zero-downtime migrations

### Infrastructure Recommendations
- Vercel for Next.js deployment
- Managed PostgreSQL service (Supabase, Railway, etc.)
- CI/CD pipeline for automated testing and deployment

## Security Considerations

- Implement rate limiting for API endpoints
- Use environment variables for sensitive configuration
- Sanitize and validate all user inputs
- Implement CSRF protection
- Set appropriate security headers

## Monitoring and Analytics

- Error logging and reporting
- Performance monitoring
- User analytics for conversion tracking
- Database query performance monitoring

## Future Extensibility

The technical architecture is designed to be extensible for future features:

- User authentication system
- Admin dashboard for waitlist management
- Email verification flow
- Referral tracking and rewards
- Integration with email marketing services 