import type { AgentDefinition } from '@/lib/core/agents/types'
import type { WorkflowDefinition } from '@/lib/core/orchestrator/types'
import { strategyAgent } from './specialists/strategy'
import { contentStrategistAgent } from './specialists/content-strategist'
import { copywriterAgent } from './specialists/copywriter'
import { creativeDirectorAgent } from './specialists/creative-director'
import { analyticsSpecialistAgent } from './specialists/analytics-specialist'
import { seoSpecialistAgent } from './specialists/seo-specialist'
import { researchSpecialistAgent } from './specialists/research-specialist'
import { campaignPlannerAgent } from './specialists/campaign-planner'
import { growthHackerAgent } from './specialists/growth-hacker'
import { ceoAdvisorAgent } from './specialists/ceo-advisor'
import { brandStrategistAgent } from './specialists/brand-strategist'
import { positioningSpecialistAgent } from './specialists/positioning-specialist'
import { createTodaysContentWorkflow } from './workflows/create-todays-content'
import { launchCampaignWorkflow } from './workflows/launch-campaign'
import { brandStrategyReviewWorkflow } from './workflows/brand-strategy-review'

// The Marketing department's full roster — this is the ONE file core/agents/registry.ts and
// core/orchestrator/registry.ts need to import to pick up everything this department owns.
export const MARKETING_AGENTS: AgentDefinition[] = [
  strategyAgent as AgentDefinition,
  contentStrategistAgent as AgentDefinition,
  copywriterAgent as AgentDefinition,
  creativeDirectorAgent as AgentDefinition,
  analyticsSpecialistAgent as AgentDefinition,
  seoSpecialistAgent as AgentDefinition,
  researchSpecialistAgent as AgentDefinition,
  campaignPlannerAgent as AgentDefinition,
  growthHackerAgent as AgentDefinition,
  ceoAdvisorAgent as AgentDefinition,
  brandStrategistAgent as AgentDefinition,
  positioningSpecialistAgent as AgentDefinition,
]

export const MARKETING_WORKFLOWS: WorkflowDefinition[] = [
  createTodaysContentWorkflow,
  launchCampaignWorkflow,
  brandStrategyReviewWorkflow,
]
