import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { publishContentToFacebook } from '@/lib/departments/marketing/publishToFacebook'

const CONTENT_LIMIT = 50
const SUPPORT_LIMIT = 50

export async function GET() {
  const [{ data: content, error: contentError }, { data: support, error: supportError }, { data: connections, error: connError }] = await Promise.all([
    supabaseAdmin
      .from('content_items')
      .select('id, brand_id, platform, content_type, status, payload, created_at, scheduled_at, brands(slug, name)')
      .in('status', ['pending_approval', 'approved'])
      .order('created_at', { ascending: false })
      .limit(CONTENT_LIMIT),
    supabaseAdmin
      .from('support_tickets')
      .select('id, brand_id, question, category, urgency, draft_reply, created_at, brands(slug, name)')
      .eq('status', 'pending_review')
      .order('created_at', { ascending: false })
      .limit(SUPPORT_LIMIT),
    supabaseAdmin
      .from('brand_social_connections')
      .select('brand_id')
      .eq('platform', 'facebook'),
  ])

  if (contentError || supportError || connError) {
    return NextResponse.json({ error: (contentError ?? supportError ?? connError)?.message }, { status: 500 })
  }

  return NextResponse.json({
    content: content ?? [],
    support: support ?? [],
    connectedBrandIds: (connections ?? []).map((c) => c.brand_id),
  })
}

export async function POST(req: Request) {
  const body = await req.json() as {
    type?: 'content' | 'support'
    id?: string
    action?: 'approve' | 'reject' | 'publish' | 'schedule'
    scheduledAt?: string
  }
  if (!body.type || !body.id || !body.action) {
    return NextResponse.json({ error: 'type, id, and action are required' }, { status: 400 })
  }

  if (body.action === 'publish') {
    if (body.type !== 'content') {
      return NextResponse.json({ error: 'publish is only supported for content items' }, { status: 400 })
    }
    try {
      const result = await publishContentToFacebook(body.id)
      return NextResponse.json({ ok: true, status: 'published', postId: result.postId })
    } catch (e) {
      return NextResponse.json({ error: (e as Error).message }, { status: 500 })
    }
  }

  if (body.action === 'schedule') {
    if (body.type !== 'content' || !body.scheduledAt) {
      return NextResponse.json({ error: 'schedule requires type "content" and scheduledAt' }, { status: 400 })
    }
    // Status stays 'approved' — the /api/cron/publish-scheduled cron does the actual publish
    // once scheduled_at is reached, reusing publishContentToFacebook unchanged.
    const { error } = await supabaseAdmin.from('content_items').update({ scheduled_at: body.scheduledAt }).eq('id', body.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, status: 'scheduled', scheduledAt: body.scheduledAt })
  }

  const nextStatus = body.action === 'approve' ? 'approved' : 'rejected'
  const table = body.type === 'content' ? 'content_items' : 'support_tickets'

  const { error } = await supabaseAdmin.from(table).update({ status: nextStatus }).eq('id', body.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true, status: nextStatus })
}
