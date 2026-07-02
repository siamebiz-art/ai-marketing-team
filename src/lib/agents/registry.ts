import type { AgentDefinition } from './types'
import { strategyAgent } from './specialists/strategy'
import { contentStrategistAgent } from './specialists/content-strategist'
import { copywriterAgent } from './specialists/copywriter'
import { creativeDirectorAgent } from './specialists/creative-director'
import { analyticsSpecialistAgent } from './specialists/analytics-specialist'
import { seoSpecialistAgent } from './specialists/seo-specialist'
import { supportCategorizerAgent } from './specialists/support-categorizer'
import { supportWriterAgent } from './specialists/support-writer'

// Adding specialist #21 means: write one file under specialists/, add one line here.
// The orchestrator never branches on agent identity — it only looks up this registry.
// Specialists from any department live in the same registry (support-* alongside the
// marketing ones) — nothing here is marketing-specific.
export const AGENT_REGISTRY: Record<string, AgentDefinition> = {
  [strategyAgent.id]: strategyAgent as AgentDefinition,
  [contentStrategistAgent.id]: contentStrategistAgent as AgentDefinition,
  [copywriterAgent.id]: copywriterAgent as AgentDefinition,
  [creativeDirectorAgent.id]: creativeDirectorAgent as AgentDefinition,
  [analyticsSpecialistAgent.id]: analyticsSpecialistAgent as AgentDefinition,
  [seoSpecialistAgent.id]: seoSpecialistAgent as AgentDefinition,
  [supportCategorizerAgent.id]: supportCategorizerAgent as AgentDefinition,
  [supportWriterAgent.id]: supportWriterAgent as AgentDefinition,
}
