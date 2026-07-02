import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

const CONTENT_LIMIT = 50
const SUPPORT_LIMIT = 50

export async function GET() {
  const [{ data: content, error: contentError }, { data: support, error: supportError }] = await Promise.all([
    supabaseAdmin
      .from('content_items')
      .select('id, brand_id, platform, content_type, payload, created_at, brands(slug, name)')
      .eq('status', 'pending_approval')
      .order('created_at', { ascending: false })
      .limit(CONTENT_LIMIT),
    supabaseAdmin
      .from('support_tickets')
      .select('id, brand_id, question, category, urgency, draft_reply, created_at, brands(slug, name)')
      .eq('status', 'pending_review')
      .order('created_at', { ascending: false })
      .limit(SUPPORT_LIMIT),
  ])

  if (contentError || supportError) {
    return NextResponse.json({ error: (contentError ?? supportError)?.message }, { status: 500 })
  }

  return NextResponse.json({ content: content ?? [], support: support ?? [] })
}

export async function POST(req: Request) {
  const body = await req.json() as { type?: 'content' | 'support'; id?: string; action?: 'approve' | 'reject' }
  if (!body.type || !body.id || !body.action) {
    return NextResponse.json({ error: 'type, id, and action are required' }, { status: 400 })
  }
  const nextStatus = body.action === 'approve' ? 'approved' : 'rejected'
  const table = body.type === 'content' ? 'content_items' : 'support_tickets'

  const { error } = await supabaseAdmin.from(table).update({ status: nextStatus }).eq('id', body.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true, status: nextStatus })
}
