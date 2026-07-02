import type { ModelTier } from './types'

// The one place model IDs live — a future model migration touches this file, not every specialist.
export const MODEL_BY_TIER: Record<ModelTier, string> = {
  fast: 'claude-haiku-4-5',
  capable: 'claude-sonnet-5',
  premium: 'claude-opus-4-8',
}
