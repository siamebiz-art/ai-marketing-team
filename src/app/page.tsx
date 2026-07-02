'use client'

import { useEffect, useState } from 'react'

interface Brand { slug: string; name: string }
interface StepRow {
  id: string
  agent_id: string
  status: string
  input: unknown
  output: Record<string, unknown> | null
  usage: { cache_read_input_tokens?: number }
  error: string | null
}
interface RunRow { id: string; status: string; error: string | null }
interface RunResponse { run: RunRow; steps: StepRow[]; error?: string }

const WORKFLOW_ID = 'create-todays-content'

const PIPELINE = [
  { id: 'strategy', label: 'Strategy Agent', emoji: '\u{1F9E0}', color: '#7B3DFF' },
  { id: 'content-strategist', label: 'Content Strategist', emoji: '\u{1F4CB}', color: '#FF4D7D' },
  { id: 'copywriter', label: 'Copywriter', emoji: '\u{270D}\u{FE0F}', color: '#FF9A00' },
  { id: 'creative-director', label: 'Creative Director', emoji: '\u{1F3A8}', color: '#3b82f6' },
  { id: 'analytics-specialist', label: 'Analytics Specialist', emoji: '\u{1F4CA}', color: '#f59e0b' },
] as const

const bg = '#080c18'
const bg2 = '#0d1224'
const bg3 = '#111827'
const bg4 = '#162034'
const border = 'rgba(255, 255, 255, 0.07)'
const border2 = 'rgba(255, 255, 255, 0.13)'
const text = '#f0f4ff'
const text2 = '#94a3b8'
const text3 = '#64748b'
const green = '#10b981'
const red = '#ef4444'
const purple = '#7B3DFF'
const pink = '#FF4D7D'
const brandGradient = 'linear-gradient(135deg, #7B3DFF, #FF4D7D)'

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pending', color: text3 },
    running: { label: 'Running…', color: purple },
    completed: { label: 'Done', color: green },
    failed: { label: 'Failed', color: red },
  }
  const s = map[status] ?? map.pending
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, color: s.color, border: `1px solid ${s.color}55`,
      borderRadius: 999, padding: '2px 10px', letterSpacing: 0.3,
    }}>{s.label}</span>
  )
}

function stepStatusFor(agentId: string, steps: StepRow[]): string {
  return steps.find((s) => s.agent_id === agentId)?.status ?? 'pending'
}

function outputPreview(agentId: string, output: Record<string, unknown> | null | undefined): string {
  if (!output) return ''
  const o = output as Record<string, unknown>
  if (agentId === 'strategy') return String(o.insight ?? '')
  if (agentId === 'content-strategist') return `${o.platform} · ${o.templateType} — ${o.rationale}`
  if (agentId === 'copywriter') return String(o.caption ?? '')
  if (agentId === 'creative-director') return `${o.headline}`
  if (agentId === 'analytics-specialist') return String(o.tip ?? '')
  return JSON.stringify(o)
}

