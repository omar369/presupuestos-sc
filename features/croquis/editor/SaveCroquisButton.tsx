'use client'
import { useRouter } from 'next/navigation'
import { useCroquisStore } from '../store/useCroquisStore'
import { Button } from '@/components/ui/button'

interface SaveCroquisButtonProps {
    variant?: 'stay' | 'exit'
    trabajoId?: string
    onAfterSave?: () => void
    children?: React.ReactNode
    className?: string
}

export default function SaveCroquisButton({
    variant = 'exit',
    trabajoId,
    onAfterSave,
    children,
    className
}: SaveCroquisButtonProps) {
    const router = useRouter()
    const saveCroquis = useCroquisStore(s => s.saveCroquis)

    const onClick = async () => {
        if (variant === 'exit') {
            // Requiere trabajoId para redirigir
            if (!trabajoId) {
                console.error('trabajoId is required for exit variant')
                return
            }

            // Confirmación antes de salir
            if (!confirm('¿Guardar cambios y salir del croquis?')) return
        }

        // Guardar
        await saveCroquis()

        // Callback
        onAfterSave?.()

        // Redirigir solo si es exit
        if (variant === 'exit' && trabajoId) {
            router.push(`/herramientas/trabajos/${trabajoId}`)
        }
    }

    return (
        <Button onClick={onClick} className={className}>
            {children || 'Guardar cambios'}
        </Button>
    )
}
