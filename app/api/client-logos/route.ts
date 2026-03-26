import { NextResponse } from 'next/server';
import connectDB from '@/config/models/connectDB';
import ClientLogo from '@/config/utils/admin/clientLogo/clientLogoSchema';

// GET - Fetch active client logos for public display
export async function GET() {
  try {
    await connectDB();

    const clientLogos = await ClientLogo.find({ isActive: true }).sort({ order: 1, createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        data: clientLogos,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600',
        },
      }
    );
  } catch (error: any) {
    console.error('Error fetching client logos:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch client logos',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
