'use client'
import React, { useRef, useState } from 'react'
import { useCroquisStore } from '../store/useCroquisStore'

export default function UploadBackground({ dark }: { dark?: boolean }) {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [loading, setLoading] = useState(false)
    const setBackground = useCroquisStore((s: any) => s.setBackground)
    const importSvgAsLayers = useCroquisStore((s: any) => s.importSvgAsLayers)

    const pick = () => inputRef.current?.click()

    const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setLoading(true)
        try {
            const fd = new FormData()
            fd.append('file', file)
            const res = await fetch('/api/uploads', { method: 'POST', body: fd })
            const data = await res.json()
            if (!res.ok) throw new Error(data?.error || 'Upload failed')
            setBackground({ url: data.url, mime: data.mime })
        } finally {
            setLoading(false)
            e.target.value = ''
        }

        if (file.type === 'image/svg+xml') {
            const svgText = await file.text()
            importSvgAsLayers(svgText) // ✅ crea shapes movibles
        }

    }

    return (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <button
                onClick={pick}
                disabled={loading}
                className={`
                    px-4 py-2.5 rounded-lg border text-xs font-bold transition-colors w-full
                    ${dark
                        ? 'bg-slate-800 border-slate-700 text-slate-100 hover:bg-slate-700 shadow-sm'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }
                `}
            >
                {loading ? 'Subiendo…' : 'Subir plano (PNG/JPG/SVG)'}
            </button>

            <input
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                onChange={onPick}
                style={{ display: 'none' }}
            />
        </div>
    )
}
