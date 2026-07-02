import type { AgentDefinition } from '@/lib/core/agents/types'
import { parseJsonOutput } from '@/lib/core/agents/parseJsonOutput'
import { STRATEGY_ROLE_INSTRUCTIONS, buildStrategyUserPrompt, type StrategyInput, type StrategyOutput } from '@/lib/departments/marketing/prompts/strategy.prompts'

export const strategyAgent: AgentDefinition<StrategyInput, StrategyOutput> = {
  id: 'strategy',
  displayName: 'Strategy Agent',
  modelTier: 'fast',
  maxTokens: 800,
  roleInstructions: STRATEGY_ROLE_INSTRUCTIONS,
  buildUserPrompt: (input) => buildStrategyUserPrompt(input),
  parseOutput: parseJsonOutput<StrategyOutput>,
}
