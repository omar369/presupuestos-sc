'use client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function DeleteTrabajoButton({ id }: { id: string }) {
    const router = useRouter()

    const onDelete = async () => {
        if (!confirm('¿Eliminar este trabajo?')) return
        const res = await fetch(`/api/trabajos/${id}`, { method: 'DELETE' })
        if (!res.ok) return alert('No se pudo eliminar')
        router.push('/herramientas/trabajos')
        router.refresh()
    }

    return (
        <Button variant="destructive" onClick={onDelete}>
            Eliminar trabajo
        </Button>
    )
}
