'use client'
import React from 'react'
import { useCroquisStore } from '../store/useCroquisStore'
import { MousePointer2, Square, Circle, Minus, BoxSelect } from 'lucide-react'

const tools = [
  { id: 'select', icon: MousePointer2, label: 'Seleccionar' },
  { id: 'rect', icon: Square, label: 'Rectángulo' },
  { id: 'circle', icon: Circle, label: 'Círculo' },
  { id: 'line', icon: Minus, label: 'Línea' },
  { id: 'poly', icon: BoxSelect, label: 'Polígono' },
] as const

export function ShapeSelectionMessage({ dark }: { dark?: boolean }) {
  const doc = useCroquisStore((s) => s.doc)
  const selectedId = useCroquisStore((s) => s.selectedId)
  const selectedShape = selectedId ? (doc.entities as any)[selectedId] : null

  const getShapeLabel = (shape: any): string => {
    if (!shape) return 'Selecciona un objeto en el croquis para asignar valores'
    const type = shape.type
    if (type === 'line' || type === 'svgPolyline') return 'Línea'
    if (type === 'rect' || type === 'svgRect') return 'Rectángulo'
    if (type === 'circle' || type === 'svgCircle') return 'Círculo'
    if (type === 'poly' || type === 'svgPoly') return 'Polígono'
    return 'Objeto'
  }

  return (
    <div className={`text-sm text-center mb-2 w-full ${dark ? 'text-slate-300' : 'text-gray-600 opacity-70'} ${selectedShape ? 'font-semibold' : 'font-normal'}`}>
      {getShapeLabel(selectedShape)}
    </div>
  )
}

export default function ToolPanel() {
  const tool = useCroquisStore((s) => s.tool)
  const setTool = useCroquisStore((s) => s.setTool)
  const areas = useCroquisStore((s) => s.areas)

  // Habilitar herramientas si existe al menos un área
  const canDraw = areas.length > 0

  return (
    <div className="flex gap-1 flex-wrap">
      {tools.map((t) => {
        const Icon = t.icon
        const isActive = tool === t.id
        const disabled = !canDraw && t.id !== 'select'

        return (
          <button
            key={t.id}
            title={t.label}
            disabled={disabled}
            onClick={() => !disabled && setTool(t.id)}
            className={`
                w-10 h-10 flex items-center justify-center rounded-md border transition-all
                ${isActive
                ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }
                ${disabled ? 'opacity-40 cursor-not-allowed grayscale' : 'cursor-pointer'}
              `}
          >
            <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
          </button>
        )
      })}
    </div>
  )
}
