import DeleteTrabajoButton from '@/features/trabajos/components/DeleteTrabajoButton'
import { CreateCroquisButton } from '@/features/trabajos/components/CreateCroquisButton'
import { headers } from 'next/headers'
import Link from 'next/link'
import BitacoraRegistrosList from '@/features/bitacora/components/BitacoraRegistrosList'
import { PageBreadcrumb } from '@/components/PageBreadcrumb'

async function getTrabajo(id: string) {
    const h = await headers()
    const host = h.get('host')
    const proto = h.get('x-forwarded-proto') ?? 'http'
    const res = await fetch(`${proto}://${host}/api/trabajos/${id}`, { cache: 'no-store' })
    if (!res.ok) return null
    const json = await res.json()
    return json.data
}

type CroquisItem = { id: string; name: string; updatedAt: string }

async function getCroquis(trabajoId: string): Promise<CroquisItem | null> {
    const h = await headers()
    const host = h.get('host')
    const proto = h.get('x-forwarded-proto') ?? 'http'
    const res = await fetch(`${proto}://${host}/api/trabajos/${trabajoId}/croquis`, { cache: 'no-store' })
    if (!res.ok) return null
    const data = await res.json()
    return data.croquis ?? null
}

type BitacoraItem = { id: string; encargadoNombre: string; fechaInicioEst: string; fechaFinEst: string }

async function getBitacora(trabajoId: string): Promise<BitacoraItem | null> {
    const h = await headers()
    const host = h.get('host')
    const proto = h.get('x-forwarded-proto') ?? 'http'
    const res = await fetch(`${proto}://${host}/api/trabajos/${trabajoId}/bitacoras`, { cache: 'no-store' })
    if (!res.ok) return null
    const data = await res.json()
    return data.bitacora ?? null
}

export default async function TrabajoDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const t = await getTrabajo(id)
    const croquis = await getCroquis(id)
    const bitacora = await getBitacora(id)

    if (!t) return <main className="p-4">Trabajo no encontrado</main>

    return (
        <main className="p-6 max-w-7xl mx-auto">
            <PageBreadcrumb
                segments={[
                    { label: 'Trabajos', href: '/herramientas/trabajos' },
                    { label: t.titulo }
                ]}
            />

            {/* Sección 1: Información General - Centrada en una columna */}
            <div className="max-w-3xl mx-auto mb-8 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{t.titulo}</h1>
                    <div className="text-sm px-3 py-1 bg-gray-100 rounded-full">{t.status}</div>
                </div>

                {t.descripcion && <div className="text-base opacity-80">{t.descripcion}</div>}

                <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
                    {t.clienteNombre && (
                        <div>
                            <div className="font-semibold text-gray-600">Cliente</div>
                            <div>{t.clienteNombre}</div>
                        </div>
                    )}
                    {t.encargadoNombre && (
                        <div>
                            <div className="font-semibold text-gray-600">Encargado</div>
                            <div>{t.encargadoNombre}</div>
                        </div>
                    )}
                    {t.direccion && (
                        <div>
                            <div className="font-semibold text-gray-600">Dirección</div>
                            <div>{t.direccion}</div>
                        </div>
                    )}
                    {t.contacto && (
                        <div>
                            <div className="font-semibold text-gray-600">Contacto</div>
                            <div>{t.contacto}</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Sección 2: Una columna - Croquis arriba, Bitácora abajo */}
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Croquis */}
                <div className="border rounded-lg p-6 bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Croquis</h2>
                        {!croquis && <CreateCroquisButton trabajoId={id} />}
                    </div>

                    <div className="flex flex-col items-center justify-center">
                        {!croquis ? (
                            <div className="text-center text-sm opacity-70 py-8">
                                No hay croquis aún. Crea uno para comenzar.
                            </div>
                        ) : (
                            <div className="border rounded-lg p-6 hover:bg-gray-50 transition-colors w-full max-w-md">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="text-center">
                                        <div className="font-medium text-lg mb-2">{croquis.name}</div>
                                        <div className="text-xs opacity-70">
                                            Actualizado: {new Date(croquis.updatedAt).toLocaleString()}
                                        </div>
                                    </div>
                                    <Link
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                        href={`/herramientas/croquis/${croquis.id}`}
                                    >
                                        Abrir Croquis
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Registros de Bitácora */}
                <div className="border rounded-lg p-6 bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Registros de Bitácora</h2>
                        {bitacora && (
                            <Link
                                href={`/herramientas/bitacora/${bitacora.id}`}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                Ver detalles →
                            </Link>
                        )}
                    </div>

                    {/* Lista scrolleable de registros de bitácora */}
                    <div className="overflow-y-auto max-h-[600px] pr-2">
                        <BitacoraRegistrosList bitacoraId={bitacora?.id ?? null} trabajoId={id} />
                    </div>
                </div>

                {/* Delete Button at the bottom */}
                <div className="flex justify-center pt-4">
                    <DeleteTrabajoButton id={t.id} />
                </div>
            </div>
        </main>
    )
}
