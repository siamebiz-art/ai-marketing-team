import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

const RECENT_ACTIVITY_LIMIT = 12
const WEEK_MS = 7 * 24 * 60 * 60 * 1000

export async function GET() {
  const weekAgo = new Date(Date.now() - WEEK_MS).toISOString()

  const [
    { count: pendingContentCount },
    { count: pendingSupportCount },
    { count: publishedThisWeekCount },
    { data: activeCampaigns, error: campaignsError },
    { data: recentActivity, error: activityError },
  ] = await Promise.all([
    supabaseAdmin.from('content_items').select('id', { count: 'exact', head: true }).eq('status', 'pending_approval'),
    supabaseAdmin.from('support_tickets').select('id', { count: 'exact', head: true }).eq('status', 'pending_review'),
    supabaseAdmin.from('content_items').select('id', { count: 'exact', head: true }).eq('status', 'published').gte('published_at', weekAgo),
    supabaseAdmin
      .from('campaigns')
      .select('id, name, goal, status, summary, created_at, brands(slug, name)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(10),
    supabaseAdmin
      .from('content_items')
      .select('id, brand_id, platform, status, created_at, published_at, brands(slug, name)')
      .order('created_at', { ascending: false })
      .limit(RECENT_ACTIVITY_LIMIT),
  ])

  if (campaignsError || activityError) {
    return NextResponse.json({ error: (campaignsError ?? activityError)?.message }, { status: 500 })
  }

  // Content items belonging to each active campaign, so the dashboard can show progress
  // against the campaign's planned content count.
  const campaignIds = (activeCampaigns ?? []).map((c) => c.id)
  const { data: campaignContentCounts } = campaignIds.length
    ? await supabaseAdmin.from('content_items').select('campaign_id').in('campaign_id', campaignIds)
    : { data: [] as { campaign_id: string }[] }
  const contentCountByCampaign = new Map<string, number>()
  for (const row of campaignContentCounts ?? []) {
    contentCountByCampaign.set(row.campaign_id, (contentCountByCampaign.get(row.campaign_id) ?? 0) + 1)
  }

  return NextResponse.json({
    pendingApprovalCount: (pendingContentCount ?? 0) + (pendingSupportCount ?? 0),
    publishedThisWeekCount: publishedThisWeekCount ?? 0,
    activeCampaignCount: activeCampaigns?.length ?? 0,
    activeCampaigns: (activeCampaigns ?? []).map((c) => ({
      ...c,
      contentProduced: contentCountByCampaign.get(c.id) ?? 0,
      contentPlanned: Array.isArray((c.summary as Record<string, unknown>)?.contentPlan)
        ? ((c.summary as Record<string, unknown>).contentPlan as unknown[]).length
        : null,
    })),
    recentActivity: recentActivity ?? [],
  })
}
