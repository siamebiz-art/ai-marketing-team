export interface Persona {
  name: string
  demographics?: string
  pain_points?: string[]
  goals?: string[]
}

export interface Organization {
  id: string
  slug: string
  name: string
}

export interface Brand {
  id: string
  slug: string
  name: string
  organizationId: string
  businessType: string | null
  websiteUrl: string | null
  brandIdentity: { mission?: string; values?: string[]; visual_style?: string; logo_url?: string | null }
  brandVoice: { tone?: string; vocabulary_dos?: string[]; vocabulary_donts?: string[]; sample_phrases?: string[] }
  targetAudience: { personas?: Persona[] }
  marketingGoals: { primary_goal?: string; kpis?: string[]; timeframe?: string }
  seoKeywords: string[]
  socialAccounts: Record<string, { handle?: string; url?: string }>
  isActive: boolean
}

export interface BrandCompetitor {
  id: string
  name: string
  websiteUrl: string | null
  notes: string | null
  lastAnalyzedAt: string | null
}

export interface BrandProduct {
  id: string
  name: string
  description: string | null
  priceInfo: string | null
  metadata: Record<string, unknown>
}

export interface Campaign {
  id: string
  name: string
  goal: string | null
  status: 'draft' | 'active' | 'completed' | 'archived'
  startedAt: string | null
  endedAt: string | null
  summary: Record<string, unknown>
}

export interface ContentItem {
  id: string
  platform: string
  contentType: string
  status: 'draft' | 'pending_approval' | 'approved' | 'published' | 'rejected'
  payload: Record<string, unknown>
  performance: Record<string, unknown>
  createdAt: string
}

export interface BrandMemoryEntry {
  id: string
  category: 'content_pattern' | 'brand_voice_note' | 'competitor_move' | 'campaign_learning'
  summary: string
  confidence: 'low' | 'medium' | 'high'
}

// Shared across every department, not just Marketing — confirmed by department #2 (AI Support
// Team) reusing this unchanged. recentCampaigns/recentContent read as marketing-flavored, but
// they're still real brand-level facts (e.g. Support benefits from knowing what's currently
// being promoted); departments that don't care about them just see mostly-empty arrays, which
// caused no friction building Support. Split them out into a department-specific extension only
// if a real department actually needs to — not preemptively.
export interface BrandContext {
  organization: Organization
  brand: Brand
  competitors: BrandCompetitor[]
  products: BrandProduct[]
  recentCampaigns: Campaign[]
  recentContent: ContentItem[]
  // Scoped strictly to this brand — never mixed with another brand's memory, even though
  // both brands share the same organization. The organization field above is the only
  // "big picture" an agent sees; memory itself stays per-brand.
  memory: BrandMemoryEntry[]
}
