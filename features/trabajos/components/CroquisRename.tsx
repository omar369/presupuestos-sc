'use client'

export function CroquisRename({ croquisId, name, onSaved }: { croquisId: string; name: string; onSaved: () => void }) {
    const onBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        const value = e.target.value.trim()
        if (!value || value === name) return
        const res = await fetch(`/api/croquis/${croquisId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: value }) })
        if (res.ok) onSaved()
    }
    return <input defaultValue={name} onBlur={onBlur} />
}