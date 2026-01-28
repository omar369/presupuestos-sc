export type Tool = 'select' | 'move' | 'rect' | 'circle' | 'line' | 'poly' | 'pan'
export type ShapeType = 'rect' | 'circle' | 'line' | 'poly' | 'svgRect' | 'svgPoly' | 'svgPath' | 'svgCircle' | 'svgPolyline'

export type SvgCommon = {
  groupId: string
  visible: boolean
  locked: boolean
}

export type SvgRectShape = BaseShape & SvgCommon & {
  type: 'svgRect'
  x: number
  y: number
  width: number
  height: number
  opacity?: number
}


export type SvgPolyShape = BaseShape & SvgCommon & {
  type: 'svgPoly'
  points: number[]
  closed: true
  opacity?: number
}

export type SvgPathShape = BaseShape & SvgCommon & {
  type: 'svgPath'
  data: string
  opacity?: number
}

export type SvgCircleShape = BaseShape & SvgCommon & {
  type: 'svgCircle'
  x: number
  y: number
  radius: number
  opacity?: number
}

export type SvgPolylineShape = BaseShape & SvgCommon & {
  type: 'svgPolyline'
  points: number[]
  opacity?: number
}


export type ShapeStyle = {
  fill: string
  stroke: string
  strokeWidth: number
  textureId?: string
}

export type ShapeMeta = {
  sectionId: string
  metros: number
  details: string
}

export type BaseShape = {
  id: string
  type: ShapeType
  x: number
  y: number
  rotation: number
  style: ShapeStyle
  meta: ShapeMeta
}

export type RectShape = BaseShape & { type: 'rect'; width: number; height: number }
export type CircleShape = BaseShape & { type: 'circle'; radius: number }
export type LineShape = BaseShape & { type: 'line'; points: number[] }
export type PolyShape = BaseShape & { type: 'poly'; points: number[]; closed: boolean }

export type Shape = RectShape | CircleShape | LineShape | PolyShape | SvgRectShape | SvgPolyShape | SvgPathShape | SvgCircleShape | SvgPolylineShape

export const defaultMeta = (): ShapeMeta => ({ sectionId: '', metros: 0, details: '' })

export const uid = () => (globalThis.crypto.randomUUID?.() ?? `id_${Math.random().toString(16).slice(2)}`)
