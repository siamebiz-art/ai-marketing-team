import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

const LIMIT = 50

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('content_items')
    .select('id, brand_id, platform, content_type, status, payload, performance, published_at, created_at, brands(slug, name)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(LIMIT)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ content: data ?? [] })
}
