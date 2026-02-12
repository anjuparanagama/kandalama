import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get total properties count
    const { count: propertiesCount } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true });

    // For now, we'll use dummy data for users and pageviews
    // In a real system, you'd query your users table
    const usersCount = Math.floor(Math.random() * 100) + 50;
    const pageViews = Math.floor(Math.random() * 1000) + 500;

    return NextResponse.json({
      success: true,
      data: {
        propertiesCount: propertiesCount || 0,
        usersCount,
        pageViews,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch stats',
      },
      { status: 500 }
    );
  }
}
