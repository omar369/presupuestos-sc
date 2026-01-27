import { create } from 'zustand'
import { Shape, Tool, uid, defaultMeta } from '../core/model'
import { parseSvgToShapes } from '../editor/svg/parseSvg'
import type { CroquisDocument } from '../core/document'

type Draft = { id: string; type: Shape['type'] } | null

type CroquisState = {
  tool: Tool
  shapes: Shape[]
  selectedId: string | null
  draft: Draft
  doc: CroquisDocument

  setTool: (tool: Tool) => void
  select: (id: string | null) => void

  startDraft: (shape: Shape) => void
  updateDraft: (patch: Partial<Shape>) => void
  commitDraft: () => void
  cancelDraft: () => void

  deleteSelected: () => void
  duplicateSelected: () => void

  updateShape: (id: string, patch: Partial<Shape>) => void
  updateShapeStyle: (id: string, patch: Partial<Shape['style']>) => void
  updateShapeMeta: (id: string, patch: Partial<Shape['meta']>) => void

  insertPolyNode: (id: string) => void
  removePolyNode: (id: string) => void

  background: { url: string; mime: string } | null
  setBackground: (bg: { url: string; mime: string } | null) => void
  bgTransform: { x: number; y: number; scale: number; rotation: number; opacity: number; locked: boolean }
  setBgTransform: (patch: Partial<CroquisState['bgTransform']>) => void
  resetBgTransform: () => void

  importSvgAsLayers: (svgText: string) => void
  toggleGroupVisible: (groupId: string) => void

  svgRoot: {
    viewBox: { x: number; y: number; w: number; h: number }
    x: number
    y: number
    scale: number
  } | null
  setSvgRoot: (patch: Partial<{ x: number; y: number; scale: number }>) => void

  saveCroquis: () => void

  croquisId: string | null
  setCroquisId: (id: string) => void

  trabajoId: string | null
  setTrabajoId: (id: string) => void

  saveLocal: () => void
  loadLocal: () => void

  areas: { id: string; nombre: string; ubicacion: 'INTERIOR' | 'EXTERIOR' }[]
  setAreas: (areas: CroquisState['areas']) => void

  currentAreaId: string | null
  setCurrentAreaId: (id: string | null) => void

  refreshAreas: () => Promise<void>

}

