import { supabaseAdmin } from '@/lib/supabase/admin'

const GRAPH_API_VERSION = 'v25.0'

interface CopywriterPayload {
  caption?: string
  hashtags?: string[]
}

// Reimplemented thinly from toonetic's own api/cron/amos-publish/route.ts (read-only reference,
// not shared code — this project stays code-isolated from Toonetic). Text-only for now: no
// image-generation specialist exists in this project yet, so there's no image URL to attach.
export async function publishContentToFacebook(contentItemId: string): Promise<{ postId: string }> {
  const { data: item, error: itemError } = await supabaseAdmin
    .from('content_items')
    .select('id, brand_id, status, payload')
    .eq('id', contentItemId)
    .single()
  if (itemError || !item) throw new Error(`Content item not found: ${itemError?.message ?? 'no row'}`)
  if (item.status !== 'approved') {
    throw new Error(`Content item ${contentItemId} is not approved (status: ${item.status})`)
  }

  const { data: connection, error: connError } = await supabaseAdmin
    .from('brand_social_connections')
    .select('page_id, access_token')
    .eq('brand_id', item.brand_id)
    .eq('platform', 'facebook')
    .single()
  if (connError || !connection) {
    throw new Error(`No Facebook connection for this brand: ${connError?.message ?? 'not connected'}`)
  }

  const payload = item.payload as Record<string, unknown>
  const copy = payload.copywriter as CopywriterPayload | undefined
  const caption = copy?.caption ?? ''
  const hashtags = copy?.hashtags ?? []
  const message = [caption, hashtags.join(' ')].filter(Boolean).join('\n\n')

  const fbRes = await fetch(`https://graph.facebook.com/${GRAPH_API_VERSION}/${connection.page_id}/feed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, access_token: connection.access_token }),
  })
  const fbData = await fbRes.json() as Record<string, unknown>
  if (!fbRes.ok) {
    const err = (fbData.error as Record<string, unknown> | undefined)?.message
    throw new Error(String(err ?? 'Facebook API error'))
  }

  const postId = fbData.id as string
  await supabaseAdmin.from('content_items').update({
    status: 'published',
    published_at: new Date().toISOString(),
    payload: { ...payload, facebookPostId: postId },
  }).eq('id', contentItemId)

  return { postId }
}
