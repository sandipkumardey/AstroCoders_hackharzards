import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  // Replace with your backend tickets endpoint
  const backendUrl = process.env.BACKEND_API_TICKETS_URL || 'http://localhost:5000/api/tickets';
  try {
    const res = await fetch(backendUrl, { next: { revalidate: 0 } });
    if (!res.ok) {
      throw new Error(`Backend API error: ${res.status}`);
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ tickets: [], error: errMsg }, { status: 500 });
  }
}
