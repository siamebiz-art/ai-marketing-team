// Shared parseOutput helper for specialists whose output is a single JSON object.
// Strips markdown code fences some models wrap responses in, then extracts the outermost
// {...} block before parsing — mirrors the defensive parsing pattern proven in Toonetic's
// orchestrate route, generalized so every specialist doesn't reimplement it.
export function parseJsonOutput<T>(rawText: string): T {
  const stripped = rawText
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim()
  const match = stripped.match(/\{[\s\S]*\}/)
  if (!match) {
    throw new Error(`Agent returned no JSON object. Raw output: ${rawText.slice(0, 200)}`)
  }
  try {
    return JSON.parse(match[0]) as T
  } catch (e) {
    throw new Error(`Agent returned malformed JSON: ${(e as Error).message}`)
  }
}
