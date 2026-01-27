'use client'
import { useCroquisStore } from '../store/useCroquisStore'

export default function AddAreaButton() {
    const refreshAreas = useCroquisStore(s => s.refreshAreas)

    const add = async () => {
        const nombre = prompt('Nombre del área')?.trim()
        if (!nombre) return
        const trabajoId = useCroquisStore.getState().trabajoId
        if (!trabajoId) return

        const res = await fetch(`/api/trabajos/${trabajoId}/areas`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, notas: '', ubicacion: 'INTERIOR' }),
        })
        if (!res.ok) return
        await refreshAreas()
    }

    return <button onClick={add} style={{ padding: '8px 16px', border: '1px solid #e5e7eb', background: 'white', borderRadius: 10 }}>Agregar área</button>
}
