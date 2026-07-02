'use client'

import { useEffect, useState } from 'react'

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

const WORKFLOW_ID = 'answer-support-ticket'

const bg = '#080c18'
const bg2 = '#0d1224'
const bg3 = '#111827'
const border = 'rgba(255, 255, 255, 0.07)'
const border2 = 'rgba(255, 255, 255, 0.13)'
const text = '#f0f4ff'
const text2 = '#94a3b8'
const green = '#10b981'
const red = '#ef4444'
const blue = '#3b82f6'

export default function SupportTeam() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [brandSlug, setBrandSlug] = useState('')
  const [question, setQuestion] = useState('')
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
    if (!question.trim()) { setErrorMsg('กรุณาใส่คำถามลูกค้า'); return }
    setLoading(true); setErrorMsg(''); setResult(null)
    try {
      const res = await fetch('/api/workflows/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandSlug, workflowId: WORKFLOW_ID, input: { question } }),
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

  const categorized = result?.steps.find((s) => s.agent_id === 'support-categorizer')?.output
  const written = result?.steps.find((s) => s.agent_id === 'support-writer')?.output
  const isAwaitingApproval = result?.run.status === 'awaiting_approval'
  const isCompleted = result?.run.status === 'completed'

  return (
    <main style={{ minHeight: '100vh', background: bg, color: text, fontFamily: "'Inter', 'Sarabun', sans-serif" }}>
      <div style={{ borderBottom: `1px solid ${border}`, padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800 }}>🎧 AI Support Team</div>
          <div style={{ fontSize: 11, color: text2, letterSpacing: 1, fontWeight: 600 }}>DEPARTMENT #2 — SAME ENGINE, DIFFERENT DOMAIN</div>
        </div>
        <a href="/approvals" style={{ fontSize: 12, color: text2, fontWeight: 600, textDecoration: 'none' }}>📋 Approvals →</a>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {brands.map((b) => (
            <button
              key={b.slug}
              onClick={() => setBrandSlug(b.slug)}
              disabled={loading}
              style={{
                padding: '8px 16px', borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                border: `1px solid ${brandSlug === b.slug ? blue : border2}`,
                background: brandSlug === b.slug ? `${blue}22` : bg3,
                color: brandSlug === b.slug ? '#fff' : text2,
              }}
            >{b.name}</button>
          ))}
        </div>

        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="พิมพ์คำถามลูกค้าที่นี่ เช่น 'ใช้กับ Windows 11 ได้ไหม' หรือ 'ยกเลิกแพ็กเกจยังไง'"
          disabled={loading}
          rows={4}
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
            border: 'none', background: loading ? bg3 : blue, color: '#fff', marginBottom: 24,
          }}
        >{loading ? 'Working…' : 'Draft Reply'}</button>

        {errorMsg && (
          <div style={{ marginBottom: 16, padding: 12, borderRadius: 8, background: `${red}15`, border: `1px solid ${red}40`, color: red, fontSize: 13 }}>
            {errorMsg}
          </div>
        )}

        {categorized && (
          <div style={{ background: bg2, border: `1px solid ${border}`, borderRadius: 12, padding: 16, marginBottom: 16, fontSize: 13 }}>
            <div style={{ color: text2, marginBottom: 4 }}>Support Categorizer</div>
            <div>{String((categorized as Record<string, unknown>).category)} · urgency: {String((categorized as Record<string, unknown>).urgency)}</div>
          </div>
        )}

        {isAwaitingApproval && written && (
          <div style={{ background: bg2, border: `1px solid ${blue}55`, borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: blue, marginBottom: 10 }}>⏸ Review Draft Reply</div>
            <div style={{ fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: 14 }}>
              {String((written as Record<string, unknown>).draftReply ?? '')}
            </div>
            <button
              onClick={approveAndContinue}
              disabled={loading}
              style={{ padding: '10px 22px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', border: 'none', background: green, color: '#052e1c' }}
            >{loading ? 'Working…' : '✓ Approve & Send'}</button>
          </div>
        )}

        {isCompleted && (
          <div style={{ background: `${green}15`, border: `1px solid ${green}55`, borderRadius: 12, padding: 16, textAlign: 'center', fontSize: 13, fontWeight: 600, color: green }}>
            ✓ Ticket saved to support_tickets
          </div>
        )}
      </div>
    </main>
  )
}
