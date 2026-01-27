'use client'
import React, { useEffect } from 'react'
import { useCroquisStore } from '../store/useCroquisStore'

// shadcn
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { MousePointer2 } from 'lucide-react'
import { type Actividad, ACTIVIDADES, SERVICE_COLORS } from '../core/actividades'

const SERVICE_TYPES = ['PINTURA', 'ESMALTE', 'SELLO', 'EPOXICO', 'OTROS'] as const
const UNITS = ['M2', 'ML'] as const
const STATES = ['SIN_COMENZAR', 'EN_PROCESO', 'TERMINADO'] as const

type ServiceMeta = {
  tipoServicio: (typeof SERVICE_TYPES)[number]
  unidad: (typeof UNITS)[number]
  cantidad: number
  porcentaje: number
  estado: (typeof STATES)[number]
  actividades?: Actividad[]
  acabadoId?: string
  fechaEntrega?: string
}

const ensureService = (meta: any): ServiceMeta => {
  const s = meta?.service ?? {}
  const pct = Number.isFinite(s.porcentaje) ? Number(s.porcentaje) : 0
  const autoEstado = pct === 0 ? 'SIN_COMENZAR' : pct === 100 ? 'TERMINADO' : 'EN_PROCESO'
  return {
    tipoServicio: (SERVICE_TYPES.includes(s.tipoServicio) ? s.tipoServicio : 'PINTURA') as any,
    unidad: (UNITS.includes(s.unidad) ? s.unidad : 'M2') as any,
    cantidad: Number.isFinite(s.cantidad) ? Number(s.cantidad) : 0,
    actividades: Array.isArray(s.actividades) ? s.actividades : [],
    acabadoId: typeof s.acabadoId === 'string' && s.acabadoId.length ? s.acabadoId : undefined,
    fechaEntrega: typeof s.fechaEntrega === 'string' ? s.fechaEntrega : '',
    porcentaje: Math.max(0, Math.min(100, pct)),
    estado: (STATES.includes(s.estado) ? s.estado : autoEstado) as any,
  }
}

const normalizeDate = (v: string) => v.replace(/[^\d/]/g, '').slice(0, 8)

