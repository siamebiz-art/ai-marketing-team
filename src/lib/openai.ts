import OpenAI from 'openai'

// The one place the OpenAI client + image model live. Used for image generation only —
// all text generation in this project goes through Claude via src/lib/core/agents/runAgent.ts.
export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export const OPENAI_IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1'
