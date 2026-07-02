import type { BrandContext } from '@/lib/core/brand-context/types'

export type ModelTier = 'fast' | 'capable' | 'premium'

export interface AgentDefinition<TInput = unknown, TOutput = unknown> {
  id: string
  displayName: string
  modelTier: ModelTier
  maxTokens: number
  // Static (brand-context-independent) role framing + output-format rules. Kept separate from
  // the brand-context block (which runAgent renders once and prepends as its own cached block)
  // so the SAME brand-context prefix is byte-identical across every agent's call in a run —
  // that's what makes it cache-hit from step 2 onward. If role instructions were folded into
  // one combined system string per agent (each starting with different role framing text),
  // the cache prefix would never match across agents, since caching only matches from byte 0.
  roleInstructions: string
  buildUserPrompt: (input: TInput, context: BrandContext, priorOutputs: Record<string, unknown>) => string
  parseOutput: (rawText: string) => TOutput
}

export interface AgentUsage {
  inputTokens: number
  outputTokens: number
  cacheReadInputTokens: number
  cacheCreationInputTokens: number
}

export interface AgentRunResult<TOutput = unknown> {
  output: TOutput
  usage: AgentUsage
}
