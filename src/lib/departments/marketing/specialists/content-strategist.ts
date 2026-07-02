import type { AgentDefinition } from '@/lib/core/agents/types'
import { parseJsonOutput } from '@/lib/core/agents/parseJsonOutput'
import {
  CONTENT_STRATEGIST_ROLE_INSTRUCTIONS, buildContentStrategistUserPrompt,
  type ContentStrategistInput, type ContentStrategistOutput,
} from '@/lib/departments/marketing/prompts/content-strategist.prompts'

export const contentStrategistAgent: AgentDefinition<ContentStrategistInput, ContentStrategistOutput> = {
  id: 'content-strategist',
  displayName: 'Content Strategist',
  modelTier: 'capable',
  maxTokens: 900,
  roleInstructions: CONTENT_STRATEGIST_ROLE_INSTRUCTIONS,
  buildUserPrompt: (input) => buildContentStrategistUserPrompt(input),
  parseOutput: parseJsonOutput<ContentStrategistOutput>,
}
