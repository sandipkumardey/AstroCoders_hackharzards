import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  // Example: expects wallet address as a query param
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get('wallet');
  const backendUrl = process.env.BACKEND_API_USER_ME_URL || `http://localhost:5000/api/users/me?wallet=${wallet}`;
  try {
    const res = await fetch(backendUrl, { next: { revalidate: 0 } });
    if (!res.ok) {
      throw new Error(`Backend API error: ${res.status}`);
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ user: null, error: errMsg }, { status: 500 });
  }
}
