import type { AgentDefinition } from '@/lib/core/agents/types'
import { parseJsonOutput } from '@/lib/core/agents/parseJsonOutput'
import {
  BRAND_STRATEGIST_ROLE_INSTRUCTIONS, buildBrandStrategistUserPrompt,
  type BrandStrategistInput, type BrandStrategistOutput,
} from '@/lib/departments/marketing/prompts/brand-strategist.prompts'

export const brandStrategistAgent: AgentDefinition<BrandStrategistInput, BrandStrategistOutput> = {
  id: 'brand-strategist',
  displayName: 'Brand Strategist',
  modelTier: 'capable',
  maxTokens: 700,
  roleInstructions: BRAND_STRATEGIST_ROLE_INSTRUCTIONS,
  buildUserPrompt: (input) => buildBrandStrategistUserPrompt(input),
  parseOutput: parseJsonOutput<BrandStrategistOutput>,
}
