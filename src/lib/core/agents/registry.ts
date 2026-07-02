import type { AgentDefinition } from './types'
import { MARKETING_AGENTS } from '@/lib/departments/marketing'
import { SUPPORT_AGENTS } from '@/lib/departments/support'

// Adding department #3 means: write its specialists, export them from its own index.ts,
// add one import + one spread entry here. The orchestrator never branches on agent identity
// or department — it only looks up this registry.
export const AGENT_REGISTRY: Record<string, AgentDefinition> = Object.fromEntries(
  [...MARKETING_AGENTS, ...SUPPORT_AGENTS].map((agent) => [agent.id, agent])
)
