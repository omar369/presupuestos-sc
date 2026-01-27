'use client'
import * as React from 'react'
import StartBitacoraButton from './StartBitacoraButton'

type Registro = {
    id: string
    fecha: string
    horaInicio: string
    horaFin: string
    empleados: number
    accidentes: string
    notasFinales: string
    createdAt: string
    snapshotJson?: string
}

type Props = {
    bitacoraId: string | null
    trabajoId: string
}

export default function BitacoraRegistrosList({ bitacoraId, trabajoId }: Props) {
    const [items, setItems] = React.useState<Registro[]>([])
    const [loading, setLoading] = React.useState(true)

    const load = React.useCallback(async () => {
        if (!bitacoraId) {
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            const r = await fetch(`/api/bitacoras/${bitacoraId}/registros`, { cache: 'no-store' })
            if (!r.ok) return
            const d = await r.json()
            setItems(d.registros ?? [])
        } finally {
            setLoading(false)
        }
    }, [bitacoraId])

    React.useEffect(() => { load() }, [load])

    if (loading) {
        return <div className="text-sm opacity-70 text-center py-8">Cargando registros...</div>
    }

    if (!bitacoraId) {
        return (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="text-sm opacity-70 text-center">No hay bitácora creada aún.</div>
                <StartBitacoraButton trabajoId={trabajoId} />
            </div>
        )
    }

    if (items.length === 0) {
        return <div className="text-sm opacity-70 text-center py-8">Aún no hay registros diarios.<StartBitacoraButton trabajoId={trabajoId} /></div>
    }

    return (
        <ul className="space-y-3">
            {items.map(it => {
                const snap = it.snapshotJson ? JSON.parse(it.snapshotJson) : null
                const areas = (snap?.areas ?? []) as any[]
                const servicios = (snap?.servicios ?? []) as any[]
                const ents = Object.values(snap?.croquis?.payload?.doc?.entities ?? {}) as any[]

                // map areaId -> nombre si existe
                const areaNameById: Record<string, string> = Object.fromEntries(
                    areas.map(a => [String(a.id), String(a.nombre ?? a.name ?? a.id)])
                )

                type Stat = { total: number; sumPct: number }
                const byArea: Record<string, Stat> = {}
                const byService: Record<string, Stat> = {}

                for (const e of ents) {
                    const pct = Number(e?.meta?.service?.porcentaje ?? 0)
                    if (!Number.isFinite(pct)) continue
                    const areaId = String(e?.meta?.areaId ?? 'SIN_AREA')
                    const srv = String(e?.meta?.service?.tipoServicio ?? 'SIN_SERVICIO')
                    byArea[areaId] ??= { total: 0, sumPct: 0 }
                    byService[srv] ??= { total: 0, sumPct: 0 }
                    byArea[areaId].total++; byArea[areaId].sumPct += pct
                    byService[srv].total++; byService[srv].sumPct += pct
                }

                const avgOf = (x: Stat) => Math.round(x.sumPct / Math.max(1, x.total))

                // avance global (promedio de todas las figuras)
                const all = Object.values(byService).reduce((acc, s) => ({ total: acc.total + s.total, sumPct: acc.sumPct + s.sumPct }), { total: 0, sumPct: 0 })
                const avgGlobal = all.total ? avgOf(all) : 0

                return (
                    <li key={it.id} className="border rounded-lg p-3 text-sm space-y-1 hover:bg-gray-50 transition-colors">
                        <div className="font-semibold">{it.fecha} · {it.horaInicio}-{it.horaFin} · {it.empleados} empleados</div>
                        <div className="opacity-80">Accidentes: {it.accidentes || '—'}</div>
                        <div className="opacity-80">Notas: {it.notasFinales || '—'}</div>

                        {snap && (
                            <div className="pt-2 text-xs space-y-2">
                                <div className="opacity-80">
                                    Áreas: <b>{areas.length}</b> · Servicios: <b>{servicios.length}</b> · Avance global: <b>{avgGlobal}%</b>
                                </div>

                                <div>
                                    <div className="opacity-80 mb-1">Avance por área</div>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries(byArea).map(([k, v]) => (
                                            <span key={k} className="border rounded-md px-2 py-1">
                                                {areaNameById[k] ?? k}: <b>{avgOf(v)}%</b>
                                            </span>
                                        ))}
                                        {Object.keys(byArea).length === 0 && <span className="opacity-70">—</span>}
                                    </div>
                                </div>

                                <div>
                                    <div className="opacity-80 mb-1">Avance por servicio</div>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries(byService).map(([k, v]) => (
                                            <span key={k} className="border rounded-md px-2 py-1">
                                                {k}: <b>{avgOf(v)}%</b>
                                            </span>
                                        ))}
                                        {Object.keys(byService).length === 0 && <span className="opacity-70">—</span>}
                                    </div>
                                </div>
                            </div>
                        )}
                    </li>
                )
            })}
        </ul>
    )
}
