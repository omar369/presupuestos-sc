'use client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAlert } from '@/lib/use-alert'
import { useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default function DeleteTrabajoButton({ id }: { id: string }) {
    const router = useRouter()
    const { showAlert, AlertComponent } = useAlert()
    const [showConfirm, setShowConfirm] = useState(false)

    const onDelete = async () => {
        const res = await fetch(`/api/trabajos/${id}`, { method: 'DELETE' })
        if (!res.ok) {
            showAlert('Error', 'No se pudo eliminar el trabajo')
            return
        }
        router.push('/herramientas/trabajos')
        router.refresh()
    }

    return (
        <>
            <Button variant="destructive" onClick={() => setShowConfirm(true)}>
                Eliminar trabajo
            </Button>

            <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar este trabajo?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente el trabajo y todos sus datos asociados.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700">
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {AlertComponent}
        </>
    )
}
