import Anthropic from '@anthropic-ai/sdk'
import type { BrandContext } from '@/lib/core/brand-context/types'
import { renderBrandContext } from '@/lib/core/brand-context/render'
import { MODEL_BY_TIER } from './models'
import type { AgentDefinition, AgentRunResult } from './types'

// The only place in this project that calls the Anthropic SDK. Every specialist, from any
// department, goes through here so caching behavior, model selection, and error handling
// stay consistent without each specialist re-implementing them.
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export async function runAgent<TInput, TOutput>(
  def: AgentDefinition<TInput, TOutput>,
  input: TInput,
  context: BrandContext,
  priorOutputs: Record<string, unknown>
): Promise<AgentRunResult<TOutput>> {
  const response = await anthropic.messages.create({
    model: MODEL_BY_TIER[def.modelTier],
    max_tokens: def.maxTokens,
    // These specialists produce short structured JSON, not open-ended reasoning — extended
    // thinking (on by default/adaptive for newer models) would burn the token budget on a
    // hidden thinking block instead of the actual output, so it's disabled explicitly.
    thinking: { type: 'disabled' },
    // Brand context first, as its own cached block — byte-identical across every agent's
    // call in a workflow run (it excludes anything time-varying), so it cache-hits from the
    // 2nd step onward. Role instructions are a separate block, cached independently — that
    // one only hits across repeat calls of the SAME agent (e.g. tomorrow's run).
    system: [
      { type: 'text', text: renderBrandContext(context), cache_control: { type: 'ephemeral' } },
      { type: 'text', text: def.roleInstructions, cache_control: { type: 'ephemeral' } },
    ],
    messages: [{ role: 'user', content: def.buildUserPrompt(input, context, priorOutputs) }],
  })

  // Find the text block explicitly rather than assuming content[0] — a thinking/redacted_thinking
  // block (when thinking is enabled) would otherwise occupy that index instead.
  const textBlock = response.content.find((b) => b.type === 'text')
  const raw = textBlock?.type === 'text' ? textBlock.text : ''
  if (response.stop_reason === 'max_tokens') {
    throw new Error(`Agent "${def.id}" hit max_tokens (${def.maxTokens}) before finishing — raise maxTokens for this specialist. Truncated output: ${raw.slice(0, 200)}`)
  }
  const output = def.parseOutput(raw)

  return {
    output,
    usage: {
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      cacheReadInputTokens: response.usage.cache_read_input_tokens ?? 0,
      cacheCreationInputTokens: response.usage.cache_creation_input_tokens ?? 0,
    },
  }
}
