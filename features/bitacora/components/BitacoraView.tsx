'use client'
import * as React from 'react'
import { useAlert } from '@/lib/use-alert'

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

export default function BitacoraView({ bitacoraId }: { bitacoraId: string }) {
    const [items, setItems] = React.useState<Registro[]>([])
    const [horaInicio, setHoraInicio] = React.useState('08:00')
    const [horaFin, setHoraFin] = React.useState('17:00')
    const [empleados, setEmpleados] = React.useState(1)
    const [accidentes, setAccidentes] = React.useState('')
    const [notasFinales, setNotasFinales] = React.useState('')
    const { showAlert, AlertComponent } = useAlert()

    const load = React.useCallback(async () => {
        const r = await fetch(`/api/bitacoras/${bitacoraId}/registros`, { cache: 'no-store' })
        if (!r.ok) return
        const d = await r.json()
        setItems(d.registros ?? [])
    }, [bitacoraId])

    React.useEffect(() => { load() }, [load])

    const submit = async () => {
        const r = await fetch(`/api/bitacoras/${bitacoraId}/registros`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ horaInicio, horaFin, empleados, accidentes, notasFinales }),
        })
        if (!r.ok) {
            showAlert('Error', 'No se pudo guardar el registro')
            return
        }
        setAccidentes(''); setNotasFinales('')
        await load()
    }

    return (
        <div className="p-6 space-y-6">
            <div className="border rounded-xl p-4 space-y-3">
                <div className="font-bold">Nuevo registro diario</div>
                <div className="grid grid-cols-2 gap-3">
                    <label className="text-sm">Hora inicio
                        <input className="border rounded-lg px-3 py-2 w-full" type="time" value={horaInicio} onChange={e => setHoraInicio(e.target.value)} />
                    </label>
                    <label className="text-sm">Hora fin
                        <input className="border rounded-lg px-3 py-2 w-full" type="time" value={horaFin} onChange={e => setHoraFin(e.target.value)} />
                    </label>
                    <label className="text-sm">Empleados
                        <input className="border rounded-lg px-3 py-2 w-full" type="number" min={0} value={empleados} onChange={e => setEmpleados(Number(e.target.value))} />
                    </label>
                    <label className="text-sm">Accidentes
                        <input className="border rounded-lg px-3 py-2 w-full" value={accidentes} onChange={e => setAccidentes(e.target.value)} placeholder="0 / descripción" />
                    </label>
                    <label className="text-sm col-span-2">Notas finales
                        <textarea className="border rounded-lg px-3 py-2 w-full" rows={3} value={notasFinales} onChange={e => setNotasFinales(e.target.value)} />
                    </label>
                </div>
                <button className="border rounded-lg px-4 py-2" onClick={submit}>Guardar registro</button>
            </div>

            <div className="border rounded-xl p-4 space-y-3">
                <div className="font-bold">Historial</div>
                <ul className="space-y-2">
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
                            <li key={it.id} className="border rounded-lg p-3 text-sm space-y-1">
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
                    {items.length === 0 && <li className="text-sm opacity-70">Aún no hay registros.</li>}
                </ul>
            </div>
            {AlertComponent}
        </div>
    )
}
