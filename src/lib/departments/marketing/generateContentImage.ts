import { openai, OPENAI_IMAGE_MODEL } from '@/lib/openai'
import { supabaseAdmin } from '@/lib/supabase/admin'

const PHOTO_EMOTION_STYLE: Record<string, string> = {
  confident_empowered: 'confident, empowered mood, strong posture, direct gaze',
  stressed_before: 'stressed, overwhelmed \"before\" mood, cluttered chaotic feel',
  excited_discovery: 'excited, discovery moment, bright energetic mood',
  calm_professional: 'calm, professional, composed mood, clean and orderly feel',
}

const COLOR_ACCENT_STYLE: Record<string, string> = {
  purple: 'purple accent tones',
  cyan: 'cyan/teal accent tones',
  green: 'green accent tones',
  orange: 'orange/amber accent tones',
}

const IMAGE_CONSTRAINT_SUFFIX =
  'Photorealistic, high quality, natural lighting. Absolutely no text, no letters, no words, ' +
  'no logos, no watermarks anywhere in the image — a supporting photo only, not a finished ad.'

interface GenerateContentImageInput {
  brandId: string
  runId: string
  imagePrompt: string
  photoEmotion?: string
  colorAccent?: string
}

// Called from create-todays-content's finalize hook — not a WorkflowStep, since every step
// must go through runAgent (Claude-only, by design). Never throws: an image failure must not
// fail the whole workflow run, same defensive pattern distillMemory uses in the same hook.
export async function generateContentImage(input: GenerateContentImageInput): Promise<string | null> {
  try {
    const styleHints = [
      input.photoEmotion ? PHOTO_EMOTION_STYLE[input.photoEmotion] : undefined,
      input.colorAccent ? COLOR_ACCENT_STYLE[input.colorAccent] : undefined,
    ].filter(Boolean).join(', ')

    const prompt = [input.imagePrompt, styleHints, IMAGE_CONSTRAINT_SUFFIX].filter(Boolean).join('. ')

    const result = await openai.images.generate({
      model: OPENAI_IMAGE_MODEL,
      prompt,
      n: 1,
      size: '1024x1024',
    })

    const b64 = result.data?.[0]?.b64_json
    if (!b64) throw new Error('OpenAI image response had no b64_json')

    const path = `${input.brandId}/${input.runId}.png`
    const { error: uploadError } = await supabaseAdmin.storage
      .from('content-images')
      .upload(path, Buffer.from(b64, 'base64'), { contentType: 'image/png', upsert: true })
    if (uploadError) throw new Error(`Storage upload failed: ${uploadError.message}`)

    const { data: publicUrlData } = supabaseAdmin.storage.from('content-images').getPublicUrl(path)
    return publicUrlData.publicUrl
  } catch (e) {
    console.error('[generateContentImage] failed:', (e as Error).message)
    return null
  }
}
