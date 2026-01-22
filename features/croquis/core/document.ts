import { Shape, Tool } from "./model"

export type ServiceType = 'PINTURA' | 'ESMALTE' | 'SELLO' | 'EPOXICO' | 'OTROS'
export type ProgressState = 'SIN_COMENZAR' | 'EN_PROCESO' | 'TERMINADO'
export type MeasureUnit = 'M2' | 'ML'

export type ShapeKind =
    | 'rect' | 'circle' | 'line' | 'poly'
    | 'svgRect' | 'svgCircle' | 'svgPoly' | 'svgPolyline' | 'svgPath'

export type Style = {
    fill?: string
    stroke?: string
    strokeWidth?: number
    textureId?: string
    opacity?: number
}

export type ServiceProps = {
    tipoServicio: ServiceType
    unidad: MeasureUnit
    cantidad: number
    acabadoId?: string
    fechaEntrega?: string
    porcentaje: number
    estado: ProgressState
}

export type Meta = {
    sectionKey?: string
    details?: string
}

export type SvgSource = { source: 'svg'; groupId?: string; elementId?: string }
export type UserSource = { source: 'user' }
export type Source = SvgSource | UserSource

export type BaseGeom = { x: number; y: number; rotation: number }

export type RectGeom = BaseGeom & { kind: 'rect' | 'svgRect'; width: number; height: number }
export type CircleGeom = BaseGeom & { kind: 'circle' | 'svgCircle'; radius: number }
export type LineGeom = BaseGeom & { kind: 'line' | 'svgPolyline'; points: number[] }
export type PolyGeom = BaseGeom & { kind: 'poly' | 'svgPoly'; points: number[]; closed: true }
export type PathGeom = BaseGeom & { kind: 'svgPath'; data: string }

export type Geom = RectGeom | CircleGeom | LineGeom | PolyGeom | PathGeom

export type ShapeEntity = {
    id: string
    kind: ShapeKind
    geom: Geom
    style: Style
    meta: Meta
    service: ServiceProps
    source: Source
    createdAt: string
    updatedAt: string
}

export type CroquisDocument = {
    id: string
    docVersion: 1
    name?: string
    entities: Record<string, Shape>
    order: string[]
}

export type CroquisUIState = {
    tool: Tool
    selectedId: string | null
    draftId: string | null
}