import DeleteTrabajoButton from '@/features/trabajos/components/DeleteTrabajoButton'
import { CreateCroquisButton } from '@/features/trabajos/components/CreateCroquisButton'
import { headers } from 'next/headers'
import Link from 'next/link'

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

async function getCroquis(trabajoId: string): Promise<CroquisItem[]> {
    const h = await headers()
    const host = h.get('host')
    const proto = h.get('x-forwarded-proto') ?? 'http'
    const res = await fetch(`${proto}://${host}/api/trabajos/${trabajoId}/croquis`, { cache: 'no-store' })
    if (!res.ok) return []
    const data = await res.json()
    return data.croquis ?? []
}

export default async function TrabajoDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const t = await getTrabajo(id)
    const croquis = await getCroquis(id)

    if (!t) return <main className="p-4">Trabajo no encontrado</main>

    return (
        <main className="p-4 max-w-xl grid gap-3">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-bold">{t.titulo}</h1>
                <div className="text-xs opacity-70">{t.status}</div>
            </div>

            {t.descripcion && <div className="text-sm opacity-80">{t.descripcion}</div>}

            <div className="text-sm space-y-1">
                {t.clienteNombre && <div><b>Cliente:</b> {t.clienteNombre}</div>}
                {t.encargadoNombre && <div><b>Encargado:</b> {t.encargadoNombre}</div>}
                {t.direccion && <div><b>Dirección:</b> {t.direccion}</div>}
                {t.contacto && <div><b>Contacto:</b> {t.contacto}</div>}
            </div>

            <div>
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Croquis</h2>
                    <CreateCroquisButton trabajoId={id} />
                </div>

                <ul className="mt-4 space-y-2">
                    {croquis.map((c) => (
                        <li key={c.id} className="border rounded p-3 flex justify-between">
                            <div>
                                <div className="font-medium">{c.name}</div>
                                <div className="text-xs opacity-70">{new Date(c.updatedAt).toLocaleString()}</div>
                            </div>
                            <Link className="underline" href={`/herramientas/croquis/${c.id}`}>Abrir</Link>
                        </li>
                    ))}
                </ul>
            </div>

            <DeleteTrabajoButton id={t.id} />
        </main>
    )
}
