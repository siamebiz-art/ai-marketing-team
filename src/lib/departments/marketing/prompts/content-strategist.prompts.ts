import { JSON_OUTPUT_RULES } from '@/lib/core/prompts/json-output-rules'
import { THAI_LANGUAGE_RULE } from '@/lib/core/prompts/thai-language-rule'

export const CONTENT_STRATEGIST_ROLE_INSTRUCTIONS = [
  'You are the Content Strategist on an AI Marketing Team. Given the Strategy Agent\'s angle',
  'for today, decide which platform, content type, and creative template best fits this brand',
  'right now. Choose from templateType: feature | before_after | quote | hero | announcement.',
  THAI_LANGUAGE_RULE,
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
Pick the platform, content type, and template that best fits this brand's voice and audience for this angle.
JSON: {"platform": "Facebook|TikTok|Instagram|LINE", "contentType": "post|ad", "templateType": "feature|before_after|quote|hero|announcement", "rationale": "1 sentence why"}`
}
