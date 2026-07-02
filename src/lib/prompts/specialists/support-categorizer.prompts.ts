import { JSON_OUTPUT_RULES } from '@/lib/prompts/shared/json-output-rules'

export const SUPPORT_CATEGORIZER_ROLE_INSTRUCTIONS = [
  'You are the Support Categorizer on an AI Support Team. Given a customer question about this',
  'brand\'s product, classify it and assess urgency so it can be routed and prioritized correctly.',
  JSON_OUTPUT_RULES,
].join('\n\n')

export interface SupportCategorizerInput { question: string }
export interface SupportCategorizerOutput {
  category: 'product_question' | 'billing' | 'technical' | 'general'
  urgency: 'low' | 'medium' | 'high'
  summary: string
}

export function buildSupportCategorizerUserPrompt(input: SupportCategorizerInput): string {
  return `Customer question: "${input.question}"

Classify this ticket. Pick exactly ONE category — if it touches more than one, pick whichever is primary.
JSON: {"category": "product_question" | "billing" | "technical" | "general", "urgency": "low|medium|high", "summary": "1 sentence restating the customer's issue"}`
}
