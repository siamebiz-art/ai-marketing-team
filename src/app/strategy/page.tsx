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

const WORKFLOW_ID = 'brand-strategy-review'

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
  'ceo-advisor': '🧭 CEO Advisor',
  'brand-strategist': '🎯 Brand Strategist',
  'positioning-specialist': '📐 Positioning Specialist',
}

export default function StrategyReview() {
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
        body: JSON.stringify({ brandSlug, workflowId: WORKFLOW_ID, input: {} }),
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

  const isCompleted = result?.run.status === 'completed'

  return (
    <main style={{ minHeight: '100vh', background: bg, color: text, fontFamily: "'Inter', 'Sarabun', sans-serif" }}>
      <div style={{ borderBottom: `1px solid ${border}`, padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800 }}>🧭 Brand Strategy Review</div>
          <div style={{ fontSize: 11, color: text2, letterSpacing: 1, fontWeight: 600 }}>
            POWERED BY MATE<sup style={{ fontSize: 8 }}>™</sup> ENGINE
          </div>
        </div>
        <Link href="/dashboard" style={{ fontSize: 12, color: text2, fontWeight: 600, textDecoration: 'none' }}>← Command Center</Link>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ fontSize: 13, color: text2, marginBottom: 20, lineHeight: 1.6 }}>
          CEO Advisor → Brand Strategist → Positioning Specialist วิเคราะห์ทิศทางแบรนด์ในภาพรวม
          ผลลัพธ์จะถูกบันทึกลง AI Memory ของแบรนด์ทันที และมีผลต่อคอนเทนต์ทุกชิ้นที่สร้างต่อจากนี้โดยอัตโนมัติ —
          ไม่มีการอนุมัติ ไม่มีการเผยแพร่ เป็นแค่ทิศทางภายใน
        </div>

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

        <button
          onClick={runWorkflow}
          disabled={loading || !brandSlug}
          style={{
            padding: '10px 22px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: loading ? 'default' : 'pointer',
            border: 'none', background: loading ? bg3 : `linear-gradient(135deg, ${purple}, ${pink})`, color: '#fff', marginBottom: 24,
          }}
        >{loading ? 'Working…' : 'Run Strategy Review'}</button>

        {errorMsg && (
          <div style={{ marginBottom: 16, padding: 12, borderRadius: 8, background: `${red}15`, border: `1px solid ${red}40`, color: red, fontSize: 13 }}>
            {errorMsg}
          </div>
        )}

        {result?.steps.map((step) => step.output && (
          <div key={step.id} style={{ background: bg2, border: `1px solid ${border}`, borderRadius: 12, padding: 16, marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: text2, marginBottom: 6 }}>{STEP_LABELS[step.agent_id] ?? step.agent_id}</div>
            <pre style={{ fontSize: 12, color: text, whiteSpace: 'pre-wrap', margin: 0, fontFamily: 'inherit' }}>
              {JSON.stringify(step.output, null, 2)}
            </pre>
          </div>
        ))}

        {isCompleted && (
          <div style={{ background: `${green}15`, border: `1px solid ${green}55`, borderRadius: 12, padding: 16, textAlign: 'center', fontSize: 13, fontWeight: 600, color: green }}>
            ✓ บันทึกทิศทางแบรนด์ลง AI Memory แล้ว — คอนเทนต์ที่สร้างต่อจากนี้จะอ้างอิงทิศทางนี้โดยอัตโนมัติ
          </div>
        )}
      </div>
    </main>
  )
}
