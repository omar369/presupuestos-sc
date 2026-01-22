import Link from 'next/link'
import { headers } from 'next/headers'

async function getTrabajos() {
    const h = await headers()
    const host = h.get('host')
    const proto = h.get('x-forwarded-proto') ?? 'http'
    const res = await fetch(`${proto}://${host}/api/trabajos`, { cache: 'no-store' })
    return (await res.json()).data ?? []
}

export default async function TrabajosPage() {
    const data = await getTrabajos()

    return (
        <main className="p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-bold">Trabajos</h1>
                <Link
                    href="/herramientas/trabajos/nuevo"
                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold hover:bg-gray-50"
                >
                    Nuevo trabajo
                </Link>
            </div>

            <div className="grid gap-2">
                {data.map((t: any) => {
                    const id = t.id ?? t.ID ?? t.trabajos?.id
                    return (
                        <Link
                            key={id}
                            href={`/herramientas/trabajos/${id}`}
                            className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50"
                        >
                            <div className="font-semibold">{t.titulo}</div>
                        </Link>
                    )
                })}
            </div>
        </main>
    )
}