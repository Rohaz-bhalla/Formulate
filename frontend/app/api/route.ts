// frontend/app/api/generate/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();

const response = await fetch('http://127.0.0.1:8000/generate-site', {
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