import { supabaseAdmin } from '@/lib/supabase/admin'

const GRAPH_API_VERSION = 'v25.0'

interface PerformanceResult {
  likes: number | null
  comments: number | null
  shares: number
  limited: boolean // true if likes/comments were unavailable due to token scope
}

// Basic engagement via the post edge. In practice `likes`/`comments`/`reactions` need
// `pages_read_user_content` (a broader permission than `pages_read_engagement`, which this
// project's manually-supplied token does not have — confirmed via /debug_token and per-field
// testing). `shares` works with just `pages_read_engagement`. Rather than fail the whole fetch
// when the broader scope is missing, fetch what's actually available and mark the rest as
// unavailable — this degrades gracefully and needs no code change once a broader-scoped token
// exists (only re-connecting the brand with a new token).
export async function fetchAndStoreFacebookPerformance(contentItemId: string): Promise<PerformanceResult> {
  const { data: item, error: itemError } = await supabaseAdmin
    .from('content_items')
    .select('id, brand_id, payload, performance')
    .eq('id', contentItemId)
    .single()
  if (itemError || !item) throw new Error(`Content item not found: ${itemError?.message ?? 'no row'}`)

  const payload = item.payload as Record<string, unknown>
  const postId = payload.facebookPostId as string | undefined
  if (!postId) throw new Error('This content item has no facebookPostId — has it been published?')

  const { data: connection, error: connError } = await supabaseAdmin
    .from('brand_social_connections')
    .select('access_token')
    .eq('brand_id', item.brand_id)
    .eq('platform', 'facebook')
    .single()
  if (connError || !connection) throw new Error(`No Facebook connection for this brand: ${connError?.message ?? 'not connected'}`)
  const accessToken = connection.access_token

  async function fetchField(field: string): Promise<Record<string, unknown> | null> {
    const res = await fetch(`https://graph.facebook.com/${GRAPH_API_VERSION}/${postId}?fields=${field}&access_token=${accessToken}`)
    const data = await res.json() as Record<string, unknown>
    return res.ok ? data : null
  }

  const [sharesData, likesData, commentsData] = await Promise.all([
    fetchField('shares'),
    fetchField('likes.summary(true)'),
    fetchField('comments.summary(true)'),
  ])

  const shares = (sharesData?.shares as Record<string, unknown> | undefined)?.count as number ?? 0
  const likes = likesData
    ? ((likesData.likes as Record<string, unknown> | undefined)?.summary as Record<string, unknown> | undefined)?.total_count as number ?? 0
    : null
  const comments = commentsData
    ? ((commentsData.comments as Record<string, unknown> | undefined)?.summary as Record<string, unknown> | undefined)?.total_count as number ?? 0
    : null

  const result: PerformanceResult = { likes, comments, shares, limited: likes === null || comments === null }
  await supabaseAdmin.from('content_items').update({
    performance: { ...result, fetchedAt: new Date().toISOString() },
  }).eq('id', contentItemId)

  return result
}
