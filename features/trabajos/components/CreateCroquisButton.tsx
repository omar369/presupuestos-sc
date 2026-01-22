'use client'
import { useRouter } from 'next/navigation'

export function CreateCroquisButton({ trabajoId }: { trabajoId: string }) {
    const router = useRouter()

    const onClick = async () => {
        const res = await fetch(`/api/trabajos/${trabajoId}/croquis`, { method: 'POST' })
        if (!res.ok) return
        const { croquis } = await res.json()
        router.push(`/herramientas/croquis/${croquis.id}`)
    }

    return <button type="button" className="px-3 py-2 border rounded" onClick={onClick}>Crear croquis</button>
}
