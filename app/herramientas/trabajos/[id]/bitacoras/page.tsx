import Link from 'next/link'
import BitacorasList from '@/features/bitacora/components/BitacorasList'

export default async function BitacorasListPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    return (
        <main className="p-4 max-w-2xl mx-auto">
            <div className="mb-4">
                <Link
                    href={`/herramientas/trabajos/${id}`}
                    className="text-blue-600 hover:underline text-sm"
                >
                    ← Volver al trabajo
                </Link>
            </div>

            <h1 className="text-2xl font-bold mb-6">Bitácoras del trabajo</h1>

            <BitacorasList trabajoId={id} />
        </main>
    )
}
