'use client'
import { useRouter } from 'next/navigation'
import { useCroquisStore } from '../store/useCroquisStore'

export default function SaveCroquisButton() {
    const router = useRouter()
    const saveCroquis = useCroquisStore(s => s.saveCroquis)

    const onClick = async () => {
        if (!confirm('¿Estás seguro de guardar el estado actual?')) return
        await saveCroquis()
        router.push(`/herramientas/trabajos/`)
    }

    return <button onClick={onClick}>Guardar cambios</button>
}
