import { defaultMeta, uid } from '../../core/model'
import type { Shape, SvgRectShape, SvgPolyShape, SvgPathShape, SvgCircleShape, SvgPolylineShape } from '../../core/model'

function parseStyleBlock(svgText: string) {
    const styleMap = new Map<string, Record<string, string>>()
    const m = svgText.match(/<style[^>]*>([\s\S]*?)<\/style>/i)
    if (!m) return styleMap
    const css = m[1]
    const ruleRe = /\.([a-zA-Z0-9_-]+)\s*\{([^}]+)\}/g
    let r: RegExpExecArray | null
    while ((r = ruleRe.exec(css))) {
        const cls = r[1]
        const body = r[2]
        const props: Record<string, string> = {}
        body.split(';').map(s => s.trim()).filter(Boolean).forEach(pair => {
            const [k, v] = pair.split(':').map(x => x.trim())
            if (k && v) props[k] = v
        })
        styleMap.set(cls, props)
    }
    return styleMap
}

function getAttr(el: Element, name: string) {
    return el.getAttribute(name) ?? ''
}

function getPaint(el: Element, styleMap: Map<string, any>) {
    const cls = (getAttr(el, 'class') || '').trim()
    const classStyle = cls ? styleMap.get(cls) : null

    const inlineStyle = (getAttr(el, 'style') || '')
    const inline: Record<string, string> = {}
    inlineStyle.split(';').map(s => s.trim()).filter(Boolean).forEach(pair => {
        const [k, v] = pair.split(':').map(x => x.trim())
        if (k && v) inline[k] = v
    })

    const fill = getAttr(el, 'fill') || inline.fill || classStyle?.fill || 'transparent'
    const stroke = getAttr(el, 'stroke') || inline.stroke || classStyle?.stroke || '#000'
    const opacityStr = getAttr(el, 'opacity') || inline.opacity || classStyle?.opacity || ''
    const opacity = opacityStr ? Number(opacityStr) : undefined

    const strokeWidthStr = getAttr(el, 'stroke-width') || inline['stroke-width'] || classStyle?.['stroke-width'] || '2'
    const strokeWidth = Number(strokeWidthStr) || 2

    return { fill, stroke, strokeWidth, opacity }
}

function pointsToKonva(pointsStr: string) {
    // "x,y x,y ..." -> [x,y,x,y...]
    return pointsStr
        .trim()
        .split(/\s+/)
        .flatMap(p => p.split(','))
        .map(n => Number(n))
        .filter(n => Number.isFinite(n))
}

export function parseSvgToShapes(svgText: string): { shapes: Shape[], viewBox: { x: number, y: number, w: number, h: number } } {
    const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml')
    const styleMap = parseStyleBlock(svgText)

    const shapes: Shape[] = []
    const groups = Array.from(doc.querySelectorAll('g[id]'))

    const svg = doc.querySelector('svg')!
    const vb = (svg.getAttribute('viewBox') || '0 0 0 0').split(/\s+/).map(Number)
    const [vbX, vbY, vbW, vbH] = vb


    for (const g of groups) {
        const groupId = g.getAttribute('id') || 'GROUP'

        // rect
        g.querySelectorAll('rect').forEach((r) => {
            const { fill, stroke, strokeWidth, opacity } = getPaint(r, styleMap)
            shapes.push({
                id: uid(),
                type: 'svgRect',
                groupId,
                visible: true,
                locked: false,
                x: Number(getAttr(r, 'x')) || 0,
                y: Number(getAttr(r, 'y')) || 0,
                width: Number(getAttr(r, 'width')) || 0,
                height: Number(getAttr(r, 'height')) || 0,
                rotation: 0,
                opacity,
                style: { fill, stroke, strokeWidth },
                meta: defaultMeta(),
            } as SvgRectShape)
        })

        // polygon
        g.querySelectorAll('polygon').forEach((p) => {
            const { fill, stroke, strokeWidth, opacity } = getPaint(p, styleMap)
            shapes.push({
                id: uid(),
                type: 'svgPoly',
                groupId,
                visible: true,
                locked: false,
                x: 0,
                y: 0,
                rotation: 0,
                closed: true,
                opacity,
                points: pointsToKonva(getAttr(p, 'points')),
                style: { fill, stroke, strokeWidth },
                meta: defaultMeta(),
            } as SvgPolyShape)
        })

        // path (por si viene)
        g.querySelectorAll('path').forEach((p) => {
            const { fill, stroke, strokeWidth, opacity } = getPaint(p, styleMap)
            shapes.push({
                id: uid(),
                type: 'svgPath',
                groupId,
                visible: true,
                locked: false,
                x: 0,
                y: 0,
                rotation: 0,
                opacity,
                data: getAttr(p, 'd'),
                style: { fill, stroke, strokeWidth },
                meta: defaultMeta(),
            } as SvgPathShape)
        })

        // circle
        g.querySelectorAll('circle').forEach((c) => {
            const { fill, stroke, strokeWidth, opacity } = getPaint(c, styleMap)
            shapes.push({
                id: uid(),
                type: 'svgCircle',
                groupId,
                visible: true,
                locked: false,
                x: Number(getAttr(c, 'cx')) || 0,
                y: Number(getAttr(c, 'cy')) || 0,
                radius: Number(getAttr(c, 'r')) || 0,
                rotation: 0,
                opacity,
                style: { fill, stroke, strokeWidth },
                meta: defaultMeta(),
            } as SvgCircleShape)
        })

        // polyline (si existe)
        g.querySelectorAll('polyline').forEach((p) => {
            const { fill, stroke, strokeWidth, opacity } = getPaint(p, styleMap)
            shapes.push({
                id: uid(),
                type: 'svgPolyline',
                groupId,
                visible: true,
                locked: false,
                x: 0,
                y: 0,
                rotation: 0,
                points: pointsToKonva(getAttr(p, 'points')),
                opacity,
                style: { fill: 'transparent', stroke, strokeWidth },
                meta: defaultMeta(),
            } as SvgPolylineShape)
        })

    }
    return {
        shapes,
        viewBox: { x: vbX, y: vbY, w: vbW, h: vbH },
    }

}
