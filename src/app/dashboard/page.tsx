'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface BrandRef { slug: string; name: string }
interface Campaign {
  id: string
  name: string
  goal: string
  created_at: string
  brands: BrandRef | null
  contentProduced: number
  contentPlanned: number | null
}
interface ActivityItem {
  id: string
  brand_id: string
  platform: string
  status: string
  created_at: string
  published_at: string | null
  brands: BrandRef | null
}
interface DashboardData {
  pendingApprovalCount: number
  publishedThisWeekCount: number
  activeCampaignCount: number
  activeCampaigns: Campaign[]
  recentActivity: ActivityItem[]
}

const bg = '#080c18'
const bg2 = '#0d1224'
const bg3 = '#111827'
const border = 'rgba(255, 255, 255, 0.07)'
const border2 = 'rgba(255, 255, 255, 0.13)'
const text = '#f0f4ff'
const text2 = '#94a3b8'
const green = '#10b981'
const purple = '#7B3DFF'
const blue = '#3b82f6'
const amber = '#f59e0b'

const STATUS_COLOR: Record<string, string> = {
  draft: text2,
  pending_approval: amber,
  approved: blue,
  published: green,
  rejected: '#ef4444',
}
const STATUS_LABEL: Record<string, string> = {
  draft: 'Draft',
  pending_approval: 'รออนุมัติ',
  approved: 'อนุมัติแล้ว',
  published: 'เผยแพร่แล้ว',
  rejected: 'ปฏิเสธ',
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ background: bg2, border: `1px solid ${border}`, borderRadius: 12, padding: '18px 20px', flex: 1 }}>
      <div style={{ fontSize: 28, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 12, color: text2, marginTop: 4 }}>{label}</div>
    </div>
  )
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    fetch('/api/dashboard').then((r) => r.json()).then(setData)
  }, [])

  return (
    <main style={{ minHeight: '100vh', background: bg, color: text, fontFamily: "'Inter', 'Sarabun', sans-serif" }}>
      <div style={{ borderBottom: `1px solid ${border}`, padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800 }}>🛰️ Command Center</div>
          <div style={{ fontSize: 11, color: text2, letterSpacing: 1, fontWeight: 600 }}>
            POWERED BY MATE<sup style={{ fontSize: 8 }}>™</sup> ENGINE
          </div>
        </div>
        <Link href="/" style={{ fontSize: 12, color: text2, fontWeight: 600, textDecoration: 'none' }}>← Mission Control</Link>
      </div>

      <div style={{ maxWidth: 880, margin: '0 auto', padding: '32px 24px' }}>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
          <StatCard label="รอการอนุมัติ" value={data?.pendingApprovalCount ?? 0} color={amber} />
          <StatCard label="เผยแพร่แล้วสัปดาห์นี้" value={data?.publishedThisWeekCount ?? 0} color={green} />
          <StatCard label="แคมเปญที่กำลังทำงาน" value={data?.activeCampaignCount ?? 0} color={purple} />
        </div>

        {/* Quick actions */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
          <Link href="/approvals" style={{ padding: '8px 16px', borderRadius: 999, fontSize: 12, fontWeight: 600, textDecoration: 'none', background: bg3, border: `1px solid ${border2}`, color: text }}>📋 ไปที่คิวอนุมัติ</Link>
          <Link href="/campaigns" style={{ padding: '8px 16px', borderRadius: 999, fontSize: 12, fontWeight: 600, textDecoration: 'none', background: bg3, border: `1px solid ${border2}`, color: text }}>🚀 เปิดแคมเปญใหม่</Link>
          <Link href="/" style={{ padding: '8px 16px', borderRadius: 999, fontSize: 12, fontWeight: 600, textDecoration: 'none', background: bg3, border: `1px solid ${border2}`, color: text }}>📝 สร้างคอนเทนต์วันนี้</Link>
          <Link href="/strategy" style={{ padding: '8px 16px', borderRadius: 999, fontSize: 12, fontWeight: 600, textDecoration: 'none', background: bg3, border: `1px solid ${border2}`, color: text }}>🧭 ทบทวนทิศทางแบรนด์</Link>
        </div>

        {/* Active campaigns */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: purple, marginBottom: 12 }}>🚀 Campaign Status</div>
          {data && data.activeCampaigns.length === 0 && (
            <div style={{ fontSize: 13, color: text2, padding: '16px 0' }}>ยังไม่มีแคมเปญที่กำลังทำงาน — <Link href="/campaigns" style={{ color: purple }}>เริ่มแคมเปญแรก →</Link></div>
          )}
          {data?.activeCampaigns.map((c) => (
            <div key={c.id} style={{ background: bg2, border: `1px solid ${border}`, borderRadius: 12, padding: 16, marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: text2 }}>{c.brands?.name ?? 'Unknown brand'}</span>
                <span style={{ fontSize: 11, color: text2 }}>{new Date(c.created_at).toLocaleDateString('th-TH')}</span>
              </div>
              <div style={{ fontSize: 13, marginBottom: 8 }}>{c.name}</div>
              <div style={{ fontSize: 12, color: text2 }}>
                คอนเทนต์: {c.contentProduced}{c.contentPlanned ? ` / ${c.contentPlanned} ชิ้นตามแผน` : ' ชิ้น'}
              </div>
            </div>
          ))}
        </div>

        {/* Recent activity / content calendar */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: blue, marginBottom: 12 }}>📅 Recent Activity</div>
          {data?.recentActivity.map((item) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: `1px solid ${border}`, fontSize: 13 }}>
              <span style={{
                fontSize: 10, fontWeight: 700, color: STATUS_COLOR[item.status] ?? text2,
                background: `${STATUS_COLOR[item.status] ?? text2}18`, padding: '3px 8px', borderRadius: 999, whiteSpace: 'nowrap',
              }}>{STATUS_LABEL[item.status] ?? item.status}</span>
              <span style={{ color: text2, flex: 1 }}>{item.brands?.name ?? item.brand_id} · {item.platform}</span>
              <span style={{ color: text2, fontSize: 11 }}>
                {new Date(item.published_at ?? item.created_at).toLocaleDateString('th-TH')}
              </span>
            </div>
          ))}
          {data && data.recentActivity.length === 0 && (
            <div style={{ fontSize: 13, color: text2, padding: '16px 0' }}>ยังไม่มีกิจกรรม</div>
          )}
        </div>

      </div>
    </main>
  )
}
