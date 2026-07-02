import { NextResponse } from 'next/server'
import { runWorkflow, getWorkflowRunSteps } from '@/lib/core/orchestrator/runWorkflow'

export const maxDuration = 300

export async function POST(req: Request) {
  const body = await req.json() as { brandSlug?: string; workflowId?: string; input?: unknown }
  if (!body.brandSlug || !body.workflowId) {
    return NextResponse.json({ error: 'brandSlug and workflowId are required' }, { status: 400 })
  }
  try {
    const run = await runWorkflow(body.brandSlug, body.workflowId, body.input ?? {})
    const steps = await getWorkflowRunSteps(run.id)
    return NextResponse.json({ run, steps })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
