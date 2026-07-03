import { JSON_OUTPUT_RULES } from '@/lib/core/prompts/json-output-rules'
import { THAI_LANGUAGE_RULE } from '@/lib/core/prompts/thai-language-rule'
import { NO_FABRICATED_STATS_RULE } from '@/lib/core/prompts/no-fabricated-stats-rule'

// No LINE OA channel is connected yet — this drafts text a human can paste into LINE OA
// manually, same "stays manual until a real channel exists" pattern already validated for
// Support ticket replies.
export const LINE_OA_SPECIALIST_ROLE_INSTRUCTIONS = [
  'You are the LINE OA Specialist on an AI Marketing Team. Given today\'s Facebook caption,',
  'adapt it into a LINE Official Account broadcast message: shorter, more direct, LINE-style',
  'tone (conversational, 1-2 short paragraphs, a clear single CTA), not a copy-paste of the',
  'Facebook caption.',
  THAI_LANGUAGE_RULE,
  NO_FABRICATED_STATS_RULE,
  JSON_OUTPUT_RULES,
].join('\n\n')

export interface LineOaSpecialistInput { caption: string }
export interface LineOaSpecialistOutput {
  lineMessage: string
  cta: string
}

export function buildLineOaSpecialistUserPrompt(input: LineOaSpecialistInput): string {
  return `Today's Facebook caption: "${input.caption}"

Adapt this into a short LINE OA broadcast message (LINE-style tone, 1-2 short paragraphs) with one clear CTA.
JSON: {"lineMessage": "the LINE broadcast text", "cta": "1 short phrase"}`
}
