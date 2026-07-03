import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

const RECENT_ACTIVITY_LIMIT = 12
const WEEK_MS = 7 * 24 * 60 * 60 * 1000
const BRAND_HEALTH_WINDOW_MS = 30 * 24 * 60 * 60 * 1000

interface BrandHealthContentRow {
  brand_id: string
  status: string
  payload: Record<string, unknown>
  performance: { likes?: number | null; comments?: number | null; shares?: number; limited?: boolean } | null
}

// Plain aggregate over real rows, not another AI judgment call — matches
// NO_FABRICATED_STATS_RULE's spirit (see specialists' prompts). A brand with no data in the
// window gets `null` fields, never a misleading 0.
function computeBrandHealth(
  brandId: string,
  seoKeywords: string[],
  rows: BrandHealthContentRow[]
): { approvalRate: number | null; avgEngagement: number | null; seoKeywordCoverage: number | null } {
  const brandRows = rows.filter((r) => r.brand_id === brandId)

  const decided = brandRows.filter((r) => r.status === 'published' || r.status === 'approved' || r.status === 'rejected')
  const approvalRate = decided.length
    ? decided.filter((r) => r.status === 'published' || r.status === 'approved').length / decided.length
    : null

  const engagementRows = brandRows.filter((r) => r.status === 'published' && r.performance && !r.performance.limited)
  const avgEngagement = engagementRows.length
    ? engagementRows.reduce((sum, r) => {
        const p = r.performance!
        return sum + (p.likes ?? 0) + (p.comments ?? 0) + (p.shares ?? 0)
      }, 0) / engagementRows.length
    : null

  let seoKeywordCoverage: number | null = null
  if (seoKeywords.length) {
    const seen = new Set<string>()
    for (const r of brandRows) {
      const seo = r.payload?.['seo-specialist'] as { recommendedKeywords?: string[] } | undefined
      for (const kw of seo?.recommendedKeywords ?? []) seen.add(kw.toLowerCase().trim())
    }
    const covered = seoKeywords.filter((kw) => seen.has(kw.toLowerCase().trim())).length
    seoKeywordCoverage = covered / seoKeywords.length
  }

  return { approvalRate, avgEngagement, seoKeywordCoverage }
}

export async function GET() {
  const weekAgo = new Date(Date.now() - WEEK_MS).toISOString()
  const monthAgo = new Date(Date.now() - BRAND_HEALTH_WINDOW_MS).toISOString()

  const [
    { count: pendingContentCount },
    { count: pendingSupportCount },
    { count: publishedThisWeekCount },
    { data: activeCampaigns, error: campaignsError },
    { data: recentActivity, error: activityError },
    { data: activeBrands, error: brandsError },
    { data: healthContent, error: healthError },
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
    supabaseAdmin.from('brands').select('id, slug, name, seo_keywords').eq('is_active', true).order('slug'),
    supabaseAdmin.from('content_items').select('brand_id, status, payload, performance').gte('created_at', monthAgo),
  ])

  if (campaignsError || activityError || brandsError || healthError) {
    return NextResponse.json({ error: (campaignsError ?? activityError ?? brandsError ?? healthError)?.message }, { status: 500 })
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

  const brandHealth = (activeBrands ?? []).map((b) => ({
    slug: b.slug,
    name: b.name,
    ...computeBrandHealth(b.id, (b.seo_keywords as string[]) ?? [], (healthContent ?? []) as BrandHealthContentRow[]),
  }))

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
    brandHealth,
  })
}
