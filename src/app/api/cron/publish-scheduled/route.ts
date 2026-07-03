import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { publishContentToFacebook } from '@/lib/departments/marketing/publishToFacebook'

// Vercel Cron hits this via GET on the schedule in vercel.json (every 15 min). Reuses
// publishContentToFacebook unchanged — same function a manual "Publish to Facebook" click in
// /approvals calls, so scheduled and manual publishing can never drift apart.
export async function GET() {
  const { data: due, error } = await supabaseAdmin
    .from('content_items')
    .select('id')
    .eq('status', 'approved')
    .lte('scheduled_at', new Date().toISOString())
    .not('scheduled_at', 'is', null)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const results = await Promise.allSettled((due ?? []).map((item) => publishContentToFacebook(item.id)))

  const published = results.filter((r) => r.status === 'fulfilled').length
  const failed = results
    .map((r, i) => (r.status === 'rejected' ? { id: due![i].id, error: r.reason?.message ?? String(r.reason) } : null))
    .filter((r): r is { id: string; error: string } => r !== null)

  return NextResponse.json({ checked: due?.length ?? 0, published, failed })
}
