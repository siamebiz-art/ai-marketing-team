import type { AgentDefinition } from '@/lib/agents/types'
import { parseJsonOutput } from '@/lib/agents/parseJsonOutput'
import { STRATEGY_ROLE_INSTRUCTIONS, buildStrategyUserPrompt, type StrategyInput, type StrategyOutput } from '@/lib/prompts/specialists/strategy.prompts'

export const strategyAgent: AgentDefinition<StrategyInput, StrategyOutput> = {
  id: 'strategy',
  displayName: 'Strategy Agent',
  modelTier: 'fast',
  maxTokens: 500,
  roleInstructions: STRATEGY_ROLE_INSTRUCTIONS,
  buildUserPrompt: (input) => buildStrategyUserPrompt(input),
  parseOutput: parseJsonOutput<StrategyOutput>,
}
