'use client'
import React, { useEffect } from 'react'
import { useCroquisStore } from '../store/useCroquisStore'

// shadcn
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import AddAreaButton from './AddAreaButton'
import { type Actividad, ACTIVIDADES, SERVICE_COLORS } from '../core/actividades'

const SERVICE_TYPES = ['PINTURA', 'ESMALTE', 'SELLO', 'EPOXICO', 'OTROS'] as const
const UNITS = ['M2', 'ML'] as const
const STATES = ['SIN_COMENZAR', 'EN_PROCESO', 'TERMINADO'] as const

function Num({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
}) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="opacity-80">{label}</span>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm"
      />
    </label>
  )
}

function Txt({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="opacity-80">{label}</span>
      <input
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm"
      />
    </label>
  )
}

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
  const insertPolyNode = useCroquisStore((s) => s.insertPolyNode)
  const removePolyNode = useCroquisStore((s) => s.removePolyNode)
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

  if (!sh) return <div className="border border-gray-200 rounded-lg p-2.5 text-xs opacity-70">Selecciona una figura</div>

  const isLine = sh.type === 'line' || sh.type === 'svgPolyline'
  const isRect = sh.type === 'rect' || sh.type === 'svgRect'
  const isCircle = sh.type === 'circle' || sh.type === 'svgCircle'
  const isPoly = sh.type === 'poly' || sh.type === 'svgPoly'

  const service = ensureService(sh.meta)

  // ✅ Área vive en meta.areaId
  const areaId = (sh.meta as any)?.areaId ?? ''
  const setAreaId = (next: string) => updateShapeMeta(sh.id, { areaId: next } as any)
  const canChooseService = Boolean(areaId)

  // ✅ Color por servicio: SOLO fill (no tocamos stroke)
  const applyServiceColor = (tipo: ServiceMeta['tipoServicio']) => {
    const color = SERVICE_COLORS[tipo]
    if (isLine) {
      // líneas no tienen fill real; NO tocamos stroke si no quieres contorno
      // si prefieres que sí cambie para distinguir: cambia a { stroke: color }
      return
    }
    if (isPoly) return updateShapeStyle(sh.id, { fill: color })
    if (isRect || isCircle) return updateShapeStyle(sh.id, { fill: color })
    return updateShapeStyle(sh.id, { fill: color })
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
    <div className="border border-gray-200 rounded-lg p-2.5 flex flex-col gap-2.5 max-w-[520px] w-full">
      <div className="text-xs opacity-70">
        Seleccionado: <b>{sh.type}</b>
      </div>

      <AddAreaButton />

      {/* ✅ Área (shadcn) */}
      <div className="flex flex-col gap-1">
        <span className="text-xs opacity-80">Área</span>
        <Select value={areaId} onValueChange={(v) => setAreaId(v)}>
          <SelectTrigger className="h-9">
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

      {/* Geometría + Estilos + Metadata */}
      <div className="grid grid-cols-12 gap-2">
        {!isLine && (
          <>
            <div className="col-span-3">
              <Num label="X" value={sh.x} onChange={(v) => updateShape(sh.id, { x: v } as any)} />
            </div>
            <div className="col-span-3">
              <Num label="Y" value={sh.y} onChange={(v) => updateShape(sh.id, { y: v } as any)} />
            </div>
            <div className="col-span-6">
              <Num label="Rotación" value={sh.rotation} min={0} max={360} onChange={(v) => updateShape(sh.id, { rotation: v } as any)} />
            </div>
          </>
        )}

        {isRect && (
          <>
            <div className="col-span-6">
              <Num label="Ancho" value={sh.width} min={1} onChange={(v) => updateShape(sh.id, { width: v } as any)} />
            </div>
            <div className="col-span-6">
              <Num label="Alto" value={sh.height} min={1} onChange={(v) => updateShape(sh.id, { height: v } as any)} />
            </div>
          </>
        )}

        {isCircle && (
          <div className="col-span-6">
            <Num label="Radio" value={sh.radius} min={1} onChange={(v) => updateShape(sh.id, { radius: v } as any)} />
          </div>
        )}

        {isPoly && (
          <>
            <div className="col-span-4 text-xs opacity-75 self-end">
              Vértices: <b>{sh.points.length / 2}</b>
            </div>
            <div className="col-span-8 flex gap-2 flex-wrap">
              <button onClick={() => insertPolyNode(sh.id)} className="px-3 py-2 rounded-lg border border-gray-200 text-xs font-bold hover:bg-gray-50 transition-colors">
                + Nodo
              </button>
              <button onClick={() => removePolyNode(sh.id)} className="px-3 py-2 rounded-lg border border-gray-200 text-xs font-bold hover:bg-gray-50 transition-colors">
                - Nodo
              </button>
            </div>
          </>
        )}

        {isLine && (
          <>
            <div className="col-span-3">
              <Num label="x1" value={sh.points[0]} onChange={(v) => updateShape(sh.id, { points: [v, sh.points[1], sh.points[2], sh.points[3]] } as any)} />
            </div>
            <div className="col-span-3">
              <Num label="y1" value={sh.points[1]} onChange={(v) => updateShape(sh.id, { points: [sh.points[0], v, sh.points[2], sh.points[3]] } as any)} />
            </div>
            <div className="col-span-3">
              <Num label="x2" value={sh.points[2]} onChange={(v) => updateShape(sh.id, { points: [sh.points[0], sh.points[1], v, sh.points[3]] } as any)} />
            </div>
            <div className="col-span-3">
              <Num label="y2" value={sh.points[3]} onChange={(v) => updateShape(sh.id, { points: [sh.points[0], sh.points[1], sh.points[2], v] } as any)} />
            </div>
          </>
        )}

        {!isLine && (
          <label className="col-span-3 flex flex-col gap-1 text-xs">
            <span className="opacity-80">Fill</span>
            <input
              type="color"
              value={sh.style.fill || '#000000'}
              onChange={(e) => updateShapeStyle(sh.id, { fill: e.target.value })}
              className="h-9 w-full rounded-lg border border-gray-200"
            />
          </label>
        )}

        <label className="col-span-3 flex flex-col gap-1 text-xs">
          <span className="opacity-80">Stroke</span>
          <input
            type="color"
            value={sh.style.stroke || '#000000'}
            onChange={(e) => updateShapeStyle(sh.id, { stroke: e.target.value })}
            className="h-9 w-full rounded-lg border border-gray-200"
          />
        </label>

        <div className="col-span-3">
          <Num label="Stroke" value={sh.style.strokeWidth} min={1} onChange={(v) => updateShapeStyle(sh.id, { strokeWidth: v })} />
        </div>

        <div className="col-span-6">
          <Txt label="Clave" value={sh.meta.sectionId} onChange={(v) => updateShapeMeta(sh.id, { sectionId: v })} />
        </div>
        <div className="col-span-6">
          <Num label="m²" value={sh.meta.metros} min={0} step={0.01} onChange={(v) => updateShapeMeta(sh.id, { metros: v })} />
        </div>
      </div>

      {/* ✅ SERVICIOS (bloqueado si no hay área) */}
      <div className="border border-gray-200 rounded-lg p-2.5 flex flex-col gap-2">
        <div className="text-xs font-bold">Servicio</div>

        {!canChooseService && (
          <div className="text-xs opacity-70">
            Selecciona un <b>Área</b> primero para habilitar Servicios.
          </div>
        )}

        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-6 flex flex-col gap-1">
            <span className="text-xs opacity-80">Tipo</span>
            <Select disabled={!canChooseService} value={service.tipoServicio} onValueChange={(v) => setService({ tipoServicio: v as any })}>
              <SelectTrigger className="h-9">
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
            <span className="text-xs opacity-80">Unidad</span>
            <Select disabled={!canChooseService} value={service.unidad} onValueChange={(v) => setService({ unidad: v as any })}>
              <SelectTrigger className="h-9">
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
            <span className="text-xs opacity-80">Cantidad</span>
            <Input
              disabled={!canChooseService}
              className="h-9"
              type="number"
              value={service.cantidad}
              onChange={(e) => setService({ cantidad: Number(e.target.value) })}
            />
          </div>

          <div className="col-span-6 flex flex-col gap-1">
            <span className="text-xs opacity-80">Acabado (id)</span>
            <Input
              disabled={!canChooseService}
              className="h-9"
              value={service.acabadoId ?? ''}
              onChange={(e) => setService({ acabadoId: e.target.value || undefined })}
              placeholder="acabadoId"
            />
          </div>

          <div className="col-span-3 flex flex-col gap-1">
            <span className="text-xs opacity-80">Entrega</span>
            <Input
              disabled={!canChooseService}
              className="h-9"
              value={service.fechaEntrega ?? ''}
              onChange={(e) => setService({ fechaEntrega: normalizeDate(e.target.value) })}
              placeholder="dd/mm/aa"
              inputMode="numeric"
            />
          </div>

          <div className="col-span-3 flex flex-col gap-1">
            <span className="text-xs opacity-80">Estado</span>
            <Select value={service.estado} onValueChange={() => { }} disabled>
              <SelectTrigger className="h-9">
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
              <span className="text-xs opacity-80">Actividades</span>
              <div className="grid grid-cols-2 gap-2">
                {ACTIVIDADES.map((a) => (
                  <label key={a} className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
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
              <span className="text-xs opacity-80">Progreso</span>
              <span className="text-xs font-bold">{service.porcentaje}%</span>
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

      <label className="flex flex-col gap-1 text-xs">
        <span className="opacity-80">Detalles</span>
        <textarea
          value={sh.meta.details}
          onChange={(e) => updateShapeMeta(sh.id, { details: e.target.value })}
          rows={2}
          className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm resize-y"
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
    </div>
  )
}
