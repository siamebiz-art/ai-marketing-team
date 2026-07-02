'use client'

import { useEffect, useState } from 'react'

interface BrandRef { slug: string; name: string }
interface ContentApproval {
  id: string
  brand_id: string
  platform: string
  content_type: string
  payload: Record<string, unknown>
  created_at: string
  brands: BrandRef | null
}
interface SupportApproval {
  id: string
  brand_id: string
  question: string
  category: string
  urgency: string
  draft_reply: string
  created_at: string
  brands: BrandRef | null
}

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
const blue = '#3b82f6'

export default function ApprovalsQueue() {
  const [content, setContent] = useState<ContentApproval[]>([])
  const [support, setSupport] = useState<SupportApproval[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/approvals').then((r) => r.json()).then((data) => {
      setContent(data.content ?? [])
      setSupport(data.support ?? [])
      setLoading(false)
    })
  }, [])

  async function act(type: 'content' | 'support', id: string, action: 'approve' | 'reject') {
    setBusyId(id)
    try {
      await fetch('/api/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id, action }),
      })
      if (type === 'content') setContent((prev) => prev.filter((c) => c.id !== id))
      else setSupport((prev) => prev.filter((s) => s.id !== id))
    } finally {
      setBusyId(null)
    }
  }

  const total = content.length + support.length

  return (
    <main style={{ minHeight: '100vh', background: bg, color: text, fontFamily: "'Inter', 'Sarabun', sans-serif" }}>
      <div style={{ borderBottom: `1px solid ${border}`, padding: '20px 32px' }}>
        <div style={{ fontSize: 18, fontWeight: 800 }}>📋 Pending Approval Queue</div>
        <div style={{ fontSize: 11, color: text2, letterSpacing: 1, fontWeight: 600 }}>
          {loading ? 'LOADING…' : `${total} ITEM${total === 1 ? '' : 'S'} WAITING`}
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
        {!loading && total === 0 && (
          <div style={{ textAlign: 'center', color: text2, fontSize: 13, padding: 40 }}>
            ไม่มีอะไรรออนุมัติตอนนี้ 🎉
          </div>
        )}

        {content.length > 0 && (
          <>
            <div style={{ fontSize: 13, fontWeight: 700, color: purple, marginBottom: 12 }}>
              🎨 Marketing Content ({content.length})
            </div>
            {content.map((item) => {
              const payload = item.payload as Record<string, unknown>
              const copy = payload.copywriter as Record<string, unknown> | undefined
              return (
                <div key={item.id} style={{ background: bg2, border: `1px solid ${border}`, borderRadius: 12, padding: 16, marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: text2 }}>{item.brands?.name ?? item.brand_id} · {item.platform}</span>
                    <span style={{ fontSize: 11, color: text2 }}>{new Date(item.created_at).toLocaleString('th-TH')}</span>
                  </div>
                  <div style={{ fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: 14 }}>
                    {String(copy?.caption ?? '')}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => act('content', item.id, 'approve')}
                      disabled={busyId === item.id}
                      style={{ padding: '8px 18px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: 'none', background: green, color: '#052e1c' }}
                    >✓ Approve</button>
                    <button
                      onClick={() => act('content', item.id, 'reject')}
                      disabled={busyId === item.id}
                      style={{ padding: '8px 18px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: `1px solid ${border2}`, background: 'transparent', color: red }}
                    >✕ Reject</button>
                  </div>
                </div>
              )
            })}
          </>
        )}

        {support.length > 0 && (
          <>
            <div style={{ fontSize: 13, fontWeight: 700, color: blue, marginTop: 24, marginBottom: 12 }}>
              🎧 Support Replies ({support.length})
            </div>
            {support.map((item) => (
              <div key={item.id} style={{ background: bg2, border: `1px solid ${border}`, borderRadius: 12, padding: 16, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: text2 }}>{item.brands?.name ?? item.brand_id} · {item.category} · {item.urgency}</span>
                  <span style={{ fontSize: 11, color: text2 }}>{new Date(item.created_at).toLocaleString('th-TH')}</span>
                </div>
                <div style={{ fontSize: 12, color: text2, marginBottom: 8 }}>Q: {item.question}</div>
                <div style={{ fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: 14, background: bg3, borderRadius: 8, padding: 10 }}>
                  {item.draft_reply}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => act('support', item.id, 'approve')}
                    disabled={busyId === item.id}
                    style={{ padding: '8px 18px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: 'none', background: green, color: '#052e1c' }}
                  >✓ Approve</button>
                  <button
                    onClick={() => act('support', item.id, 'reject')}
                    disabled={busyId === item.id}
                    style={{ padding: '8px 18px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: `1px solid ${border2}`, background: 'transparent', color: red }}
                  >✕ Reject</button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </main>
  )
}
