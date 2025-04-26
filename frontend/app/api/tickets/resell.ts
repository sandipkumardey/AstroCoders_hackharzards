import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { ticketId, price } = await req.json();
    // Proxy to backend resell endpoint
    const backendUrl = process.env.BACKEND_API_TICKETS_RESELL_URL || 'http://localhost:5000/api/tickets/resell';
    const res = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId, price })
    });
    if (!res.ok) {
      const error = await res.text();
      return NextResponse.json({ error }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
