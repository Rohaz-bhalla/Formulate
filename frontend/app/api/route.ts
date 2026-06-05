// frontend/app/api/generate/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();

const baseUrl = process.env.BACKEND_URL || "http://127.0.0.1:8000";

const response = await fetch(`${baseUrl}/generate-site`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to generate' }, { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json(data);
}

const baseUrl = process.env.BACKEND_URL || "http://127.0.0.1:8000";

export async function GET() {
  const response = await fetch(`${baseUrl}/explore-sites`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json(data);
}