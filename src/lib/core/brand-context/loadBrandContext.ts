import { supabaseAdmin } from '@/lib/supabase/admin'
import type {
  Organization, Brand, BrandCompetitor, BrandProduct, Campaign, ContentItem, BrandMemoryEntry, BrandContext,
} from './types'

const RECENT_CAMPAIGNS_LIMIT = 5
const RECENT_CONTENT_LIMIT = 10
const MEMORY_PER_CATEGORY_LIMIT = 3

function mapOrganization(row: Record<string, unknown>): Organization {
  return { id: row.id as string, slug: row.slug as string, name: row.name as string }
}

function mapBrand(row: Record<string, unknown>): Brand {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    organizationId: row.organization_id as string,
    businessType: (row.business_type as string) ?? null,
    websiteUrl: (row.website_url as string) ?? null,
    brandIdentity: (row.brand_identity as Brand['brandIdentity']) ?? {},
    brandVoice: (row.brand_voice as Brand['brandVoice']) ?? {},
    targetAudience: (row.target_audience as Brand['targetAudience']) ?? {},
    marketingGoals: (row.marketing_goals as Brand['marketingGoals']) ?? {},
    seoKeywords: (row.seo_keywords as string[]) ?? [],
    socialAccounts: (row.social_accounts as Brand['socialAccounts']) ?? {},
    isActive: row.is_active as boolean,
  }
}

function mapCompetitor(row: Record<string, unknown>): BrandCompetitor {
  return {
    id: row.id as string,
    name: row.name as string,
    websiteUrl: (row.website_url as string) ?? null,
    notes: (row.notes as string) ?? null,
    lastAnalyzedAt: (row.last_analyzed_at as string) ?? null,
  }
}

function mapProduct(row: Record<string, unknown>): BrandProduct {
  return {
    id: row.id as string,
    name: row.name as string,
    description: (row.description as string) ?? null,
    priceInfo: (row.price_info as string) ?? null,
    metadata: (row.metadata as Record<string, unknown>) ?? {},
  }
}

function mapCampaign(row: Record<string, unknown>): Campaign {
  return {
    id: row.id as string,
    name: row.name as string,
    goal: (row.goal as string) ?? null,
    status: row.status as Campaign['status'],
    startedAt: (row.started_at as string) ?? null,
    endedAt: (row.ended_at as string) ?? null,
    summary: (row.summary as Record<string, unknown>) ?? {},
  }
}

function mapContentItem(row: Record<string, unknown>): ContentItem {
  return {
    id: row.id as string,
    platform: row.platform as string,
    contentType: row.content_type as string,
    status: row.status as ContentItem['status'],
    payload: (row.payload as Record<string, unknown>) ?? {},
    performance: (row.performance as Record<string, unknown>) ?? {},
    createdAt: row.created_at as string,
  }
}

function mapMemory(row: Record<string, unknown>): BrandMemoryEntry {
  return {
    id: row.id as string,
    category: row.category as BrandMemoryEntry['category'],
    summary: row.summary as string,
    confidence: row.confidence as BrandMemoryEntry['confidence'],
  }
}

// Caps memory to the top N per category (by confidence, then recency) after a single fetch —
// avoids N separate queries while keeping the brain payload small and cache-friendly.
function capMemoryPerCategory(rows: BrandMemoryEntry[]): BrandMemoryEntry[] {
  const confidenceRank = { high: 2, medium: 1, low: 0 }
  const byCategory = new Map<string, BrandMemoryEntry[]>()
  for (const row of rows) {
    const bucket = byCategory.get(row.category) ?? []
    bucket.push(row)
    byCategory.set(row.category, bucket)
  }
  const result: BrandMemoryEntry[] = []
  for (const bucket of byCategory.values()) {
    bucket.sort((a, b) => confidenceRank[b.confidence] - confidenceRank[a.confidence])
    result.push(...bucket.slice(0, MEMORY_PER_CATEGORY_LIMIT))
  }
  return result
}

// The one loader every department's agents/orchestrator call through — confirmed reusable
// as-is by department #2 (AI Support Team), not just Marketing.
export async function loadBrandContext(brandSlug: string): Promise<BrandContext> {
  const { data: brandRow, error: brandError } = await supabaseAdmin
    .from('brands')
    .select('*')
    .eq('slug', brandSlug)
    .single()

  if (brandError || !brandRow) {
    throw new Error(`Brand not found for slug "${brandSlug}": ${brandError?.message ?? 'no row'}`)
  }

  const brand = mapBrand(brandRow)

  const [orgRes, competitorsRes, productsRes, campaignsRes, contentRes, memoryRes] = await Promise.all([
    supabaseAdmin.from('organizations').select('*').eq('id', brand.organizationId).single(),
    supabaseAdmin.from('brand_competitors').select('*').eq('brand_id', brand.id),
    supabaseAdmin.from('brand_products').select('*').eq('brand_id', brand.id),
    supabaseAdmin.from('campaigns').select('*').eq('brand_id', brand.id)
      .order('created_at', { ascending: false }).limit(RECENT_CAMPAIGNS_LIMIT),
    supabaseAdmin.from('content_items').select('*').eq('brand_id', brand.id)
      .order('created_at', { ascending: false }).limit(RECENT_CONTENT_LIMIT),
    supabaseAdmin.from('brand_memory').select('*').eq('brand_id', brand.id)
      .order('updated_at', { ascending: false }),
  ])

  if (orgRes.error || !orgRes.data) {
    throw new Error(`Organization not found for brand "${brandSlug}": ${orgRes.error?.message ?? 'no row'}`)
  }

  return {
    organization: mapOrganization(orgRes.data),
    brand,
    competitors: (competitorsRes.data ?? []).map(mapCompetitor),
    products: (productsRes.data ?? []).map(mapProduct),
    recentCampaigns: (campaignsRes.data ?? []).map(mapCampaign),
    recentContent: (contentRes.data ?? []).map(mapContentItem),
    memory: capMemoryPerCategory((memoryRes.data ?? []).map(mapMemory)),
  }
}
