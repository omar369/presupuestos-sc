'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Bitacora = {
    id: string
    trabajoId: string
    croquisId: string
    encargadoNombre: string
    fechaInicioEst: string
    fechaFinEst: string
    createdAt: string
    updatedAt: string
}

type BitacorasListProps = {
    trabajoId: string
}

export default function BitacorasList({ trabajoId }: BitacorasListProps) {
    const [bitacoras, setBitacoras] = useState<Bitacora[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchBitacoras() {
            try {
                setLoading(true)
                const res = await fetch(`/api/trabajos/${trabajoId}/bitacoras`)
                if (!res.ok) {
                    throw new Error('Error al cargar bitácoras')
                }
                const data = await res.json()
                setBitacoras(data.bitacoras ?? [])
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error desconocido')
            } finally {
                setLoading(false)
            }
        }

        if (trabajoId) {
            fetchBitacoras()
        }
    }, [trabajoId])

    if (loading) {
        return <div className="text-sm opacity-70">Cargando bitácoras...</div>
    }

    if (error) {
        return <div className="text-sm text-red-600">Error: {error}</div>
    }

    if (bitacoras.length === 0) {
        return <div className="text-sm opacity-70">No hay bitácoras aún.</div>
    }

    return (
        <div className="space-y-3">
            {bitacoras.map((bitacora) => (
                <div key={bitacora.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="font-semibold">
                                Bitácora {bitacora.id.slice(0, 6)}
                            </div>
                            <div className="text-sm opacity-80 mt-1">
                                <div><b>Encargado:</b> {bitacora.encargadoNombre}</div>
                                <div><b>Periodo estimado:</b> {bitacora.fechaInicioEst} - {bitacora.fechaFinEst}</div>
                            </div>
                            {bitacora.croquisId && (
                                <div className="text-xs opacity-60 mt-1">
                                    Croquis: {bitacora.croquisId.slice(0, 8)}
                                </div>
                            )}
                        </div>
                        <Link
                            href={`/herramientas/bitacora/${bitacora.id}`}
                            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                        >
                            Ver registros
                        </Link>
                    </div>
                    <div className="text-xs opacity-60">
                        Creada: {new Date(bitacora.createdAt).toLocaleString()}
                    </div>
                </div>
            ))}
        </div>
    )
}