export default function MissionControl() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [brandSlug, setBrandSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<RunResponse | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

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

  const steps = result?.steps ?? []
  const copywriterStep = steps.find((s) => s.agent_id === 'copywriter')
  const isRunning = loading
  const isAwaitingApproval = result?.run.status === 'awaiting_approval'
  const isCompleted = result?.run.status === 'completed'

  return (
    <main style={{ minHeight: '100vh', background: bg, color: text, fontFamily: "'Inter', 'Sarabun', sans-serif" }}>
      {/* Top bar */}
      <div style={{
        borderBottom: `1px solid ${border}`, padding: '20px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, background: brandGradient,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800,
          }}>A</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: 0.2 }}>AMOS<sup style={{ fontSize: 10 }}>™</sup> Mission Control</div>
            <div style={{ fontSize: 11, color: text2, letterSpacing: 1, fontWeight: 600 }}>AI MARKETING TEAM — MULTI-BRAND ENGINE</div>
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, background: bg3, border: `1px solid ${border2}`,
          borderRadius: 999, padding: '6px 14px', fontSize: 12, fontWeight: 600, color: green,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: 999, background: green, display: 'inline-block' }} />
          AI Marketing Team Ready
        </div>
      </div>

      <div style={{ maxWidth: 880, margin: '0 auto', padding: '32px 24px' }}>
        {/* Brand selector */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
          {brands.map((b) => (
            <button
              key={b.slug}
              onClick={() => setBrandSlug(b.slug)}
              disabled={loading}
              style={{
                padding: '8px 16px', borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                border: `1px solid ${brandSlug === b.slug ? purple : border2}`,
                background: brandSlug === b.slug ? `${purple}22` : bg3,
                color: brandSlug === b.slug ? '#fff' : text2,
              }}
            >{b.name}</button>
          ))}
        </div>

        {/* Run panel */}
        <div style={{ background: bg2, border: `1px solid ${border}`, borderRadius: 16, padding: 24, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>Create Today&apos;s Content</div>
              <div style={{ fontSize: 12, color: text2 }}>5 AI specialists, one approval gate, brand-scoped Marketing Brain</div>
            </div>
            <button
              onClick={runWorkflow}
              disabled={loading || !brandSlug}
              style={{
                padding: '10px 22px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: loading ? 'default' : 'pointer',
                border: 'none', background: loading ? bg4 : brandGradient, color: '#fff', opacity: loading ? 0.7 : 1,
              }}
            >{isRunning ? 'Running…' : result ? 'Run Again' : 'Run Workflow'}</button>
          </div>

          {/* Pipeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {PIPELINE.map((agent) => {
              const status = stepStatusFor(agent.id, steps)
              const step = steps.find((s) => s.agent_id === agent.id)
              const isOpen = expanded === agent.id
              return (
                <div key={agent.id} style={{ border: `1px solid ${border}`, borderRadius: 10, overflow: 'hidden' }}>
                  <div
                    onClick={() => step?.output && setExpanded(isOpen ? null : agent.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                      background: bg3, cursor: step?.output ? 'pointer' : 'default',
                    }}
                  >
                    <span style={{
                      width: 30, height: 30, borderRadius: 8, background: `${agent.color}22`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
                    }}>{agent.emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{agent.label}</div>
                      {step?.output && !isOpen && (
                        <div style={{ fontSize: 11, color: text2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {outputPreview(agent.id, step.output)}
                        </div>
                      )}
                    </div>
                    <StatusBadge status={status} />
                  </div>
                  {isOpen && step?.output && (
                    <div style={{ padding: '12px 14px', background: bg, borderTop: `1px solid ${border}`, fontSize: 12, color: text2, whiteSpace: 'pre-wrap' }}>
                      {JSON.stringify(step.output, null, 2)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {errorMsg && (
            <div style={{ marginTop: 16, padding: 12, borderRadius: 8, background: `${red}15`, border: `1px solid ${red}40`, color: red, fontSize: 13 }}>
              {errorMsg}
            </div>
          )}
        </div>

        {/* Approval gate */}
        {isAwaitingApproval && copywriterStep?.output && (
          <div style={{ background: bg2, border: `1px solid ${pink}55`, borderRadius: 16, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: pink, marginBottom: 12 }}>⏸ Approval Required</div>
            <div style={{ fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: 10 }}>
              {String((copywriterStep.output as Record<string, unknown>).caption ?? '')}
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
              {((copywriterStep.output as Record<string, unknown>).hashtags as string[] | undefined ?? []).map((h) => (
                <span key={h} style={{ fontSize: 11, color: purple, background: `${purple}18`, borderRadius: 999, padding: '3px 10px' }}>{h}</span>
              ))}
            </div>
            <button
              onClick={approveAndContinue}
              disabled={loading}
              style={{
                padding: '10px 22px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                border: 'none', background: green, color: '#052e1c',
              }}
            >{loading ? 'Working…' : '✓ Approve & Continue'}</button>
          </div>
        )}

        {isCompleted && (
          <div style={{ background: `${green}15`, border: `1px solid ${green}55`, borderRadius: 16, padding: 20, textAlign: 'center', fontSize: 13, fontWeight: 600, color: green }}>
            ✓ Workflow complete — content saved to Marketing Brain
          </div>
        )}
      </div>
    </main>
  )
}
