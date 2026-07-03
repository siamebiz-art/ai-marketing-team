import type { AgentDefinition } from '@/lib/core/agents/types'
import { parseJsonOutput } from '@/lib/core/agents/parseJsonOutput'
import {
  CAMPAIGN_PLANNER_ROLE_INSTRUCTIONS, buildCampaignPlannerUserPrompt,
  type CampaignPlannerInput, type CampaignPlannerOutput,
} from '@/lib/departments/marketing/prompts/campaign-planner.prompts'

export const campaignPlannerAgent: AgentDefinition<CampaignPlannerInput, CampaignPlannerOutput> = {
  id: 'campaign-planner',
  displayName: 'Campaign Planner',
  modelTier: 'capable',
  maxTokens: 1200,
  roleInstructions: CAMPAIGN_PLANNER_ROLE_INSTRUCTIONS,
  buildUserPrompt: (input) => buildCampaignPlannerUserPrompt(input),
  parseOutput: parseJsonOutput<CampaignPlannerOutput>,
}
