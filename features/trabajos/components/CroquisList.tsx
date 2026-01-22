'use client'
import * as React from 'react'
import Link from 'next/link'
import { CroquisRename } from './CroquisRename'
import { CroquisDelete } from './CroquisDelete'

type Item = { id: string; name: string; updatedAt: string }

export function CroquisList({ trabajoId }: { trabajoId: string }) {
    const [items, setItems] = React.useState<Item[]>([])

    const load = React.useCallback(async () => {
        const res = await fetch(`/api/trabajos/${trabajoId}/croquis`, { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        setItems(data.croquis ?? [])
    }, [trabajoId])

    React.useEffect(() => {
        fetch(`/api/trabajos/${trabajoId}/croquis`)
            .then(r => r.json())
            .then(d => setItems(d.croquis ?? []))
    }, [trabajoId])

    return (
        <div>
            <ul>
                {items.map((c) => (
                    <li key={c.id}>
                        <CroquisRename
                            croquisId={c.id}
                            name={c.name}
                            onSaved={load}
                        />
                        <CroquisDelete croquisId={c.id} onDeleted={load} />
                        <Link href={`/herramientas/croquis/${c.id}`}>Abrir</Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}