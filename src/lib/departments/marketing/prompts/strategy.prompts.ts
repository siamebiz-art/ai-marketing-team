import { JSON_OUTPUT_RULES } from '@/lib/core/prompts/json-output-rules'
import { THAI_LANGUAGE_RULE } from '@/lib/core/prompts/thai-language-rule'

export const STRATEGY_ROLE_INSTRUCTIONS = [
  'You are the Strategy Agent on an AI Marketing Team. Your job: read the brand context and',
  'recommend the single most important marketing angle to focus content on today.',
  THAI_LANGUAGE_RULE,
  JSON_OUTPUT_RULES,
].join('\n\n')

export interface StrategyInput { todayLabel: string }
export interface StrategyOutput { insight: string }

export function buildStrategyUserPrompt(input: StrategyInput): string {
  return `Today: ${input.todayLabel}
Summarize the market/content strategy and angle most worth focusing on today, in 2-3 concise sentences.
JSON: {"insight": "..."}`
}
