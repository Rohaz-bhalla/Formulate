import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const baseUrl = process.env.BACKEND_URL || "http://127.0.0.1:8000";

export async function GET() {
  try {
    const response = await fetch(`${baseUrl}/explore-sites`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch gallery' }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Backend fetch error:", error);
    return NextResponse.json(
      { error: 'Backend unreachable' }, 
      { status: 500 }
    );
  }
}