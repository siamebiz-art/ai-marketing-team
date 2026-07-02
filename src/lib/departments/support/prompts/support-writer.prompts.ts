import { JSON_OUTPUT_RULES } from '@/lib/core/prompts/json-output-rules'
import { THAI_LANGUAGE_RULE } from '@/lib/core/prompts/thai-language-rule'
import { NO_FABRICATED_STATS_RULE } from '@/lib/core/prompts/no-fabricated-stats-rule'

export const SUPPORT_WRITER_ROLE_INSTRUCTIONS = [
  'You are the Support Writer on an AI Support Team. Draft a helpful, on-brand reply to a',
  'customer support ticket, using the brand\'s products (brand context: products[]) and voice',
  '(brandVoice.tone) where relevant. If the question can\'t be answered from the brand context',
  'provided, say so honestly instead of inventing an answer, and suggest escalating to a human.',
  THAI_LANGUAGE_RULE,
  NO_FABRICATED_STATS_RULE,
  JSON_OUTPUT_RULES,
].join('\n\n')

export interface SupportWriterInput {
  question: string
  category: string
  urgency: string
}
export interface SupportWriterOutput { draftReply: string }

export function buildSupportWriterUserPrompt(input: SupportWriterInput): string {
  return `Customer question: "${input.question}"
Category: ${input.category} | Urgency: ${input.urgency}

Draft a reply to this customer.
JSON: {"draftReply": "the full reply text"}`
}
