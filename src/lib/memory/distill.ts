import Anthropic from '@anthropic-ai/sdk'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { MODEL_BY_TIER } from '@/lib/agents/models'
import { parseJsonOutput } from '@/lib/agents/parseJsonOutput'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const RECENT_CONTENT_LIMIT = 20
const RECENT_CAMPAIGNS_LIMIT = 5
const MAX_PATTERNS_PER_RUN = 5

interface DistilledPattern {
  category: 'content_pattern' | 'brand_voice_note' | 'competitor_move' | 'campaign_learning'
  summary: string
  confidence: 'low' | 'medium' | 'high'
}

// Turns raw content_items/campaigns history into a handful of short, reusable patterns —
// the fix for Toonetic's ai_history table, which is a raw log nothing ever reads back from.
// Called on-demand for v1 (no cron yet — needs real content_items data to summarize first).
export async function distillMemory(brandId: string): Promise<DistilledPattern[]> {
  const [{ data: recentContent }, { data: recentCampaigns }] = await Promise.all([
    supabaseAdmin.from('content_items').select('platform, content_type, payload, performance')
      .eq('brand_id', brandId).order('created_at', { ascending: false }).limit(RECENT_CONTENT_LIMIT),
    supabaseAdmin.from('campaigns').select('name, goal, status, summary')
      .eq('brand_id', brandId).order('created_at', { ascending: false }).limit(RECENT_CAMPAIGNS_LIMIT),
  ])

  if (!recentContent?.length && !recentCampaigns?.length) return []

  const response = await anthropic.messages.create({
    model: MODEL_BY_TIER.fast,
    max_tokens: 600,
    thinking: { type: 'disabled' },
    system: 'You extract short, reusable marketing patterns from raw history. Output ONLY valid JSON. No markdown, no code fences.',
    messages: [{
      role: 'user',
      content: `Recent content items:\n${JSON.stringify(recentContent ?? [], null, 2)}

Recent campaigns:\n${JSON.stringify(recentCampaigns ?? [], null, 2)}

Extract up to ${MAX_PATTERNS_PER_RUN} short, reusable patterns (1-3 sentences each) worth remembering for future content — e.g. what worked, brand voice notes, competitor moves, campaign learnings. Only include patterns actually supported by the data above.
JSON: {"patterns": [{"category": "content_pattern|brand_voice_note|competitor_move|campaign_learning", "summary": "...", "confidence": "low|medium|high"}]}`,
    }],
  })

  const textBlock = response.content.find((b) => b.type === 'text')
  const raw = textBlock?.type === 'text' ? textBlock.text : ''
  const { patterns } = parseJsonOutput<{ patterns: DistilledPattern[] }>(raw)

  if (patterns.length) {
    await supabaseAdmin.from('brand_memory').insert(
      patterns.map((p) => ({
        brand_id: brandId, category: p.category, summary: p.summary, confidence: p.confidence,
      }))
    )
  }

  return patterns
}
