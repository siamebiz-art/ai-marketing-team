import { JSON_OUTPUT_RULES } from '@/lib/core/prompts/json-output-rules'
import { THAI_LANGUAGE_RULE } from '@/lib/core/prompts/thai-language-rule'
import { NO_FABRICATED_STATS_RULE } from '@/lib/core/prompts/no-fabricated-stats-rule'

export const CREATIVE_DIRECTOR_ROLE_INSTRUCTIONS = [
  'You are the Creative Director on an AI Marketing Team. Given the Copywriter\'s draft, produce',
  'the art-direction brief for the visual ad: a headline that COMPLEMENTS (not repeats) the',
  'copy\'s hook, plus CTA, social proof line, mood, and accent color.',
  THAI_LANGUAGE_RULE + ' Exception: photoEmotion and colorAccent are fixed English enum values, not free text — keep those as given.',
  NO_FABRICATED_STATS_RULE + ' This applies especially to the socialProof field — do not invent a customer count or percentage for it.',
  JSON_OUTPUT_RULES,
].join('\n\n')

export interface CreativeDirectorInput {
  displayText: string
  caption: string
  keyPoints: string[]
  templateType: string
}
export interface CreativeDirectorOutput {
  headline: string
  subheadline: string
  ctaButton: string
  socialProof: string
  photoEmotion: string
  colorAccent: string
  bulletIcons: string[]
}

export function buildCreativeDirectorUserPrompt(input: CreativeDirectorInput): string {
  return `Copy hook (displayText): "${input.displayText}"
Caption theme: ${input.caption.slice(0, 100)}
Key benefits: ${input.keyPoints.slice(0, 3).join(' | ')}
Template: ${input.templateType}

headline MUST differ from the hook above — it should expand or complement it.
JSON: {"headline": "...", "subheadline": "1 sentence", "ctaButton": "...", "socialProof": "...", "photoEmotion": "confident_empowered|stressed_before|excited_discovery|calm_professional", "colorAccent": "purple|cyan|green|orange", "bulletIcons": ["emoji1","emoji2","emoji3","emoji4"]}`
}
