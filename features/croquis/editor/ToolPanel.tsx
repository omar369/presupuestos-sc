'use client'
import { useCroquisStore } from '../store/useCroquisStore'
import type { Tool } from '../core/model'
import SaveCroquisButton from './SaveCroquisButton'

const tools: { id: Tool; label: string }[] = [
  { id: 'select', label: 'Seleccionar' },
  { id: 'rect', label: 'Rect' },
  { id: 'circle', label: 'Circle' },
  { id: 'line', label: 'Line' },
  { id: 'poly', label: 'Poly' },
] as const

export default function ToolPanel() {
  const tool = useCroquisStore((s) => s.tool)
  const setTool = useCroquisStore((s) => s.setTool)

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', width: '100%', maxWidth: '100%' }}>
      {tools.map((t) => (
        <button
          key={t.id}
          onClick={() => setTool(t.id)}
          style={{
            padding: '8px 16px',
            border: '1px solid #e5e7eb',
            background: tool === t.id ? '#111827' : 'white',
            color: tool === t.id ? 'white' : '#111827',
            borderRadius: 10,
            flex: '1 1 auto',
            minWidth: '100px',
            maxWidth: '200px',
            cursor: 'pointer',
          }}
        >
          {t.label}
        </button>
      ))}
      <SaveCroquisButton />
    </div>
  )
}
