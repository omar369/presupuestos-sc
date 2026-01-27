import TrabajoForm from '@/features/trabajos/components/TrabajosForm'
import { PageBreadcrumb } from '@/components/PageBreadcrumb'

export default function NuevoTrabajoPage() {
    return (
        <main className="p-4 max-w-xl">
            <PageBreadcrumb
                segments={[
                    { label: 'Trabajos', href: '/herramientas/trabajos' },
                    { label: 'Nuevo' }
                ]}
            />
            <h1 className="text-lg font-bold mb-3">Nuevo trabajo</h1>
            <TrabajoForm />
        </main>
    )
}
