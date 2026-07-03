import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

// Called by whatever external system actually publishes an approved item (e.g. toonetic's
// cron/mate-sync) — MATE makes no platform API call here, it only records a fact reported back
// to it. Protected by a shared secret since, unlike GET /api/approvals, this is never called from
// MATE's own browser code — nothing leaks by requiring auth here.
export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.MATE_INTEGRATION_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json() as { id?: string; externalPostId?: string }
  if (!body.id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 })
  }

  const { data: item, error: fetchError } = await supabaseAdmin
    .from('content_items')
    .select('id, status, payload')
    .eq('id', body.id)
    .single()
  if (fetchError || !item) {
    return NextResponse.json({ error: `Content item not found: ${fetchError?.message ?? 'no row'}` }, { status: 404 })
  }

  const payload = item.payload as Record<string, unknown>
  const { error } = await supabaseAdmin
    .from('content_items')
    .update({
      status: 'published',
      published_at: new Date().toISOString(),
      payload: body.externalPostId ? { ...payload, externalPostId: body.externalPostId } : payload,
    })
    .eq('id', body.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, status: 'published' })
}
