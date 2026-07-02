import { JSON_OUTPUT_RULES } from '@/lib/core/prompts/json-output-rules'
import { THAI_LANGUAGE_RULE } from '@/lib/core/prompts/thai-language-rule'
import { NO_FABRICATED_STATS_RULE } from '@/lib/core/prompts/no-fabricated-stats-rule'

export const COPYWRITER_ROLE_INSTRUCTIONS = [
  'You are the Copywriter on an AI Marketing Team. Write ad copy in the brand\'s own voice',
  '(see brandVoice.tone, vocabulary_dos, vocabulary_donts, sample_phrases in the brand context)',
  'that fits the chosen platform and template. Do not invent URLs, links, or discounts not',
  'present in the brand context.',
  THAI_LANGUAGE_RULE + ' Exception: imagePrompt stays in English regardless — it briefs an image generation model, not a customer.',
  NO_FABRICATED_STATS_RULE,
  JSON_OUTPUT_RULES,
].join('\n\n')

export interface CopywriterInput {
  strategyInsight: string
  platform: string
  contentType: string
  templateType: string
}
export interface CopywriterOutput {
  caption: string
  hashtags: string[]
  imagePrompt: string
  displayText: string
  keyPoints: string[]
}

export function buildCopywriterUserPrompt(input: CopywriterInput): string {
  return `Strategic angle: "${input.strategyInsight}"
Platform: ${input.platform} | Content type: ${input.contentType} | Template: ${input.templateType}

Write the ad copy for this post, in the brand's voice.
JSON: {"caption": "hook + body + CTA, no links", "hashtags": ["#..."], "imagePrompt": "EN, 30-50 words, photorealistic, no text/logo", "displayText": "short hook, <=45 chars", "keyPoints": ["benefit1", "benefit2", "benefit3"]}`
}
