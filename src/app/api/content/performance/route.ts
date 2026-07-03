import { NextResponse } from 'next/server'
import { fetchAndStoreFacebookPerformance } from '@/lib/departments/marketing/fetchFacebookPerformance'

export async function POST(req: Request) {
  const body = await req.json() as { id?: string }
  if (!body.id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
  try {
    const performance = await fetchAndStoreFacebookPerformance(body.id)
    return NextResponse.json({ ok: true, performance })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
