/**
 * Database Initialization Script
 * 
 * This script can be used to initialize the database schema and seed it with test data.
 * Run with: npx ts-node init-db.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting database initialization...');

    // Reset database - BE CAREFUL in production!
    // Uncomment these lines to reset the database (all data will be lost!)
    // console.log('Cleaning up existing database...');
    // await prisma.subscriber.deleteMany({});

    // Create some test users with referral codes
    console.log('Creating initial test subscribers...');
    
    const user1 = await prisma.subscriber.create({
      data: {
        email: 'user1@example.com',
        name: 'John Doe',
        referralCode: 'USER1CODE',
        verified: true
      }
    });
    
    const user2 = await prisma.subscriber.create({
      data: {
        email: 'user2@example.com',
        name: 'Jane Smith',
        referralCode: 'USER2CODE',
        verified: true
      }
    });
    
    // Add some referrals
    console.log('Creating referral relationships...');
    
    const referral1 = await prisma.subscriber.create({
      data: {
        email: 'referred1@example.com',
        name: 'Alex Johnson',
        referralCode: 'REFERRED1',
        referredBy: user1.id,
        verified: true
      }
    });
    
    const referral2 = await prisma.subscriber.create({
      data: {
        email: 'referred2@example.com',
        name: 'Taylor Swift',
        referralCode: 'REFERRED2',
        referredBy: user1.id,
        verified: true
      }
    });
    
    const referral3 = await prisma.subscriber.create({
      data: {
        email: 'referred3@example.com',
        name: 'Sam Wilson',
        referralCode: 'REFERRED3',
        referredBy: user2.id,
        verified: true
      }
    });
    
    console.log('Database initialization completed successfully!');
    console.log(`Total subscribers created: ${await prisma.subscriber.count()}`);
    
    // Display the referral hierarchy
    console.log('\nReferral Relationships:');
    const user1WithReferrals = await prisma.subscriber.findUnique({
      where: { id: user1.id },
      include: { referrals: true }
    });
    
    console.log(`User ${user1WithReferrals?.email} has ${user1WithReferrals?.referrals.length} referrals`);
    
    const user2WithReferrals = await prisma.subscriber.findUnique({
      where: { id: user2.id },
      include: { referrals: true }
    });
    
    console.log(`User ${user2WithReferrals?.email} has ${user2WithReferrals?.referrals.length} referrals`);
    
  } catch (error) {
    console.error('Error during database initialization:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 