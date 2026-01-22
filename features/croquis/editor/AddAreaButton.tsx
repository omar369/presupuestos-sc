'use client'
import { useCroquisStore } from '../store/useCroquisStore'

export default function AddAreaButton() {
    const trabajoId = useCroquisStore(s => s.trabajoId) // si no existe aún, lo agregamos después
    const add = async () => {
        const nombre = prompt('Nombre del área')
        if (!nombre) return
        await fetch(`/api/trabajos/${trabajoId}/areas`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, notas: '', ubicacion: 'INTERIOR' }),
        })
    }
    return <button onClick={add}>Agregar área</button>
}
