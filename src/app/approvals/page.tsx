'use client'

import { useEffect, useState } from 'react'

interface BrandRef { slug: string; name: string }
interface ContentApproval {
  id: string
  brand_id: string
  platform: string
  content_type: string
  status: string
  payload: Record<string, unknown>
  created_at: string
  scheduled_at: string | null
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

// Most content is copywriter-shaped ({ caption, ... }); expand-content-formats produces 3
// other shapes (website-specialist/email-marketing-specialist/video-director) that don't have
// a "caption" — this is the one place both pages need to know how to show each shape's main text.
function primaryText(payload: Record<string, unknown>): string {
  const copy = payload.copywriter as { caption?: string } | undefined
  if (copy?.caption) return copy.caption
  const website = payload['website-specialist'] as { heroHeadline?: string; heroSubheadline?: string } | undefined
  if (website?.heroHeadline) return `${website.heroHeadline}\n${website.heroSubheadline ?? ''}`
  const email = payload['email-marketing-specialist'] as { subject?: string; body?: string } | undefined
  if (email?.subject) return `${email.subject}\n\n${email.body ?? ''}`
  const video = payload['video-director'] as { hook?: string } | undefined
  if (video?.hook) return video.hook
  return JSON.stringify(payload).slice(0, 200)
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
  const [connectedBrandIds, setConnectedBrandIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [errorById, setErrorById] = useState<Record<string, string>>({})
  const [publishedNote, setPublishedNote] = useState<string | null>(null)
  const [scheduleInputById, setScheduleInputById] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch('/api/approvals').then((r) => r.json()).then((data) => {
      setContent(data.content ?? [])
      setSupport(data.support ?? [])
      setConnectedBrandIds(data.connectedBrandIds ?? [])
      setLoading(false)
    })
  }, [])

  async function act(type: 'content' | 'support', id: string, action: 'approve' | 'reject') {
    setBusyId(id)
    try {
      const res = await fetch('/api/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id, action }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Action failed')
      if (type === 'content') {
        if (action === 'reject') setContent((prev) => prev.filter((c) => c.id !== id))
        else setContent((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'approved' } : c)))
      } else {
        setSupport((prev) => prev.filter((s) => s.id !== id))
      }
    } finally {
      setBusyId(null)
    }
  }

  async function publish(id: string) {
    setBusyId(id)
    setErrorById((prev) => ({ ...prev, [id]: '' }))
    try {
      const res = await fetch('/api/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'content', id, action: 'publish' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Publish failed')
      setContent((prev) => prev.filter((c) => c.id !== id))
      setPublishedNote(`✅ โพสต์ขึ้น Facebook แล้ว (post id: ${data.postId})`)
    } catch (e) {
      setErrorById((prev) => ({ ...prev, [id]: (e as Error).message }))
    } finally {
      setBusyId(null)
    }
  }

  async function schedule(id: string) {
    const localValue = scheduleInputById[id]
    if (!localValue) { setErrorById((prev) => ({ ...prev, [id]: 'กรุณาเลือกวันเวลา' })); return }
    setBusyId(id)
    setErrorById((prev) => ({ ...prev, [id]: '' }))
    try {
      const scheduledAt = new Date(localValue).toISOString()
      const res = await fetch('/api/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'content', id, action: 'schedule', scheduledAt }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Schedule failed')
      setContent((prev) => prev.map((c) => (c.id === id ? { ...c, scheduled_at: scheduledAt } : c)))
    } catch (e) {
      setErrorById((prev) => ({ ...prev, [id]: (e as Error).message }))
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
        {publishedNote && (
          <div style={{ marginBottom: 20, padding: 12, borderRadius: 8, background: `${green}15`, border: `1px solid ${green}40`, color: green, fontSize: 13 }}>
            {publishedNote}
          </div>
        )}

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
              const imageUrl = payload.imageUrl as string | null | undefined
              const isApproved = item.status === 'approved'
              const isPublishable = item.content_type === 'post' || item.content_type === 'ad'
              const canPublish = isApproved && isPublishable && item.platform === 'facebook' && connectedBrandIds.includes(item.brand_id)
              return (
                <div key={item.id} style={{ background: bg2, border: `1px solid ${border}`, borderRadius: 12, padding: 16, marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: text2 }}>{item.brands?.name ?? item.brand_id} · {item.platform}</span>
                    <span style={{ fontSize: 11, color: text2 }}>{new Date(item.created_at).toLocaleString('th-TH')}</span>
                  </div>
                  {imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl}
                      alt=""
                      style={{ width: '100%', maxHeight: 320, objectFit: 'cover', borderRadius: 8, marginBottom: 12, border: `1px solid ${border}` }}
                    />
                  )}
                  <div style={{ fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: 14 }}>
                    {primaryText(payload)}
                  </div>
                  {errorById[item.id] && (
                    <div style={{ fontSize: 12, color: red, marginBottom: 10 }}>{errorById[item.id]}</div>
                  )}
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {!isApproved && (
                      <>
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
                      </>
                    )}
                    {isApproved && canPublish && !item.scheduled_at && (
                      <>
                        <button
                          onClick={() => publish(item.id)}
                          disabled={busyId === item.id}
                          style={{ padding: '8px 18px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: 'none', background: blue, color: '#fff' }}
                        >{busyId === item.id ? 'Publishing…' : '📤 Publish to Facebook'}</button>
                        <input
                          type="datetime-local"
                          value={scheduleInputById[item.id] ?? ''}
                          onChange={(e) => setScheduleInputById((prev) => ({ ...prev, [item.id]: e.target.value }))}
                          disabled={busyId === item.id}
                          style={{ background: bg3, border: `1px solid ${border2}`, borderRadius: 8, padding: '6px 10px', fontSize: 12, color: text, fontFamily: 'inherit' }}
                        />
                        <button
                          onClick={() => schedule(item.id)}
                          disabled={busyId === item.id}
                          style={{ padding: '8px 18px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: `1px solid ${border2}`, background: 'transparent', color: text }}
                        >🕒 Schedule</button>
                      </>
                    )}
                    {isApproved && canPublish && item.scheduled_at && (
                      <span style={{ fontSize: 12, color: text2 }}>🕒 ตั้งเวลาโพสต์ไว้: {new Date(item.scheduled_at).toLocaleString('th-TH')}</span>
                    )}
                    {isApproved && !canPublish && (
                      <span style={{ fontSize: 12, color: text2 }}>✓ อนุมัติแล้ว — ยังไม่ได้เชื่อมต่อช่องทางเผยแพร่</span>
                    )}
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
