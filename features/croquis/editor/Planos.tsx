'use client'
import * as React from 'react'
import dynamic from 'next/dynamic'
import ToolPanel, { ShapeSelectionMessage } from './ToolPanel'
import InspectorPanel from './InspectorPanel'
import UploadBackground from './UploadBackground'
import CroquisToolbar from './CroquisToolbar'
import { PageBreadcrumb } from "@/components/PageBreadcrumb"
import { useCroquisStore } from '../store/useCroquisStore'

const CanvasStage = dynamic(() => import('./CanvasStage'), { ssr: false })

type CroquisPayload = { doc: any; background: any; bgTransform: any; svgRoot: any }

export default function Planos({ croquisId, croquisName }: { croquisId: string, croquisName?: string }) {
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
    <main style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Breadcrumbs & Toolbar wrapper */}
      <div className="flex flex-col border-b border-gray-200 bg-white shadow-sm">
        <div className="px-5 pt-4">
          <PageBreadcrumb
            segments={[
              { label: 'Trabajos', href: '/herramientas/trabajos' },
              { label: 'Croquis' }
            ]}
          />
        </div>
        <CroquisToolbar croquisId={croquisId} />
      </div>

      {/* Canvas */}
      <section style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        <CanvasStage />
      </section>

      {/* Bottom Panel (Dark Theme) */}
      <section
        style={{
          height: '240px',
          padding: '20px',
          backgroundColor: '#0f172a', // Gris muy oscuro con toque de azul (Slate 900)
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxShadow: '0 -10px 15px -3px rgb(0 0 0 / 0.1)',
          color: '#f8fafc',
        }}
      >
        <div className="w-full">
          <ShapeSelectionMessage dark />
        </div>

        <div className="flex gap-8 h-full min-h-0">
          {/* Col Izquierda: Creación y Carga */}
          <div className="flex flex-col gap-4 w-1/4 min-w-[220px] border-r border-slate-800 pr-8">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em]">Herramientas</span>
              <ToolPanel />
            </div>

            <div className="flex flex-col gap-2 mt-auto">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em]">Fondo del Plano</span>
              <UploadBackground dark />
            </div>
          </div>

          {/* Col Derecha: Inspector */}
          <div className="flex-1 overflow-auto pr-2 custom-scrollbar">
            <div className="flex flex-col gap-2 h-full">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em]">Configuración de Figura</span>
              <InspectorPanel />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
