import { NextResponse } from 'next/server'
import { approveWorkflowStep } from '@/lib/orchestrator/approveWorkflowStep'
import { getWorkflowRunSteps } from '@/lib/orchestrator/runWorkflow'

export const maxDuration = 300

export async function POST(req: Request) {
  const body = await req.json() as { runId?: string }
  if (!body.runId) return NextResponse.json({ error: 'runId is required' }, { status: 400 })
  try {
    const run = await approveWorkflowStep(body.runId)
    const steps = await getWorkflowRunSteps(run.id)
    return NextResponse.json({ run, steps })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
