import BitacoraView from '@/features/bitacora/components/BitacoraView'
import { PageBreadcrumb } from '@/components/PageBreadcrumb'
import { headers } from 'next/headers'

async function getBitacoraInfo(bitacoraId: string) {
    const h = await headers()
    const host = h.get('host')
    const proto = h.get('x-forwarded-proto') ?? 'http'
    const res = await fetch(`${proto}://${host}/api/bitacoras/${bitacoraId}`, { cache: 'no-store' })
    if (!res.ok) return null
    const data = await res.json()
    return data.bitacora
}

export default async function BitacoraPage({ params }: { params: Promise<{ bitacoraId: string }> }) {
    const { bitacoraId } = await params
    const bitacora = await getBitacoraInfo(bitacoraId)

    return (
        <div>
            {bitacora ? (
                <div className="p-4">
                    <PageBreadcrumb
                        segments={[
                            { label: 'Trabajos', href: '/herramientas/trabajos' },
                            { label: 'Detalle Trabajo', href: `/herramientas/trabajos/${bitacora.trabajoId}` },
                            { label: `Bitácora - ${bitacora.encargadoNombre}` }
                        ]}
                    />
                </div>
            ) : (
                <div className="p-4">
                    <PageBreadcrumb
                        segments={[
                            { label: 'Trabajos', href: '/herramientas/trabajos' },
                            { label: 'Bitácora' }
                        ]}
                    />
                </div>
            )}
            <BitacoraView bitacoraId={bitacoraId} />
        </div>
    )
}
