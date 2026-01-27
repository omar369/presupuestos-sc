'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Stage, Layer, Rect, Circle, Line, Transformer, Path, Group, Image as KImage } from 'react-konva'
import { useCroquisStore, makeRect, makeCircle, makeLine, makePoly } from '../store/useCroquisStore'
import type { Shape } from '../core/model'
import { useHtmlImage } from './hooks/useHtmlImage'

function useContainerSize() {
  const ref = useRef<HTMLDivElement | null>(null)
  const [size, setSize] = useState({ w: 800, h: 600 })

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect()
      setSize({ w: Math.max(200, Math.floor(r.width)), h: Math.max(200, Math.floor(r.height)) })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return { ref, size }
}

export default function CanvasStage() {
  const { ref, size } = useContainerSize()
  const trRef = useRef<any>(null)
  const nodeRef = useRef<any>(null)

  const svgRoot = useCroquisStore((s: any) => s.svgRoot)
  const setSvgRoot = useCroquisStore((s: any) => s.setSvgRoot)

  const isSvgShape = (s: any) =>
    typeof s.type === 'string' && s.type.startsWith('svg')


  const tool = useCroquisStore((s) => s.tool)
  const order = useCroquisStore((s) => s.doc.order)
  const entities = useCroquisStore((s) => s.doc.entities)
  const shapes = useMemo(() => order.map(id => entities[id]).filter(Boolean), [order, entities])
  const selectedId = useCroquisStore((s) => s.selectedId)
  const draft = useCroquisStore((s) => s.draft)

  const background = useCroquisStore((s: any) => s.background) as { url: string; mime: string | null }
  const bgImg = useHtmlImage(background?.url)
  const bgT = useCroquisStore((s) => s.bgTransform)
  const setBgT = useCroquisStore((s) => s.setBgTransform)

  const select = useCroquisStore((s) => s.select)
  const startDraft = useCroquisStore((s) => s.startDraft)
  const updateDraft = useCroquisStore((s) => s.updateDraft)
  const commitDraft = useCroquisStore((s) => s.commitDraft)
  const updateShape = useCroquisStore((s) => s.updateShape)

  const startPt = useRef<{ x: number; y: number } | null>(null)

  const selectedShape = useMemo(
    () => shapes.find((s) => s.id === selectedId) ?? null,
    [shapes, selectedId]
  )

  useEffect(() => {
    if (!trRef.current) return
    if (!selectedShape) {
      trRef.current.nodes([])
      trRef.current.getLayer()?.batchDraw()
      return
    }
    // Only attach transformer if the node ref is available
    if (nodeRef.current) {
      trRef.current.nodes([nodeRef.current])
      trRef.current.getLayer()?.batchDraw()
    }
  }, [selectedShape])

  const getPointer = (e: any) => {
    const stage = e.target.getStage()
    const p = stage.getPointerPosition()
    return { x: p?.x ?? 0, y: p?.y ?? 0 }
  }

  const bgFit = useMemo(() => {
    if (!bgImg) return null
    const iw = bgImg.naturalWidth || bgImg.width
    const ih = bgImg.naturalHeight || bgImg.height
    if (!iw || !ih) return null
    const scale = Math.min(size.w / iw, size.h / ih)
    const w = iw * scale
    const h = ih * scale
    return { x: (size.w - w) / 2, y: (size.h - h) / 2, w, h }
  }, [bgImg, size.w, size.h])

  const onDown = (e: any) => {
    if (tool === 'select') {
      const clickedOnEmpty = e.target === e.target.getStage()
      if (clickedOnEmpty) select(null)
      return
    }
    const p = getPointer(e)
    startPt.current = p

    if (tool === 'rect') startDraft(makeRect(p.x, p.y))
    if (tool === 'circle') startDraft(makeCircle(p.x, p.y))
    if (tool === 'line') startDraft(makeLine(p.x, p.y))
    if (tool === 'poly') startDraft(makePoly(p.x, p.y))
  }

  const onMove = (e: any) => {
    if (!draft || !startPt.current) return
    const p0 = startPt.current
    const p = getPointer(e)

    if (draft.type === 'rect') {
      const x = Math.min(p0.x, p.x)
      const y = Math.min(p0.y, p.y)
      const width = Math.max(1, Math.abs(p.x - p0.x))
      const height = Math.max(1, Math.abs(p.y - p0.y))
      updateDraft({ x, y, width, height } as any)
    }

    if (draft.type === 'circle') {
      const r = Math.max(1, Math.hypot(p.x - p0.x, p.y - p0.y))
      updateDraft({ radius: r } as any)
    }

    if (draft.type === 'line') {
      updateDraft({ points: [p0.x, p0.y, p.x, p.y] } as any)
    }

    if (draft.type === 'poly') {
      const x1 = p0.x, y1 = p0.y
      const x2 = p.x, y2 = p.y
      const left = Math.min(x1, x2), right = Math.max(x1, x2)
      const top = Math.min(y1, y2), bottom = Math.max(y1, y2)

      updateDraft({
        points: [left, top, right, top, right, bottom, left, bottom],
        closed: true,
      } as any)
    }

  }

  const onUp = () => {
    if (!draft) return
    startPt.current = null
    commitDraft()
  }

  const renderShape = (sh: Shape) => {
    const isSelected = sh.id === selectedId
    const common = {
      onClick: () => tool === 'select' && select(sh.id),
      onTap: () => tool === 'select' && select(sh.id),
    }

    if (sh.type === 'poly') {
      const isSelected = sh.id === selectedId

      return (
        <React.Fragment key={sh.id}>
          <Line
            {...common}
            points={sh.points}
            closed
            fill={sh.style.fill}
            stroke={isSelected ? '#22C55E' : sh.style.stroke}
            strokeWidth={isSelected ? Math.max(sh.style.strokeWidth, 3) : sh.style.strokeWidth}
            opacity={isSelected ? 1 : 0.3}
            draggable={tool === 'select'} // mover todo el polígono
            onDragEnd={(e) => {
              const dx = e.target.x()
              const dy = e.target.y()
              e.target.position({ x: 0, y: 0 })
              const next = sh.points.map((v, i) => (i % 2 === 0 ? v + dx : v + dy))
              updateShape(sh.id, { points: next } as any)
            }}
          />

          {/* ✅ nodos editables */}
          {isSelected && tool === 'select' &&
            Array.from({ length: sh.points.length / 2 }).map((_, idx) => {
              const i = idx * 2
              return (
                <Circle
                  key={`${sh.id}_h_${i}`}
                  x={sh.points[i]}
                  y={sh.points[i + 1]}
                  radius={7}
                  fill="white"
                  stroke="black"
                  strokeWidth={2}
                  draggable
                  onDragMove={(e) => {
                    const next = sh.points.slice()
                    next[i] = e.target.x()
                    next[i + 1] = e.target.y()
                    updateShape(sh.id, { points: next } as any)
                  }}
                />
              )
            })}
        </React.Fragment>
      )
    }

    if (sh.type === 'svgPath') {
      return (
        <Path
          key={sh.id}
          {...common}
          data={sh.data}
          fill={sh.style.fill}
          stroke={isSelected ? '#22C55E' : sh.style.stroke}
          strokeWidth={isSelected ? Math.max(sh.style.strokeWidth, 3) : sh.style.strokeWidth}
          opacity={isSelected ? 1 : (sh.opacity ?? 0.8)}
          visible={sh.visible}
          draggable={tool === 'select' && !sh.locked}
          onDragEnd={(e) => updateShape(sh.id, { x: e.target.x(), y: e.target.y() } as any)}
          x={sh.x}
          y={sh.y}
        />
      )
    }

    if (sh.type === 'svgCircle') {
      return (
        <Circle
          key={sh.id}
          {...common}
          x={sh.x}
          y={sh.y}
          radius={sh.radius}
          fill={sh.style.fill}
          stroke={isSelected ? '#22C55E' : sh.style.stroke}
          strokeWidth={isSelected ? Math.max(sh.style.strokeWidth, 3) : sh.style.strokeWidth}
          opacity={isSelected ? 1 : (sh.opacity ?? 0.8)}
          visible={sh.visible}
          draggable={tool === 'select' && !sh.locked}
          onDragEnd={(e) => updateShape(sh.id, { x: e.target.x(), y: e.target.y() } as any)}
        />
      )
    }

    if (sh.type === 'svgPoly') {
      return (
        <Line
          key={sh.id}
          {...common}
          points={sh.points}
          closed
          fill={sh.style.fill}
          stroke={isSelected ? '#22C55E' : sh.style.stroke}
          strokeWidth={isSelected ? Math.max(sh.style.strokeWidth, 3) : sh.style.strokeWidth}
          opacity={isSelected ? 1 : (sh.opacity ?? 0.8)}
          visible={sh.visible}
          draggable={tool === 'select' && !sh.locked}
          onDragEnd={(e) => {
            const dx = e.target.x(), dy = e.target.y()
            e.target.position({ x: 0, y: 0 })
            const next = sh.points.map((v, i) => (i % 2 === 0 ? v + dx : v + dy))
            updateShape(sh.id, { points: next } as any)
          }}
        />
      )
    }

    if (sh.type === 'svgPolyline') {
      return (
        <Line
          key={sh.id}
          {...common}
          points={sh.points}
          stroke={isSelected ? '#22C55E' : sh.style.stroke}
          strokeWidth={isSelected ? Math.max(sh.style.strokeWidth, 3) : sh.style.strokeWidth}
          opacity={isSelected ? 1 : (sh.opacity ?? 0.8)}
          visible={sh.visible}
          draggable={tool === 'select' && !sh.locked}
          onDragEnd={(e) => {
            const dx = e.target.x(), dy = e.target.y()
            e.target.position({ x: 0, y: 0 })
            const next = sh.points.map((v, i) => (i % 2 === 0 ? v + dx : v + dy))
            updateShape(sh.id, { points: next } as any)
          }}
        />
      )
    }


    if (sh.type === 'rect') {
      return (
        <Rect
          key={sh.id}
          {...common}
          ref={isSelected ? nodeRef : undefined}
          x={sh.x} y={sh.y} width={sh.width} height={sh.height} rotation={sh.rotation}
          fill={sh.style.fill}
          stroke={isSelected ? '#22C55E' : sh.style.stroke}
          strokeWidth={isSelected ? Math.max(sh.style.strokeWidth, 3) : sh.style.strokeWidth}
          opacity={isSelected ? 1 : 0.8}
          draggable={tool === 'select'}
          onDragEnd={(e) => updateShape(sh.id, { x: e.target.x(), y: e.target.y() } as any)}
          onTransformEnd={(e) => {
            const n = e.target
            const sx = n.scaleX(), sy = n.scaleY()
            n.scaleX(1); n.scaleY(1)
            updateShape(sh.id, {
              x: n.x(), y: n.y(),
              rotation: n.rotation(),
              width: Math.max(20, n.width() * sx),
              height: Math.max(20, n.height() * sy),
            } as any)
          }}
        />
      )
    }

    if (sh.type === 'svgRect') {
      return (
        <Rect
          key={sh.id}
          {...common}
          x={sh.x} y={sh.y} width={sh.width} height={sh.height}
          fill={sh.style.fill}
          stroke={isSelected ? '#22C55E' : sh.style.stroke}
          strokeWidth={isSelected ? Math.max(sh.style.strokeWidth, 3) : sh.style.strokeWidth}
          opacity={isSelected ? 1 : (sh.opacity ?? 0.8)}
          visible={sh.visible}
          draggable={tool === 'select' && !sh.locked}
          onDragEnd={(e) => updateShape(sh.id, { x: e.target.x(), y: e.target.y() } as any)}
        />
      )
    }

    if (sh.type === 'circle') {
      return (
        <Circle
          key={sh.id}
          {...common}
          ref={isSelected ? nodeRef : undefined}
          x={sh.x} y={sh.y} radius={sh.radius} rotation={sh.rotation}
          fill={sh.style.fill}
          stroke={isSelected ? '#22C55E' : sh.style.stroke}
          strokeWidth={isSelected ? Math.max(sh.style.strokeWidth, 3) : sh.style.strokeWidth}
          opacity={isSelected ? 1 : 0.8}
          draggable={tool === 'select'}
          onDragEnd={(e) => updateShape(sh.id, { x: e.target.x(), y: e.target.y() } as any)}
          onTransformEnd={(e) => {
            const n = e.target
            const sx = n.scaleX()
            n.scaleX(1); n.scaleY(1)
            updateShape(sh.id, {
              x: n.x(), y: n.y(),
              rotation: n.rotation(),
              radius: Math.max(10, sh.radius * sx),
            } as any)
          }}
        />
      )
    }

    if (sh.type === 'line') {
      return (
        <Line
          key={sh.id}
          {...common}
          ref={isSelected ? nodeRef : undefined}
          points={sh.points}
          stroke={isSelected ? '#22C55E' : sh.style.stroke}
          strokeWidth={isSelected ? Math.max(sh.style.strokeWidth, 3) : sh.style.strokeWidth}
          lineCap="round"
          opacity={isSelected ? 1 : 0.8}
          draggable={tool === 'select'}
          onDragEnd={(e) => {
            const n = e.target
            const dx = n.x()
            const dy = n.y()
            n.x(0)
            n.y(0)
            updateShape(sh.id, {
              points: [sh.points[0] + dx, sh.points[1] + dy, sh.points[2] + dx, sh.points[3] + dy]
            } as any)
          }}
          onTransformEnd={(e) => {
            const n = e.target
            const scaleX = n.scaleX()
            const scaleY = n.scaleY()
            n.scaleX(1)
            n.scaleY(1)
            const newPoints = [
              sh.points[0] * scaleX,
              sh.points[1] * scaleY,
              sh.points[2] * scaleX,
              sh.points[3] * scaleY
            ]
            updateShape(sh.id, { points: newPoints } as any)
          }}
        />
      )
    }

    // Handle SVG shapes (svgPath, svgRect, svgPoly) if needed
    return null
  }

  return (
    <div ref={ref} style={{ width: '100%', height: '100%', backgroundColor: '#d6d6f6' }}>

      <Stage
        width={size.w}
        height={size.h}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onWheel={(e: any) => {
          e.evt.preventDefault()
          const dir = e.evt.deltaY > 0 ? 0.9 : 1.1
          setBgT({ scale: Math.max(0.2, Math.min(6, bgT.scale * dir)) })
        }}
      >
        {/* Non-SVG shapes (user-drawn shapes) */}
        <Layer>{shapes.filter(s => !isSvgShape(s)).map(renderShape)}</Layer>
        {/* <Layer listening={false}>
          {bgImg && bgFit && (
            <KImage
              image={bgImg}
              x={bgFit.x + bgT.x}
              y={bgFit.y + bgT.y}
              width={bgFit.w * bgT.scale}
              height={bgFit.h * bgT.scale}
              rotation={bgT.rotation}
              opacity={bgT.opacity}
              draggable={!bgT.locked}
              onDragEnd={(e) => setBgT({ x: e.target.x() - bgFit.x, y: e.target.y() - bgFit.y })}
            />

          )}
        </Layer> */}

        {/* Shapes */}
        <Layer>{svgRoot && (
          <>
            <Rect
              x={svgRoot.x}
              y={svgRoot.y}
              width={svgRoot.viewBox.w}
              height={svgRoot.viewBox.h}
              stroke="magenta"
              dash={[6, 4]}
              listening={false}
            />
            <Group
              x={svgRoot.x}
              y={svgRoot.y}
              scaleX={svgRoot.scale}
              scaleY={svgRoot.scale}
            >
              {shapes.filter(isSvgShape).map(renderShape)}
            </Group>
          </>
        )}</Layer>

        {/* Transformer */}
        <Layer>
          <Transformer ref={trRef} />
        </Layer>
      </Stage>
    </div>
  )
}
