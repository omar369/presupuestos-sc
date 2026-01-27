'use client'
import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useCroquisStore } from '../store/useCroquisStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pencil, Save, Plus } from 'lucide-react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export default function CroquisToolbar({ croquisId }: { croquisId: string }) {
    const router = useRouter()
    const saveCroquis = useCroquisStore(s => s.saveCroquis)
    const refreshAreas = useCroquisStore(s => s.refreshAreas)
    const trabajoId = useCroquisStore(s => s.trabajoId)

    const [croquisName, setCroquisName] = React.useState('')
    const [editName, setEditName] = React.useState('')
    const [showEditDialog, setShowEditDialog] = React.useState(false)
    const [showAddAreaDialog, setShowAddAreaDialog] = React.useState(false)
    const [newAreaName, setNewAreaName] = React.useState('')

    // Load croquis name
    React.useEffect(() => {
        const loadCroquis = async () => {
            const res = await fetch(`/api/croquis/${croquisId}`, { cache: 'no-store' })
            if (!res.ok) return
            const data = await res.json()
            setCroquisName(data.croquis.name || 'Sin nombre')
        }
        loadCroquis()
    }, [croquisId])

    const handleSave = async () => {
        await saveCroquis()
        router.push(`/herramientas/trabajos/`)
    }

    const handleEditName = async () => {
        if (!editName.trim()) return

        const res = await fetch(`/api/croquis/${croquisId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: editName.trim() }),
        })

        if (res.ok) {
            setCroquisName(editName.trim())
            setShowEditDialog(false)
            setEditName('')
        }
    }

    const handleAddArea = async () => {
        if (!newAreaName.trim() || !trabajoId) return

        const res = await fetch(`/api/trabajos/${trabajoId}/areas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: newAreaName.trim(), notas: '', ubicacion: 'INTERIOR' }),
        })

        if (res.ok) {
            await refreshAreas()
            setShowAddAreaDialog(false)
            setNewAreaName('')
        }
    }

    return (
        <div className="h-14 px-4 border-b bg-white flex items-center justify-between gap-4">
            {/* Left: Croquis Name */}
            <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">{croquisName}</h2>

                <AlertDialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setEditName(croquisName)}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Editar nombre del croquis</AlertDialogTitle>
                            <AlertDialogDescription>
                                Ingresa el nuevo nombre para este croquis.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Nombre del croquis"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleEditName()
                            }}
                        />
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleEditName}>
                                Guardar
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2">
                <AlertDialog open={showAddAreaDialog} onOpenChange={setShowAddAreaDialog}>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Agregar área
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Agregar nueva área</AlertDialogTitle>
                            <AlertDialogDescription>
                                Ingresa el nombre del área que deseas agregar.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <Input
                            value={newAreaName}
                            onChange={(e) => setNewAreaName(e.target.value)}
                            placeholder="Nombre del área"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddArea()
                            }}
                        />
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleAddArea}>
                                Crear
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <Button onClick={handleSave} size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Guardar cambios
                </Button>
            </div>
        </div>
    )
}
