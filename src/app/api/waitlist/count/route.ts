import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const count = await prisma.subscriber.count();
    
    return NextResponse.json({
      success: true,
      count
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching waitlist count:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch waitlist count'
    }, { status: 500 });
  }
} 