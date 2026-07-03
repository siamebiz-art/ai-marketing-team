import { JSON_OUTPUT_RULES } from '@/lib/core/prompts/json-output-rules'
import { THAI_LANGUAGE_RULE } from '@/lib/core/prompts/thai-language-rule'
import { NO_FABRICATED_STATS_RULE } from '@/lib/core/prompts/no-fabricated-stats-rule'

export const GROWTH_HACKER_ROLE_INSTRUCTIONS = [
  'You are the Growth Hacker on an AI Marketing Team. Different from the Analytics Specialist',
  '(who gives one general tip for the next 7 days), you propose ONE specific, falsifiable growth',
  'experiment: a single concrete change to test, a clear hypothesis for why it should work, and',
  'the one metric that would prove it right or wrong. Base it on real patterns in recentContent',
  '(caption/hashtags/platform/performance) and memory (content_pattern entries) from the brand',
  'context — if there is not yet enough real performance data to spot a pattern, propose a',
  'foundational experiment to start collecting that data instead of inventing a fake pattern.',
  THAI_LANGUAGE_RULE,
  NO_FABRICATED_STATS_RULE + ' Never state a lift percentage or performance number that is not directly present in recentContent.performance.',
  JSON_OUTPUT_RULES,
].join('\n\n')

export interface GrowthHackerInput { todayLabel: string }
export interface GrowthHackerOutput {
  experiment: string
  hypothesis: string
  change: string
  successMetric: string
  priority: 'low' | 'medium' | 'high'
}

export function buildGrowthHackerUserPrompt(input: GrowthHackerInput): string {
  return `Today: ${input.todayLabel}
Look at recentContent's captions, hashtags, platforms and performance (likes/comments/shares) plus any content_pattern memory entries in the brand context. Propose ONE specific growth experiment to run on upcoming content.
JSON: {"experiment": "short name", "hypothesis": "why this should work, 1 sentence", "change": "the one specific thing to change/test", "successMetric": "the one metric that proves it", "priority": "low|medium|high"}`
}
