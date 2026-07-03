import type { AgentDefinition } from '@/lib/core/agents/types'
import { parseJsonOutput } from '@/lib/core/agents/parseJsonOutput'
import {
  LINE_OA_SPECIALIST_ROLE_INSTRUCTIONS, buildLineOaSpecialistUserPrompt,
  type LineOaSpecialistInput, type LineOaSpecialistOutput,
} from '@/lib/departments/marketing/prompts/line-oa-specialist.prompts'

export const lineOaSpecialistAgent: AgentDefinition<LineOaSpecialistInput, LineOaSpecialistOutput> = {
  id: 'line-oa-specialist',
  displayName: 'LINE OA Specialist',
  modelTier: 'fast',
  maxTokens: 500,
  roleInstructions: LINE_OA_SPECIALIST_ROLE_INSTRUCTIONS,
  buildUserPrompt: (input) => buildLineOaSpecialistUserPrompt(input),
  parseOutput: parseJsonOutput<LineOaSpecialistOutput>,
}
