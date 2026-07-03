'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Brand { slug: string; name: string }
interface StepRow {
  id: string
  agent_id: string
  status: string
  output: Record<string, unknown> | null
  error: string | null
}
interface RunRow { id: string; status: string; error: string | null }
interface RunResponse { run: RunRow; steps: StepRow[]; error?: string }

const WORKFLOW_ID = 'launch-campaign'

const bg = '#080c18'
const bg2 = '#0d1224'
const bg3 = '#111827'
const border = 'rgba(255, 255, 255, 0.07)'
const border2 = 'rgba(255, 255, 255, 0.13)'
const text = '#f0f4ff'
const text2 = '#94a3b8'
const green = '#10b981'
const red = '#ef4444'
const purple = '#7B3DFF'
const pink = '#FF4D7D'

const STEP_LABELS: Record<string, string> = {
  'research-specialist': '🔍 Research Specialist',
  'campaign-planner': '🗺️ Campaign Planner',
  'content-strategist': '📋 Content Strategist',
  copywriter: '✍️ Copywriter',
  'creative-director': '🎨 Creative Director',
}

export default function Campaigns() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [brandSlug, setBrandSlug] = useState('')
  const [goal, setGoal] = useState('')
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
    if (!goal.trim()) { setErrorMsg('กรุณาระบุเป้าหมายแคมเปญ'); return }
    setLoading(true); setErrorMsg(''); setResult(null)
    try {
      const res = await fetch('/api/workflows/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandSlug, workflowId: WORKFLOW_ID, input: { goal } }),
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

  const plan = result?.steps.find((s) => s.agent_id === 'campaign-planner')?.output as Record<string, unknown> | undefined
  const copy = result?.steps.find((s) => s.agent_id === 'copywriter')?.output as Record<string, unknown> | undefined
  const isAwaitingApproval = result?.run.status === 'awaiting_approval'
  const isCompleted = result?.run.status === 'completed'

  return (
    <main style={{ minHeight: '100vh', background: bg, color: text, fontFamily: "'Inter', 'Sarabun', sans-serif" }}>
      <div style={{ borderBottom: `1px solid ${border}`, padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800 }}>🚀 Launch Campaign</div>
          <div style={{ fontSize: 11, color: text2, letterSpacing: 1, fontWeight: 600 }}>
            POWERED BY MATE<sup style={{ fontSize: 8 }}>™</sup> ENGINE
          </div>
        </div>
        <Link href="/" style={{ fontSize: 12, color: text2, fontWeight: 600, textDecoration: 'none' }}>← Mission Control</Link>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
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

        <textarea
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="เป้าหมายแคมเปญ เช่น 'เปิดตัวฟีเจอร์ใหม่ให้คนเก่าที่เลิกใช้กลับมาลอง' หรือ 'เพิ่มยอดสมัครทดลองใช้ฟรีในไตรมาสนี้'"
          disabled={loading}
          rows={3}
          style={{
            width: '100%', background: bg3, border: `1px solid ${border2}`, borderRadius: 10,
            padding: 12, color: text, fontSize: 13, marginBottom: 12, fontFamily: 'inherit', resize: 'vertical',
          }}
        />

        <button
          onClick={runWorkflow}
          disabled={loading || !brandSlug}
          style={{
            padding: '10px 22px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: loading ? 'default' : 'pointer',
            border: 'none', background: loading ? bg3 : `linear-gradient(135deg, ${purple}, ${pink})`, color: '#fff', marginBottom: 24,
          }}
        >{loading ? 'Working…' : 'Launch Campaign'}</button>

        {errorMsg && (
          <div style={{ marginBottom: 16, padding: 12, borderRadius: 8, background: `${red}15`, border: `1px solid ${red}40`, color: red, fontSize: 13 }}>
            {errorMsg}
          </div>
        )}

        {result?.steps.map((step) => step.output && (
          <div key={step.id} style={{ background: bg2, border: `1px solid ${border}`, borderRadius: 12, padding: 16, marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: text2, marginBottom: 6 }}>{STEP_LABELS[step.agent_id] ?? step.agent_id}</div>
            {step.agent_id === 'campaign-planner' && (
              <div style={{ fontSize: 13 }}>
                <div><b>Objective:</b> {String((step.output as Record<string, unknown>).objective)}</div>
                <div><b>Channel:</b> {String((step.output as Record<string, unknown>).primaryChannel)} · <b>Timeline:</b> {String((step.output as Record<string, unknown>).timeline)}</div>
              </div>
            )}
            {step.agent_id === 'copywriter' && (
              <div style={{ fontSize: 13, whiteSpace: 'pre-wrap' }}>{String((step.output as Record<string, unknown>).caption)}</div>
            )}
            {step.agent_id !== 'campaign-planner' && step.agent_id !== 'copywriter' && (
              <pre style={{ fontSize: 12, color: text2, whiteSpace: 'pre-wrap', margin: 0 }}>{JSON.stringify(step.output, null, 2)}</pre>
            )}
          </div>
        ))}

        {isAwaitingApproval && copy && (
          <div style={{ background: bg2, border: `1px solid ${pink}55`, borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: pink, marginBottom: 10 }}>⏸ Approval Required</div>
            <button
              onClick={approveAndContinue}
              disabled={loading}
              style={{ padding: '10px 22px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', border: 'none', background: green, color: '#052e1c' }}
            >{loading ? 'Working…' : '✓ Approve & Continue'}</button>
          </div>
        )}

        {isCompleted && (
          <div style={{ background: `${green}15`, border: `1px solid ${green}55`, borderRadius: 12, padding: 16, textAlign: 'center', fontSize: 13, fontWeight: 600, color: green }}>
            ✓ Campaign created — check <a href="/approvals" style={{ color: green }}>Approvals</a> to review the first piece of content
          </div>
        )}

        {plan && Array.isArray(plan.contentPlan) && (
          <div style={{ marginTop: 16, fontSize: 12, color: text2 }}>
            <div style={{ marginBottom: 6, fontWeight: 700 }}>Content plan ideas:</div>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {(plan.contentPlan as string[]).map((idea, i) => <li key={i}>{idea}</li>)}
            </ul>
          </div>
        )}
      </div>
    </main>
  )
}
