'use client'
export function CroquisDelete({ croquisId, onDeleted }: { croquisId: string; onDeleted: () => void }) {
    const del = async () => { const r = await fetch(`/api/croquis/${croquisId}`, { method: 'DELETE' }); if (r.ok) onDeleted() }
    return <button onClick={del}>Eliminar</button>
}
