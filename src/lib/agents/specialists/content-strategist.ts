import type { AgentDefinition } from '@/lib/agents/types'
import { parseJsonOutput } from '@/lib/agents/parseJsonOutput'
import {
  CONTENT_STRATEGIST_ROLE_INSTRUCTIONS, buildContentStrategistUserPrompt,
  type ContentStrategistInput, type ContentStrategistOutput,
} from '@/lib/prompts/specialists/content-strategist.prompts'

export const contentStrategistAgent: AgentDefinition<ContentStrategistInput, ContentStrategistOutput> = {
  id: 'content-strategist',
  displayName: 'Content Strategist',
  modelTier: 'capable',
  maxTokens: 600,
  roleInstructions: CONTENT_STRATEGIST_ROLE_INSTRUCTIONS,
  buildUserPrompt: (input) => buildContentStrategistUserPrompt(input),
  parseOutput: parseJsonOutput<ContentStrategistOutput>,
}
