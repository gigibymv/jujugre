import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Defer Supabase client creation to avoid errors during build when env vars are missing
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json(
        { error: 'userId query parameter is required' },
        { status: 400 }
      );
    }

    // Try to use Supabase if available
    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Study plan backend is not configured' },
        { status: 503 }
      );
    }

    const { data, error } = await supabase
      .from('study_plans')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Study plan not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error('[jujugre] study-plan API:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, planName, targetGREDate } = body;

    if (!userId || !planName || !targetGREDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Try to use Supabase if available
    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Study plan backend is not configured' },
        { status: 503 }
      );
    }

    const { data, error } = await supabase
      .from('study_plans')
      .insert([
        {
          user_id: userId,
          plan_name: planName,
          target_gre_date: targetGREDate,
        },
      ])
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Failed to create study plan' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('[jujugre] study-plan API:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