export default function InspectorPanel() {
  const doc = useCroquisStore((s) => s.doc)
  const selectedId = useCroquisStore((s) => s.selectedId)
  const updateShape = useCroquisStore((s) => s.updateShape)
  const updateShapeStyle = useCroquisStore((s) => s.updateShapeStyle)
  const updateShapeMeta = useCroquisStore((s) => s.updateShapeMeta)
  const deleteSelected = useCroquisStore((s) => s.deleteSelected)
  const duplicateSelected = useCroquisStore((s) => s.duplicateSelected)
  const areas = useCroquisStore((s) => s.areas)

  const sh = selectedId ? (doc.entities as any)[selectedId] : null

  // ✅ hooks SIEMPRE antes de returns
  useEffect(() => {
    if (!sh) return
    const serviceInit = ensureService(sh.meta)
    if (!(sh.meta as any)?.service) updateShapeMeta(sh.id, { service: serviceInit } as any)
  }, [sh?.id, updateShapeMeta])

  // ✅ Área default "A1" si existe y no hay areaId
  useEffect(() => {
    if (!sh) return
    const currentAreaId = (sh.meta as any)?.areaId ?? ''
    if (currentAreaId) return
    const a1 = (areas as any[]).find((a) => (a?.nombre ?? '').trim().toUpperCase() === 'A1')
    if (a1?.id) updateShapeMeta(sh.id, { areaId: a1.id } as any)
  }, [sh?.id, areas, updateShapeMeta])

  if (!sh) return (
    <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-40 italic text-xs gap-2">
      <MousePointer2 className="h-8 w-8 mb-2" />
      Selecciona una figura en el croquis para ver sus detalles.
    </div>
  )

  const isLine = sh.type === 'line' || sh.type === 'svgPolyline'

  const service = ensureService(sh.meta)

  // ✅ Área vive en meta.areaId
  const areaId = (sh.meta as any)?.areaId ?? ''
  const setAreaId = (next: string) => updateShapeMeta(sh.id, { areaId: next } as any)
  const canChooseService = Boolean(areaId)

  // ✅ Color por servicio: Sincronizamos fill y stroke
  const applyServiceColor = (tipo: ServiceMeta['tipoServicio']) => {
    const color = SERVICE_COLORS[tipo]
    if (isLine) {
      return updateShapeStyle(sh.id, { stroke: color })
    }
    return updateShapeStyle(sh.id, { fill: color, stroke: color })
  }

  const setService = (patch: Partial<ServiceMeta>) => {
    if (!canChooseService) return
    const next = { ...ensureService(sh.meta), ...patch }
    const pct = next.porcentaje
    next.estado = pct === 0 ? 'SIN_COMENZAR' : pct === 100 ? 'TERMINADO' : 'EN_PROCESO'
    updateShapeMeta(sh.id, { service: next } as any)
    if (patch.tipoServicio) applyServiceColor(patch.tipoServicio)
  }

  const toggleActividad = (a: Actividad) => {
    if (!canChooseService) return
    const curr = ensureService(sh.meta).actividades ?? []
    const next = curr.includes(a) ? curr.filter((x) => x !== a) : [...curr, a]
    updateShapeMeta(sh.id, { service: { ...ensureService(sh.meta), actividades: next } } as any)
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
        Tipo: <span className="text-gray-600">{sh.type}</span>
      </div>


      {/* ✅ Área (shadcn) */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Área</span>
        <Select value={areaId} onValueChange={(v) => setAreaId(v)}>
          <SelectTrigger className="h-9 bg-slate-800 border-slate-700 text-white">
            <SelectValue placeholder="Elegir área" />
          </SelectTrigger>
          <SelectContent>
            {areas.map((a: any) => (
              <SelectItem key={a.id} value={a.id}>
                {a.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ✅ SERVICIOS (bloqueado si no hay área) */}
      <div className="border border-slate-800 rounded-lg p-3 bg-slate-900/50 flex flex-col gap-2">
        <div className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500">Servicio</div>

        {!canChooseService && (
          <div className="text-xs opacity-70">
            Selecciona un <b>Área</b> primero para habilitar Servicios.
          </div>
        )}

        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-6 flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">Tipo</span>
            <Select disabled={!canChooseService} value={service.tipoServicio} onValueChange={(v) => setService({ tipoServicio: v as any })}>
              <SelectTrigger className="h-9 bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder={canChooseService ? 'Selecciona' : 'Elige un área'} />
              </SelectTrigger>
              <SelectContent>
                {SERVICE_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-3 flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">Unidad</span>
            <Select disabled={!canChooseService} value={service.unidad} onValueChange={(v) => setService({ unidad: v as any })}>
              <SelectTrigger className="h-9 bg-slate-800 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {UNITS.map((u) => (
                  <SelectItem key={u} value={u}>
                    {u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-3 flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">Cantidad</span>
            <Input
              disabled={!canChooseService}
              className="h-9 bg-slate-800 border-slate-700 text-white"
              type="number"
              value={service.cantidad}
              onChange={(e) => setService({ cantidad: Number(e.target.value) })}
            />
          </div>

          <div className="col-span-6 flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">Acabado</span>
            <Input
              disabled={!canChooseService}
              className="h-9 bg-slate-800 border-slate-700 text-white"
              value={service.acabadoId ?? ''}
              onChange={(e) => setService({ acabadoId: e.target.value || undefined })}
              placeholder="acabadoId"
            />
          </div>

          <div className="col-span-3 flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">Entrega</span>
            <Input
              disabled={!canChooseService}
              className="h-9 bg-slate-800 border-slate-700 text-white"
              value={service.fechaEntrega ?? ''}
              onChange={(e) => setService({ fechaEntrega: normalizeDate(e.target.value) })}
              placeholder="dd/mm/aa"
              inputMode="numeric"
            />
          </div>

          <div className="col-span-3 flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">Estado</span>
            <Select value={service.estado} onValueChange={() => { }} disabled>
              <SelectTrigger className="h-9 bg-slate-900 border-slate-800 text-slate-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {canChooseService && service.tipoServicio && (
            <div className="col-span-12 flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Actividades</span>
              <div className="grid grid-cols-2 gap-2">
                {ACTIVIDADES.map((a) => (
                  <label key={a} className="flex items-center gap-2 text-xs text-slate-300">
                    <input
                      type="checkbox"
                      className="accent-blue-500"
                      checked={(service.actividades ?? []).includes(a)}
                      onChange={() => toggleActividad(a)}
                    />
                    {a}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="col-span-12 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-500">Progreso</span>
              <span className="text-xs font-bold text-white">{service.porcentaje}%</span>
            </div>
            <Slider
              value={[service.porcentaje]}
              min={0}
              max={100}
              step={1}
              onValueChange={(v) => setService({ porcentaje: v[0] })}
              disabled={!canChooseService}
            />
          </div>
        </div>
      </div>

      <label className="flex flex-col gap-1 text-[10px] uppercase font-bold tracking-widest text-gray-400">
        <span>Detalles</span>
        <textarea
          value={sh.meta.details}
          onChange={(e) => updateShapeMeta(sh.id, { details: e.target.value })}
          rows={2}
          className="bg-slate-800 border-slate-700 text-white rounded-lg px-2.5 py-1.5 text-sm resize-y focus:ring-1 focus:ring-blue-500 outline-none"
        />
      </label>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => duplicateSelected()} className="px-3 py-2 rounded-lg border border-blue-200 bg-blue-50 text-xs font-bold hover:bg-blue-100 transition-colors">
          Duplicar
        </button>
        <button onClick={() => deleteSelected()} className="px-3 py-2 rounded-lg border border-red-200 bg-red-50 text-xs font-bold hover:bg-red-100 transition-colors">
          Eliminar
        </button>
      </div>
    </div >
  )
}