// CREATE STATE DEL CROQUIS
export const useCroquisStore = create<CroquisState>((set, get) => ({
  tool: 'select',
  selectedId: null,
  draft: null,
  shapes: [],
  svgRoot: null,
  doc: {
    id: crypto.randomUUID(),
    docVersion: 1,
    entities: {},
    order: [],
  },

  setTool: (tool) => set({ tool }),
  select: (id) => set({ selectedId: id }),

  startDraft: (shape) => {
    set((s) => ({
      doc: {
        ...s.doc,
        entities: { ...s.doc.entities, [shape.id]: shape },
        order: [...s.doc.order, shape.id],
      },
      draft: { id: shape.id, type: shape.type },
      selectedId: shape.id,
    }))
  },

  updateDraft: (patch) => {
    const d = get().draft
    if (!d) return
    set((s) => ({
      doc: {
        ...s.doc,
        entities: {
          ...s.doc.entities,
          [d.id]: { ...s.doc.entities[d.id], ...patch } as Shape,
        },
      },
    }))
  },

  commitDraft: () => set({ draft: null, tool: 'select' }),

  cancelDraft: () => {
    const d = get().draft
    if (!d) return
    set((s) => ({
      shapes: s.shapes.filter((sh) => sh.id !== d.id),
      draft: null,
      selectedId: null,
      tool: 'select',
    }))
  },

  deleteSelected: () => {
    const id = get().selectedId
    if (!id) return
    set((s) => {
      const next = { ...s.doc.entities }
      delete next[id]
      return {
        doc: { ...s.doc, entities: next, order: s.doc.order.filter((x) => x !== id) },
        selectedId: null,
        draft: s.draft?.id === id ? null : s.draft,
      }
    })
  },

  duplicateSelected: () => {
    const id = get().selectedId
    if (!id) return
    const sh = get().doc.entities[id]
    if (!sh) return
    const copy = { ...sh, id: uid(), x: sh.x + 10, y: sh.y + 10 }
    set((s) => ({
      doc: {
        ...s.doc,
        entities: { ...s.doc.entities, [copy.id]: copy },
        order: [...s.doc.order, copy.id],
      },
      selectedId: copy.id,
    }))
  },

  updateShape: (id, patch) =>
    set((s) => ({
      doc: {
        ...s.doc,
        entities: { ...s.doc.entities, [id]: { ...s.doc.entities[id], ...patch } as Shape },
      },
    })),

  updateShapeStyle: (id, patch) =>
    set((s) => ({
      doc: {
        ...s.doc,
        entities: { ...s.doc.entities, [id]: { ...s.doc.entities[id], style: { ...s.doc.entities[id].style, ...patch } } as Shape },
      },
    })),

  updateShapeMeta: (id, patch) =>
    set((s) => ({
      doc: {
        ...s.doc,
        entities: { ...s.doc.entities, [id]: { ...s.doc.entities[id], meta: { ...s.doc.entities[id].meta, ...patch } } as Shape },
      },
    })),

  insertPolyNode: (id) => {
    const sh = get().shapes.find((sh) => sh.id === id)
    if (!sh || sh.type !== 'poly') return

    const pts = sh.points.slice()
    if (pts.length < 6) return
    const x0 = pts[0], y0 = pts[1]
    const x1 = pts[2], y1 = pts[3]
    const mx = (x0 + x1) / 2
    const my = (y0 + y1) / 2

    pts.splice(2, 0, mx, my)
    set((s) => ({
      shapes: s.shapes.map((x) => (x.id === id ? ({ ...x, points: pts } as any) : x)),
    }))
  },

  removePolyNode: (id) => {
    const sh = get().shapes.find((s) => s.id === id)
    if (!sh || sh.type !== 'poly') return

    const pts = sh.points.slice()
    const verts = pts.length / 2
    if (verts <= 3) return
    pts.splice(2, 2)

    set((s) => ({
      shapes: s.shapes.map((x) => (x.id === id ? ({ ...x, points: pts } as any) : x)),
    }))
  },

  background: null,
  setBackground: (bg) => set({ background: bg }),

  bgTransform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, locked: true },
  setBgTransform: (patch) => set((s) => ({ bgTransform: { ...s.bgTransform, ...patch } })),

  // ✅ bug fix: scale debe resetear a 1, no 0
  resetBgTransform: () =>
    set({ bgTransform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, locked: true } }),

  importSvgAsLayers: (svgText) => {
    const { shapes, viewBox } = parseSvgToShapes(svgText)
    set((s) => ({
      doc: {
        ...s.doc,
        entities: { ...s.doc.entities, ...shapes.reduce((acc, sh) => ({ ...acc, [sh.id]: sh }), {}) },
        order: [...s.doc.order, ...shapes.map((sh) => sh.id)],
      },
      svgRoot: { viewBox, x: 0, y: 0, scale: 1 },
    }))
  },

  toggleGroupVisible: (groupId) =>
    set((s) => ({
      doc: {
        ...s.doc,
        entities: Object.fromEntries(
          Object.entries(s.doc.entities).map(([id, sh]) =>
            'groupId' in sh && sh.groupId === groupId ? [id, { ...sh, visible: !sh.visible } as Shape] : [id, sh]
          )
        ),
      },
    })),

  setSvgRoot: (patch) =>
    set((s) => ({
      svgRoot: s.svgRoot ? { ...s.svgRoot, ...patch } : null,
    })),

  croquisId: null as string | null,
  setCroquisId: (id: string) => set({ croquisId: id }),

  trabajoId: null as string | null,
  setTrabajoId: (id: string) => set({ trabajoId: id }),

  saveCroquis: async () => {
    const { croquisId, doc, background, bgTransform, svgRoot } = get()
    if (!croquisId) return
    const payloadJson = JSON.stringify({ doc, background, bgTransform, svgRoot })
    await fetch(`/api/croquis/${croquisId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payloadJson }),
    })
  },
  saveLocal: () => {
    const doc = get().doc
    localStorage.setItem('croquis:doc', JSON.stringify(doc))
  },
  loadLocal: () => {
    const raw = localStorage.getItem('croquis:doc')
    if (!raw) return
    const doc = JSON.parse(raw)
    set({ doc, selectedId: null, draft: null, tool: 'select' })
  },
  areas: [] as any[],
  setAreas: (areas: any[]) => set({ areas }),

  currentAreaId: null as string | null,
  setCurrentAreaId: (id: string | null) => set({ currentAreaId: id }),

  refreshAreas: async () => {
    const { trabajoId } = get()
    if (!trabajoId) return
    const r = await fetch(`/api/trabajos/${trabajoId}/areas`, { cache: 'no-store' })
    if (!r.ok) return
    const a = await r.json()
    set({ areas: a.areas ?? [] })
  },

}))

// Factories (igual que los tuyos)
export const makeRect = (x: number, y: number): Shape => ({
  id: uid(),
  type: 'rect',
  x, y,
  width: 1,
  height: 1,
  rotation: 0,
  style: { fill: '#60a5fa', stroke: '#111827', strokeWidth: 2 },
  meta: defaultMeta(),
})

export const makeCircle = (x: number, y: number): Shape => ({
  id: uid(),
  type: 'circle',
  x, y,
  radius: 1,
  rotation: 0,
  style: { fill: '#34d399', stroke: '#111827', strokeWidth: 2 },
  meta: defaultMeta(),
})

export const makeLine = (x: number, y: number): Shape => ({
  id: uid(),
  type: 'line',
  x: 0, y: 0,
  points: [x, y, x, y],
  rotation: 0,
  style: { fill: 'transparent', stroke: '#f97316', strokeWidth: 4 },
  meta: defaultMeta(),
})

export const makePoly = (x: number, y: number): Shape => ({
  id: uid(),
  type: 'poly',
  x: 0,
  y: 0,
  rotation: 0,
  points: [x, y, x, y, x, y, x, y],
  closed: true,
  style: { fill: 'transparent', stroke: '#f97316', strokeWidth: 4 },
  meta: defaultMeta(),
})
