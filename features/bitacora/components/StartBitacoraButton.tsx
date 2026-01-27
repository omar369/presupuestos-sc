'use client'
import * as React from 'react'
import { useAlert } from '@/lib/use-alert'

type CroquisItem = { id: string; name: string }

export default function StartBitacoraButton({ trabajoId }: { trabajoId: string }) {
    const [croquis, setCroquis] = React.useState<CroquisItem | null>(null)
    const [open, setOpen] = React.useState(false)
    const [encargadoNombre, setEncargadoNombre] = React.useState('')
    const [fechaInicioEst, setFechaInicioEst] = React.useState('')
    const [fechaFinEst, setFechaFinEst] = React.useState('')
    const { showAlert, AlertComponent } = useAlert()

    React.useEffect(() => {
        fetch(`/api/trabajos/${trabajoId}/croquis`, { cache: 'no-store' })
            .then(r => r.json()).then(d => setCroquis(d.croquis ?? null))
    }, [trabajoId])

    if (!croquis) return null

    const submit = async () => {
        const res = await fetch(`/api/trabajos/${trabajoId}/bitacoras`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ croquisId: croquis.id, encargadoNombre, fechaInicioEst, fechaFinEst }),
        })
        if (!res.ok) {
            const error = await res.json()
            showAlert('Error', error.error || 'No se pudo crear bitácora')
            return
        }
        const data = await res.json()
        window.location.href = `/herramientas/bitacora/${data.bitacora.id}`
    }

    return (
        <>
            <div className="border rounded-lg p-4 space-y-3">
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium w-full"
                    onClick={() => setOpen(v => !v)}
                >
                    {open ? 'Cancelar' : 'Iniciar bitácora'}
                </button>
                {open && (
                    <div className="space-y-3">
                        <div className="text-sm">
                            <div className="font-semibold text-gray-600 mb-1">Croquis seleccionado</div>
                            <div className="px-3 py-2 bg-gray-50 rounded border">{croquis.name}</div>
                        </div>
                        <input
                            className="border rounded-lg px-3 py-2 w-full"
                            placeholder="Nombre del encargado"
                            value={encargadoNombre}
                            onChange={e => setEncargadoNombre(e.target.value)}
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm text-gray-600">Fecha inicio estimada</label>
                                <input
                                    className="border rounded-lg px-3 py-2 w-full"
                                    type="date"
                                    value={fechaInicioEst}
                                    onChange={e => setFechaInicioEst(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Fecha fin estimada</label>
                                <input
                                    className="border rounded-lg px-3 py-2 w-full"
                                    type="date"
                                    value={fechaFinEst}
                                    onChange={e => setFechaFinEst(e.target.value)}
                                />
                            </div>
                        </div>
                        <button
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium w-full disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!encargadoNombre || !fechaInicioEst || !fechaFinEst}
                            onClick={submit}
                        >
                            Crear bitácora
                        </button>
                    </div>
                )}
            </div>
            {AlertComponent}
        </>
    )
}
