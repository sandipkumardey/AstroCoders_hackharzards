import { NextResponse } from 'next/server';

export async function GET() {
  // Replace with your actual backend API endpoint
  const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:5000/api/events';
  try {
    const res = await fetch(backendUrl, { next: { revalidate: 0 } });
    if (!res.ok) {
      throw new Error(`Backend API error: ${res.status}`);
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ events: [], error: errMsg }, { status: 500 });
  }
}
