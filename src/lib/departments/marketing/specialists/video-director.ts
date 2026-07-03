import type { AgentDefinition } from '@/lib/core/agents/types'
import { parseJsonOutput } from '@/lib/core/agents/parseJsonOutput'
import {
  VIDEO_DIRECTOR_ROLE_INSTRUCTIONS, buildVideoDirectorUserPrompt,
  type VideoDirectorInput, type VideoDirectorOutput,
} from '@/lib/departments/marketing/prompts/video-director.prompts'

export const videoDirectorAgent: AgentDefinition<VideoDirectorInput, VideoDirectorOutput> = {
  id: 'video-director',
  displayName: 'Video Director',
  modelTier: 'capable',
  maxTokens: 1600,
  roleInstructions: VIDEO_DIRECTOR_ROLE_INSTRUCTIONS,
  buildUserPrompt: (input) => buildVideoDirectorUserPrompt(input),
  parseOutput: parseJsonOutput<VideoDirectorOutput>,
}
