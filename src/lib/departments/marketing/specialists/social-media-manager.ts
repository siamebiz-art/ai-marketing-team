import type { AgentDefinition } from '@/lib/core/agents/types'
import { parseJsonOutput } from '@/lib/core/agents/parseJsonOutput'
import {
  SOCIAL_MEDIA_MANAGER_ROLE_INSTRUCTIONS, buildSocialMediaManagerUserPrompt,
  type SocialMediaManagerInput, type SocialMediaManagerOutput,
} from '@/lib/departments/marketing/prompts/social-media-manager.prompts'

export const socialMediaManagerAgent: AgentDefinition<SocialMediaManagerInput, SocialMediaManagerOutput> = {
  id: 'social-media-manager',
  displayName: 'Social Media Manager',
  modelTier: 'fast',
  maxTokens: 600,
  roleInstructions: SOCIAL_MEDIA_MANAGER_ROLE_INSTRUCTIONS,
  buildUserPrompt: (input) => buildSocialMediaManagerUserPrompt(input),
  parseOutput: parseJsonOutput<SocialMediaManagerOutput>,
}
