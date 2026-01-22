'use client'
import * as React from 'react'
import dynamic from 'next/dynamic'
import ToolPanel from './ToolPanel'
import InspectorPanel from './InspectorPanel'
import UploadBackground from './UploadBackground'
import { useCroquisStore } from '../store/useCroquisStore'

const CanvasStage = dynamic(() => import('./CanvasStage'), { ssr: false })

type CroquisPayload = { doc: any; background: any; bgTransform: any; svgRoot: any }

export default function Planos({ croquisId }: { croquisId: string }) {
  const setState = useCroquisStore.setState
  const setCroquisId = useCroquisStore((s) => s.setCroquisId)
  const setTrabajoId = useCroquisStore(s => s.setTrabajoId)
  const setAreas = useCroquisStore(s => s.setAreas)

  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => { setCroquisId(croquisId) }, [croquisId, setCroquisId])

  React.useEffect(() => {
    let alive = true
      ; (async () => {
        const res = await fetch(`/api/croquis/${croquisId}`, { cache: 'no-store' })
        if (!res.ok) { if (alive) setLoading(false); return }
        const data = await res.json()
        setTrabajoId(data.croquis.trabajoId)
        const r = await fetch(`/api/trabajos/${data.croquis.trabajoId}/areas`, { cache: 'no-store' })
        if (r.ok) {
          const a = await r.json()
          setAreas(a.areas ?? [])
        }
        const payload: CroquisPayload = JSON.parse(data.croquis.payloadJson)
        if (!alive) return
        setState({ doc: payload.doc, background: payload.background, bgTransform: payload.bgTransform, svgRoot: payload.svgRoot, selectedId: null, draft: null, tool: 'select' })
        setLoading(false)
      })()
    return () => { alive = false }
  }, [croquisId, setState])

  if (loading) return <div className="p-6">Cargando croquis…</div>

  return (
    <main style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <section style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        <CanvasStage />
      </section>

      <section
        style={{
          height: '280px',
          padding: '16px',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <ToolPanel />
        <UploadBackground />
        <InspectorPanel />
      </section>
    </main>
  )
}
