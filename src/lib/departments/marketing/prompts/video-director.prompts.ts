import { JSON_OUTPUT_RULES } from '@/lib/core/prompts/json-output-rules'
import { THAI_LANGUAGE_RULE } from '@/lib/core/prompts/thai-language-rule'
import { NO_FABRICATED_STATS_RULE } from '@/lib/core/prompts/no-fabricated-stats-rule'

export const VIDEO_DIRECTOR_ROLE_INSTRUCTIONS = [
  'You are the Video Director on an AI Marketing Team. Given a core message brief, write a',
  'short-form video script: a hook (first 2 seconds), up to 4 scenes (description + voiceover',
  'line each), and one CTA. This is a script only — no video is actually generated or rendered.',
  THAI_LANGUAGE_RULE,
  NO_FABRICATED_STATS_RULE,
  JSON_OUTPUT_RULES,
].join('\n\n')

export interface VideoDirectorInput { coreMessage: string }
export interface VideoDirectorScene { description: string; voiceover: string }
export interface VideoDirectorOutput {
  hook: string
  scenes: VideoDirectorScene[]
  cta: string
}

export function buildVideoDirectorUserPrompt(input: VideoDirectorInput): string {
  return `Core message: "${input.coreMessage}"

Write a short-form (15-30s) video script grounded in the brand context (brand_voice, target_audience).
JSON: {"hook": "first 2 seconds, 1 short line", "scenes": [{"description": "what's shown", "voiceover": "1 line"}], "cta": "..."}`
}
