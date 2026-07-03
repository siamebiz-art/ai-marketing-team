import { JSON_OUTPUT_RULES } from '@/lib/core/prompts/json-output-rules'
import { THAI_LANGUAGE_RULE } from '@/lib/core/prompts/thai-language-rule'
import { NO_FABRICATED_STATS_RULE } from '@/lib/core/prompts/no-fabricated-stats-rule'

export const WEBSITE_SPECIALIST_ROLE_INSTRUCTIONS = [
  'You are the Website Specialist on an AI Marketing Team. Given a core message brief, write',
  'landing page copy: a hero headline + subheadline, up to 3 supporting sections (heading +',
  'body), and a CTA button label.',
  THAI_LANGUAGE_RULE,
  NO_FABRICATED_STATS_RULE,
  JSON_OUTPUT_RULES,
].join('\n\n')

export interface WebsiteSpecialistInput { coreMessage: string }
export interface WebsiteSpecialistSection { heading: string; body: string }
export interface WebsiteSpecialistOutput {
  heroHeadline: string
  heroSubheadline: string
  sections: WebsiteSpecialistSection[]
  ctaButton: string
}

export function buildWebsiteSpecialistUserPrompt(input: WebsiteSpecialistInput): string {
  return `Core message: "${input.coreMessage}"

Write landing page copy grounded in the brand context (brand_voice, target_audience, products).
JSON: {"heroHeadline": "...", "heroSubheadline": "1 sentence", "sections": [{"heading": "...", "body": "..."}], "ctaButton": "..."}`
}
