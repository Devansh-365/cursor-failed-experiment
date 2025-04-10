import { NextRequest, NextResponse } from 'next/server';
import { WaitlistSchema } from '@/lib/validations/waitlist';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const waitlistSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  name: z.string().optional(),
  referralCode: z.string().optional()
});

function generateUniqueCode(): string {
  // Generate a random alphanumeric code of length 8
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate the request body
    const result = waitlistSchema.safeParse(body);
    
    if (!result.success) {
      // Return validation errors
      return NextResponse.json(
        { 
          success: false, 
          message: "Validation failed", 
          errors: result.error.flatten().fieldErrors 
        }, 
        { status: 400 }
      );
    }
    
    const { email, name, referralCode } = result.data;
    
    // Check if the email already exists
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email },
    });
    
    if (existingSubscriber) {
      return NextResponse.json(
        { 
          success: false,
          message: "This email is already on the waitlist" 
        },
        { status: 400 }
      );
    }
    
    // Check if referral code is valid if provided
    let referrerId: string | undefined;
    
    if (referralCode) {
      const referrer = await prisma.subscriber.findUnique({
        where: { referralCode },
      });
      
      if (!referrer) {
        return NextResponse.json(
          { 
            success: false,
            message: "Invalid referral code" 
          },
          { status: 400 }
        );
      }
      
      referrerId = referrer.id;
    }
    
    // Generate a unique referral code for this new subscriber
    const newReferralCode = generateUniqueCode();
    
    // Create a new subscriber
    const subscriber = await prisma.subscriber.create({
      data: {
        email,
        name,
        referralCode: newReferralCode,
        referredBy: referrerId,
      },
    });
    
    // Return success response with the subscriber's referral code
    return NextResponse.json({ 
      success: true, 
      message: "Thank you for joining our waitlist! We'll notify you when we launch.",
      referralCode: subscriber.referralCode
    });
  } catch (error) {
    console.error('Error processing waitlist submission:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: "An error occurred while processing your request" 
      }, 
      { status: 500 }
    );
  }
} 