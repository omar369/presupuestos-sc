import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'

export const runtime = 'nodejs' // importante para fs

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

export async function POST(req: Request) {
    const form = await req.formData()
    const file = form.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })


    const okTypes = ['image/png', 'image/jpeg', 'image/svg+xml']
    if (!okTypes.includes(file.type)) {
        return NextResponse.json({ error: 'Tipo no permitido' }, { status: 400 })
    }

    await fs.mkdir(UPLOAD_DIR, { recursive: true })
    const bytes = Buffer.from(await file.arrayBuffer())

    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/jpeg' ? 'jpg' : 'svg'
    const name = `${Date.now()}_${Math.random().toString(16).slice(2)}.${ext}`
    await fs.writeFile(path.join(UPLOAD_DIR, name), bytes)

    return NextResponse.json({ url: `/uploads/${name}`, mime: file.type })

}
