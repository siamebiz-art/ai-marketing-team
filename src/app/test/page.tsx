'use client'

import { useEffect, useState } from 'react'

interface Brand { slug: string; name: string }
interface StepRow {
  id: string
  agent_id: string
  status: string
  input: unknown
  output: unknown
  usage: { cache_read_input_tokens?: number; cache_creation_input_tokens?: number }
  error: string | null
}
interface RunRow { id: string; status: string; error: string | null }
interface RunResponse { run: RunRow; steps: StepRow[]; error?: string }

const WORKFLOW_ID = 'create-todays-content'

export default function TestPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [brandSlug, setBrandSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<RunResponse | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    fetch('/api/brands').then((r) => r.json()).then((data) => {
      setBrands(data.brands ?? [])
      if (data.brands?.[0]) setBrandSlug(data.brands[0].slug)
    })
  }, [])

  async function runWorkflow() {
    setLoading(true); setErrorMsg(''); setResult(null)
    try {
      const res = await fetch('/api/workflows/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandSlug, workflowId: WORKFLOW_ID }),
      })
      const data: RunResponse = await res.json()
      if (!res.ok) throw new Error(data.error || 'Workflow run failed')
      setResult(data)
    } catch (e) {
      setErrorMsg((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  async function approveAndContinue() {
    if (!result) return
    setLoading(true); setErrorMsg('')
    try {
      const res = await fetch('/api/workflows/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ runId: result.run.id }),
      })
      const data: RunResponse = await res.json()
      if (!res.ok) throw new Error(data.error || 'Approve failed')
      setResult(data)
    } catch (e) {
      setErrorMsg((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: 24, fontFamily: 'monospace' }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>AI Marketing Team™ — Workflow Test</h1>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <select value={brandSlug} onChange={(e) => setBrandSlug(e.target.value)}>
          {brands.map((b) => (
            <option key={b.slug} value={b.slug}>{b.name} ({b.slug})</option>
          ))}
        </select>
        <button onClick={runWorkflow} disabled={loading || !brandSlug}>
          {loading ? 'Running…' : `Run "${WORKFLOW_ID}"`}
        </button>
        {result?.run.status === 'awaiting_approval' && (
          <button onClick={approveAndContinue} disabled={loading}>
            {loading ? 'Working…' : 'Approve & Continue'}
          </button>
        )}
      </div>

      {errorMsg && <p style={{ color: 'red' }}>Error: {errorMsg}</p>}

      {result && (
        <>
          <p>Run <b>{result.run.id}</b> — status: <b>{result.run.status}</b></p>
          {result.steps.map((step) => (
            <details key={step.id} open style={{ marginBottom: 8, border: '1px solid #ccc', padding: 8 }}>
              <summary>
                {step.agent_id} — {step.status}
                {step.usage?.cache_read_input_tokens ? ` (cache_read: ${step.usage.cache_read_input_tokens})` : ''}
              </summary>
              <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>
                {JSON.stringify({ input: step.input, output: step.output, error: step.error }, null, 2)}
              </pre>
            </details>
          ))}
        </>
      )}
    </main>
  )
}
