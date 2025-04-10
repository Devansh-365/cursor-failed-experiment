# Cherry - Waitlist with Referral System

A modern Next.js application featuring a waitlist system with referral capabilities, allowing users to join a waitlist and earn rewards by referring others.

## Features

- **Sleek Waitlist Form**: Beautiful, responsive UI for joining the waitlist
- **Referral System**: Each signup generates a unique referral code that can be shared
- **Referral Tracking**: Track who referred whom with a self-referential database schema
- **Referral Stats**: View how many people you've referred
- **Copy to Clipboard**: One-click copying of referral codes

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Zod schema validation
- **Forms**: React Hook Form

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/cherry.git
cd cherry
```

2. Install dependencies:

```bash
npm install
```

3. Set up your database:

Configure your database connection in the `.env` file:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/cherry?schema=public"
```

4. Run database migrations:

```bash
npx prisma migrate dev
```

5. (Optional) Seed the database:

```bash
npx ts-node init-db.ts
```

6. Start the development server:

```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) to see the application

## API Routes

- **POST /api/waitlist** - Join the waitlist
- **GET /api/waitlist/count** - Get waitlist subscriber count
- **GET /api/waitlist/referrals?code=XXX** - Get referral statistics for a specific code

## Database Schema

The Prisma schema includes a `Subscriber` model with self-referential relations to track referrals:

```prisma
model Subscriber {
  id           String       @id @default(uuid())
  email        String       @unique
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
  referralCode String?      @unique
  referredBy   String?
  verified     Boolean      @default(false)
  
  // Self-referential relationship
  referrer     Subscriber?  @relation("ReferralRelation", fields: [referredBy], references: [id])
  referrals    Subscriber[] @relation("ReferralRelation")
}
```

## Future Enhancements

- Email verification
- Referral rewards system
- Admin dashboard for managing subscribers
- Social sharing for referral codes

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
