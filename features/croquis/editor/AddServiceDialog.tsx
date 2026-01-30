'use client'
import React, { useState } from 'react'
import { useCroquisStore } from '../store/useCroquisStore'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Plus, Trash2, Copy } from 'lucide-react'
import { type Actividad, ACTIVIDADES, SERVICE_COLORS } from '../core/actividades'
import type { Shape } from '../core/model'
import SaveCroquisButton from './SaveCroquisButton'

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

interface AddServiceDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    selectedShape: Shape | null
    selectedShapes?: Shape[] // Opcional para modo batch
}

export default function AddServiceDialog({ open, onOpenChange, selectedShape, selectedShapes }: AddServiceDialogProps) {
    const [showAddAreaDialog, setShowAddAreaDialog] = useState(false)
    const [newAreaName, setNewAreaName] = useState('')
    const [batchCantidades, setBatchCantidades] = useState<Record<string, number>>({}) // m² por shape en batch mode

    const areas = useCroquisStore((s) => s.areas)
    const trabajoId = useCroquisStore((s) => s.trabajoId)
    const refreshAreas = useCroquisStore((s) => s.refreshAreas)
    const updateShapeMeta = useCroquisStore((s) => s.updateShapeMeta)
    const updateShapeStyle = useCroquisStore((s) => s.updateShapeStyle)
    const deleteSelected = useCroquisStore((s) => s.deleteSelected)
    const duplicateSelected = useCroquisStore((s) => s.duplicateSelected)

    const isBatchMode = selectedShapes && selectedShapes.length > 1
    if (!selectedShape && !isBatchMode) return null

    // Batch mode state
    const [batchAreaId, setBatchAreaId] = useState('')
    const [batchService, setBatchService] = useState<ServiceMeta>({
        tipoServicio: 'PINTURA',
        unidad: 'M2',
        cantidad: 0,
        porcentaje: 0,
        estado: 'SIN_COMENZAR',
        actividades: [],
    })

    // Single shape mode
    const sh = selectedShape
    const isLine = sh ? (sh.type === 'line' || sh.type === 'svgPolyline') : false
    const service = sh ? ensureService(sh.meta) : batchService
    const areaId = sh ? ((sh.meta as any)?.areaId ?? '') : batchAreaId
    const canChooseService = Boolean(areaId)

    const setAreaId = (next: string) => {
        if (isBatchMode) {
            setBatchAreaId(next)
            // Aplicar a todas las shapes
            selectedShapes?.forEach(shape => updateShapeMeta(shape.id, { areaId: next } as any))
        } else if (sh) {
            updateShapeMeta(sh.id, { areaId: next } as any)
        }
    }

    const applyServiceColor = (tipo: ServiceMeta['tipoServicio'], shapeToUpdate?: Shape) => {
        const target = shapeToUpdate || sh
        if (!target) return

        const color = SERVICE_COLORS[tipo]
        const isLineshape = target.type === 'line' || target.type === 'svgPolyline'

        if (isLineshape) {
            return updateShapeStyle(target.id, { stroke: color })
        }
        return updateShapeStyle(target.id, { fill: color, stroke: color })
    }

    const setService = (patch: Partial<ServiceMeta>) => {
        if (!canChooseService) return

        if (isBatchMode) {
            // Modo batch: actualizar estado local
            const next = { ...batchService, ...patch }
            const pct = next.porcentaje
            next.estado = pct === 0 ? 'SIN_COMENZAR' : pct === 100 ? 'TERMINADO' : 'EN_PROCESO'
            setBatchService(next)

            // Aplicar a todas las shapes (sin cantidad individual)
            selectedShapes?.forEach(shape => {
                const shapeMeta = { ...next }
                // Usar cantidad del estado local por shape
                const cantidad = batchCantidades[shape.id] ?? 0
                shapeMeta.cantidad = cantidad
                updateShapeMeta(shape.id, { service: shapeMeta } as any)
                if (patch.tipoServicio) applyServiceColor(patch.tipoServicio, shape)
            })
        } else if (sh) {
            // Modo single
            const next = { ...ensureService(sh.meta), ...patch }
            const pct = next.porcentaje
            next.estado = pct === 0 ? 'SIN_COMENZAR' : pct === 100 ? 'TERMINADO' : 'EN_PROCESO'
            updateShapeMeta(sh.id, { service: next } as any)
            if (patch.tipoServicio) applyServiceColor(patch.tipoServicio)
        }
    }

    const toggleActividad = (a: Actividad) => {
        if (!canChooseService) return

        if (isBatchMode) {
            const curr = batchService.actividades ?? []
            const next = curr.includes(a) ? curr.filter((x) => x !== a) : [...curr, a]
            setBatchService({ ...batchService, actividades: next })

            // Aplicar a todas
            selectedShapes?.forEach(shape => {
                updateShapeMeta(shape.id, { service: { ...ensureService(shape.meta), actividades: next } } as any)
            })
        } else if (sh) {
            const curr = ensureService(sh.meta).actividades ?? []
            const next = curr.includes(a) ? curr.filter((x) => x !== a) : [...curr, a]
            updateShapeMeta(sh.id, { service: { ...ensureService(sh.meta), actividades: next } } as any)
        }
    }

    const handleAddArea = async () => {
        if (!newAreaName.trim() || !trabajoId) return

        const res = await fetch(`/api/trabajos/${trabajoId}/areas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: newAreaName.trim(), notas: '', ubicacion: 'INTERIOR' }),
        })

        if (res.ok) {
            await refreshAreas()
            setShowAddAreaDialog(false)
            setNewAreaName('')
        }
    }

    const handleDelete = () => {
        deleteSelected()
        onOpenChange(false)
    }

    const handleDuplicate = () => {
        duplicateSelected()
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-800 text-white">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-white">Configurar Servicio</AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-400">
                        Configura los detalles del servicio para esta figura.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="flex flex-col gap-4 py-4">
                    {/* ÁREA SELECTOR + CREAR ÁREA */}
                    <div className="flex gap-2">
                        <div className="flex-1 flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-bold text-slate-500">Área</span>
                            <Select value={areaId} onValueChange={setAreaId}>
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

                        <AlertDialog open={showAddAreaDialog} onOpenChange={setShowAddAreaDialog}>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="mt-auto h-9 bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                                >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Crear área
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-slate-900 border-slate-800 text-white">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-white">Agregar nueva área</AlertDialogTitle>
                                    <AlertDialogDescription className="text-slate-400">
                                        Ingresa el nombre del área que deseas agregar.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <Input
                                    value={newAreaName}
                                    onChange={(e) => setNewAreaName(e.target.value)}
                                    placeholder="Nombre del área"
                                    className="bg-slate-800 border-slate-700 text-white"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleAddArea()
                                    }}
                                />
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                                        Cancelar
                                    </AlertDialogCancel>
                                    <AlertDialogAction onClick={handleAddArea} className="bg-blue-600 hover:bg-blue-700">
                                        Crear
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>

                    {!canChooseService && (
                        <div className="text-xs text-slate-400 italic">
                            Selecciona un <b>Área</b> primero para habilitar los campos de servicio.
                        </div>
                    )}

                    {/* SERVICIO FORM */}
                    <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-6 flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-bold text-slate-500">Tipo</span>
                            <Select disabled={!canChooseService} value={service.tipoServicio} onValueChange={(v) => setService({ tipoServicio: v as any })}>
                                <SelectTrigger className="h-9 bg-slate-800 border-slate-700 text-white">
                                    <SelectValue placeholder="Selecciona" />
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
                                disabled={!canChooseService}
                                value={[service.porcentaje]}
                                min={0}
                                max={100}
                                step={1}
                                onValueChange={(v) => setService({ porcentaje: v[0] })}
                            />
                        </div>
                    </div>

                    {/* NOTAS / DETALLES */}
                    {sh && (
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-bold text-slate-500">Notas</span>
                            <textarea
                                value={sh.meta.details}
                                onChange={(e) => updateShapeMeta(sh.id, { details: e.target.value })}
                                rows={3}
                                className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 text-sm resize-y focus:ring-1 focus:ring-blue-500 outline-none"
                                placeholder="Notas adicionales..."
                            />
                        </div>
                    )}

                    {/* ACCORDION CON ACCIONES */}
                    <Accordion type="single" collapsible className="border border-slate-800 rounded-lg">
                        <AccordionItem value="actions" className="border-none">
                            <AccordionTrigger className="px-3 py-2 hover:bg-slate-800/50 text-slate-400 text-sm">
                                Acciones de objeto
                            </AccordionTrigger>
                            <AccordionContent className="px-3 pb-3">
                                <div className="flex flex-col gap-3">
                                    <p className="text-xs text-slate-400 italic">
                                        Estas acciones afectan directamente al objeto seleccionado en el canvas.
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            onClick={handleDuplicate}
                                            variant="outline"
                                            className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                                        >
                                            <Copy className="h-4 w-4 mr-2" />
                                            Duplicar
                                        </Button>
                                        <Button
                                            onClick={handleDelete}
                                            variant="outline"
                                            className="bg-red-900/20 border-red-700 text-red-400 hover:bg-red-900/40"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Eliminar
                                        </Button>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                        Cancelar
                    </AlertDialogCancel>
                    <SaveCroquisButton
                        variant="stay"
                        onAfterSave={() => onOpenChange(false)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Guardar
                    </SaveCroquisButton>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
