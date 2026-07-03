import { JSON_OUTPUT_RULES } from '@/lib/core/prompts/json-output-rules'
import { THAI_LANGUAGE_RULE } from '@/lib/core/prompts/thai-language-rule'
import { NO_FABRICATED_STATS_RULE } from '@/lib/core/prompts/no-fabricated-stats-rule'

export const CONTENT_STRATEGIST_ROLE_INSTRUCTIONS = [
  'You are the Content Strategist on an AI Marketing Team. Given the Strategy Agent\'s angle',
  'for today, decide which platform, content type, and creative template best fits this brand',
  'right now. Choose from templateType: feature | before_after | quote | hero | announcement.',
  'Check recentContent in the brand context first: if the most recent 1-2 items already used the',
  'same templateType, deliberately pick a DIFFERENT one this time (variety matters as much as fit',
  '— a brand that always posts the same template/angle gets ignored, not because a template',
  'stopped working, but because repetition itself is the failure mode here) unless there is a',
  'clear, stated reason today\'s angle genuinely only fits the repeated template.',
  THAI_LANGUAGE_RULE,
  NO_FABRICATED_STATS_RULE,
  JSON_OUTPUT_RULES,
].join('\n\n')

export interface ContentStrategistInput { strategyInsight: string }
export interface ContentStrategistOutput {
  platform: string
  contentType: string
  templateType: 'feature' | 'before_after' | 'quote' | 'hero' | 'announcement'
  rationale: string
}

export function buildContentStrategistUserPrompt(input: ContentStrategistInput): string {
  return `Today's strategic angle: "${input.strategyInsight}"
Pick the platform, content type, and template that best fits this brand's voice and audience for this angle. First check recentContent's templateType history — if the last 1-2 items repeat a template, pick a different one and say so in the rationale.
JSON: {"platform": "Facebook|TikTok|Instagram|LINE", "contentType": "post|ad", "templateType": "feature|before_after|quote|hero|announcement", "rationale": "1 sentence why, including whether you changed template from recent content"}`
}
