'use client'
import React, { useEffect, useState } from 'react'
import { useCroquisStore } from '../store/useCroquisStore'
import { Button } from '@/components/ui/button'
import { MousePointer2, Plus } from 'lucide-react'
import AddServiceDialog from './AddServiceDialog'


export default function InspectorPanel() {
  const [showServiceDialog, setShowServiceDialog] = useState(false)

  const doc = useCroquisStore((s) => s.doc)
  const selectedId = useCroquisStore((s) => s.selectedId)
  const updateShapeMeta = useCroquisStore((s) => s.updateShapeMeta)
  const areas = useCroquisStore((s) => s.areas)

  const sh = selectedId ? (doc.entities as any)[selectedId] : null

  // ✅ Área default "A1" si existe y no hay areaId
  useEffect(() => {
    if (!sh) return
    const currentAreaId = (sh.meta as any)?.areaId ?? ''
    if (currentAreaId) return
    const a1 = (areas as any[]).find((a) => (a?.nombre ?? '').trim().toUpperCase() === 'A1')
    if (a1?.id) updateShapeMeta(sh.id, { areaId: a1.id } as any)
  }, [sh?.id, areas, updateShapeMeta])

  if (!sh) return (
    <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-40 italic text-xs gap-2">
      <MousePointer2 className="h-8 w-8 mb-2" />
      Selecciona una figura en el croquis para ver sus detalles.
    </div>
  )

  const areaId = (sh.meta as any)?.areaId ?? ''
  const canChooseService = Boolean(areaId)


  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
        Tipo: <span className="text-gray-600">{sh.type}</span>
      </div>

      <Button
        variant="outline"
        className="w-full bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
        onClick={() => setShowServiceDialog(true)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Agregar servicio
      </Button>

      <AddServiceDialog
        open={showServiceDialog}
        onOpenChange={setShowServiceDialog}
        selectedShape={sh}
      />
    </div>
  )
}
