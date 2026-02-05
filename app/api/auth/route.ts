import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    // Check against the password from environment variable
    const correctPassword = process.env.APP_PASSWORD || 'design2024';

    if (password === correctPassword) {
      // Generate a simple token (in production, use JWT or similar)
      const token = crypto.randomBytes(32).toString('hex');
      
      return NextResponse.json({ 
        success: true, 
        token 
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
