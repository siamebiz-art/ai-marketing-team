import { JSON_OUTPUT_RULES } from '@/lib/core/prompts/json-output-rules'
import { THAI_LANGUAGE_RULE } from '@/lib/core/prompts/thai-language-rule'
import { NO_FABRICATED_STATS_RULE } from '@/lib/core/prompts/no-fabricated-stats-rule'

export const SOCIAL_MEDIA_MANAGER_ROLE_INSTRUCTIONS = [
  'You are the Social Media Manager on an AI Marketing Team. Look at recentContent\'s platforms',
  'and posting cadence in the brand context and recommend the platform/frequency mix for the',
  'coming week — which platform(s) to prioritize and how many posts, given what has actually',
  'been posted recently. This informs tomorrow\'s Content Strategist, not today\'s post.',
  THAI_LANGUAGE_RULE,
  NO_FABRICATED_STATS_RULE,
  JSON_OUTPUT_RULES,
].join('\n\n')

export interface SocialMediaManagerInput { todayLabel: string }
export interface SocialMediaManagerOutput {
  weeklyPlatformMix: string
  postsPerWeek: number
  rationale: string
}

export function buildSocialMediaManagerUserPrompt(input: SocialMediaManagerInput): string {
  return `Today: ${input.todayLabel}
Based on recentContent's platforms and posting frequency in the brand context, recommend the platform mix and posting frequency for the coming week.
JSON: {"weeklyPlatformMix": "1 sentence, e.g. 'Facebook 4x, TikTok 1x'", "postsPerWeek": 0, "rationale": "1 sentence"}`
}
