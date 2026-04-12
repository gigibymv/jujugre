import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { mockStudyPlan } from '@/lib/mock-data';

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
    const userId = searchParams.get('userId') || 'user-1';

    // Try to use Supabase if available
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('study_plans')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!error && data) {
        return NextResponse.json(data);
      }
    }

    // Fallback to mock data when Supabase is not configured or fetch fails
    return NextResponse.json(mockStudyPlan);
  } catch (err) {
    console.error('[jujugre] study-plan API:', err);
    // Always fallback to mock data on error
    return NextResponse.json(mockStudyPlan);
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
    if (supabase) {
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

      if (!error && data) {
        return NextResponse.json(data, { status: 201 });
      }
    }

    // Fallback: return a mock response when Supabase is not configured
    const mockResponse = {
      id: `plan-${Date.now()}`,
      user_id: userId,
      plan_name: planName,
      target_gre_date: targetGREDate,
      created_at: new Date().toISOString(),
    };
    return NextResponse.json(mockResponse, { status: 201 });
  } catch (err) {
    console.error('[jujugre] study-plan API:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

