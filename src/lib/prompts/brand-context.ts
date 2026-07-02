import type { MarketingBrainContext } from '@/lib/marketing-brain/types'

// Recursively sorts object keys so the same brain data always serializes to the same
// byte sequence — required for Anthropic prompt caching to hit across agent calls in a run.
function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeysDeep)
  if (value !== null && typeof value === 'object') {
    const sorted: Record<string, unknown> = {}
    for (const key of Object.keys(value as Record<string, unknown>).sort()) {
      sorted[key] = sortKeysDeep((value as Record<string, unknown>)[key])
    }
    return sorted
  }
  return value
}

// Renders the shared brand-context block every specialist's system prompt includes.
// Deliberately excludes anything time-varying (no "today's date") — that stays in the
// per-call user prompt, after the cache breakpoint, so this block stays cache-stable
// across every agent step in a workflow run.
export function renderBrandContext(brain: MarketingBrainContext): string {
  // organization gives agents the "big picture" (this brand is one of several under the
  // same company) — memory itself stays out of this shared view; each brand's brand_memory
  // rows never appear in another brand's context.
  const payload = sortKeysDeep({
    organization: brain.organization,
    brand: brain.brand,
    competitors: brain.competitors,
    products: brain.products,
    recentCampaigns: brain.recentCampaigns,
    recentContent: brain.recentContent,
    memory: brain.memory,
  })
  return [
    'BRAND CONTEXT (Marketing Brain — shared across the whole AI Marketing Team):',
    JSON.stringify(payload, null, 2),
  ].join('\n')
}
