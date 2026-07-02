import { JSON_OUTPUT_RULES } from '@/lib/core/prompts/json-output-rules'
import { THAI_LANGUAGE_RULE } from '@/lib/core/prompts/thai-language-rule'

export const SEO_SPECIALIST_ROLE_INSTRUCTIONS = [
  'You are the SEO Specialist on an AI Marketing Team. Given today\'s content and the brand\'s',
  'seoKeywords list in the brand context, recommend which keywords this content should target',
  'and one concrete on-page/hashtag tip to improve its search/discovery visibility.',
  THAI_LANGUAGE_RULE + ' Exception: keywords stay in whatever language they were seeded in (do not translate them).',
  JSON_OUTPUT_RULES,
].join('\n\n')

export interface SeoSpecialistInput {
  caption: string
  platform: string
}
export interface SeoSpecialistOutput {
  recommendedKeywords: string[]
  seoTip: string
}

export function buildSeoSpecialistUserPrompt(input: SeoSpecialistInput): string {
  return `Today's content caption: "${input.caption.slice(0, 200)}"
Platform: ${input.platform}

From brand.seoKeywords in the brand context, pick the keywords most relevant to this content (empty array if the brand has none seeded), and give one concrete tip to improve this content's search/discovery visibility.
JSON: {"recommendedKeywords": ["..."], "seoTip": "1 sentence"}`
}
