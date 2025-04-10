import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schema for validating the referral code query parameter
const referralQuerySchema = z.object({
  code: z.string().min(3).max(20)
});

// Define the shape of the referral data we'll use
type ReferralData = {
  id: string;
  email: string;
  createdAt: Date;
};

export async function GET(request: NextRequest) {
  try {
    // Get referral code from query parameters
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    
    // Validate the query parameter
    const result = referralQuerySchema.safeParse({ code });
    
    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Invalid referral code format" 
        }, 
        { status: 400 }
      );
    }
    
    // Find the subscriber with this referral code
    const subscriber = await prisma.subscriber.findUnique({
      where: { referralCode: code },
      include: {
        referrals: {
          select: {
            id: true,
            email: true,
            createdAt: true
          }
        }
      }
    });
    
    if (!subscriber) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Referral code not found" 
        }, 
        { status: 404 }
      );
    }
    
    // Return the referral stats
    return NextResponse.json({
      success: true,
      stats: {
        totalReferrals: subscriber.referrals.length,
        referrals: subscriber.referrals.map((ref: ReferralData) => ({
          date: ref.createdAt,
          // Mask the email for privacy
          email: ref.email.replace(/(.{2})(.*)(?=@)/, (_: string, start: string, rest: string) => start + '*'.repeat(rest.length))
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching referral stats:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: "An error occurred while processing your request" 
      }, 
      { status: 500 }
    );
  }
} 