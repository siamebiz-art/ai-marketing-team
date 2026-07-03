'use client'

import { useEffect, useState } from 'react'

interface BrandRef { slug: string; name: string }
interface ContentRow {
  id: string
  brand_id: string
  platform: string
  content_type: string
  payload: Record<string, unknown>
  performance: Record<string, unknown>
  published_at: string
  brands: BrandRef | null
}

const bg = '#080c18'
const bg2 = '#0d1224'
const bg3 = '#111827'
const border = 'rgba(255, 255, 255, 0.07)'
const text = '#f0f4ff'
const text2 = '#94a3b8'
const purple = '#7B3DFF'
const blue = '#3b82f6'

export default function PublishedContent() {
  const [content, setContent] = useState<ContentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/content').then((r) => r.json()).then((data) => {
      setContent(data.content ?? [])
      setLoading(false)
    })
  }, [])

  async function refresh(id: string) {
    setBusyId(id)
    try {
      const res = await fetch('/api/content/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      if (res.ok) {
        setContent((prev) => prev.map((c) => (c.id === id ? { ...c, performance: data.performance } : c)))
      }
    } finally {
      setBusyId(null)
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: bg, color: text, fontFamily: "'Inter', 'Sarabun', sans-serif" }}>
      <div style={{ borderBottom: `1px solid ${border}`, padding: '20px 32px' }}>
        <div style={{ fontSize: 18, fontWeight: 800 }}>📊 Published Content</div>
        <div style={{ fontSize: 11, color: text2, letterSpacing: 1, fontWeight: 600 }}>
          POWERED BY MATE<sup style={{ fontSize: 8 }}>™</sup> ENGINE
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
        {!loading && content.length === 0 && (
          <div style={{ textAlign: 'center', color: text2, fontSize: 13, padding: 40 }}>
            ยังไม่มีคอนเทนต์ที่โพสต์จริง
          </div>
        )}

        {content.map((item) => {
          const payload = item.payload as Record<string, unknown>
          const copy = payload.copywriter as Record<string, unknown> | undefined
          const imageUrl = payload.imageUrl as string | null | undefined
          const perf = item.performance as { likes?: number | null; comments?: number | null; shares?: number; fetchedAt?: string; limited?: boolean }
          return (
            <div key={item.id} style={{ background: bg2, border: `1px solid ${border}`, borderRadius: 12, padding: 16, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: text2 }}>{item.brands?.name ?? item.brand_id} · {item.platform}</span>
                <span style={{ fontSize: 11, color: text2 }}>{new Date(item.published_at).toLocaleString('th-TH')}</span>
              </div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                {imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt=""
                    style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8, border: `1px solid ${border}`, flexShrink: 0 }}
                  />
                )}
                <div style={{ fontSize: 13, lineHeight: 1.5, whiteSpace: 'pre-wrap', color: text2 }}>
                  {String(copy?.caption ?? '').slice(0, 160)}{String(copy?.caption ?? '').length > 160 ? '…' : ''}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 13 }}>👍 {perf.likes ?? '—'}</span>
                <span style={{ fontSize: 13 }}>💬 {perf.comments ?? '—'}</span>
                <span style={{ fontSize: 13 }}>🔁 {perf.shares ?? '—'}</span>
                <button
                  onClick={() => refresh(item.id)}
                  disabled={busyId === item.id}
                  style={{ marginLeft: 'auto', padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: `1px solid ${purple}55`, background: bg3, color: purple }}
                >{busyId === item.id ? 'กำลังโหลด…' : '🔄 Refresh Stats'}</button>
                {Boolean(payload.facebookPostId) && (
                  <a href={`https://facebook.com/${String(payload.facebookPostId)}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: blue }}>ดูโพสต์ →</a>
                )}
              </div>
              {perf.fetchedAt && (
                <div style={{ fontSize: 10, color: text2, marginTop: 8 }}>อัปเดตล่าสุด: {new Date(perf.fetchedAt).toLocaleString('th-TH')}</div>
              )}
              {perf.limited && (
                <div style={{ fontSize: 10, color: '#f59e0b', marginTop: 4 }}>
                  ⚠️ ยอดไลก์/คอมเมนต์ดึงไม่ได้ — token ยังไม่มีสิทธิ์ pages_read_user_content (เห็นได้แค่ยอดแชร์ตอนนี้)
                </div>
              )}
            </div>
          )
        })}
      </div>
    </main>
  )
}
