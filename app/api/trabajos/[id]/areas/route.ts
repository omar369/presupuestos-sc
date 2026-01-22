import { NextResponse } from 'next/server'
import { db } from '@/db'
import { areas } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id: trabajoId } = await params
    const rows = await db.select().from(areas).where(eq(areas.trabajo_id, trabajoId)).orderBy(desc(areas.updated_at))
    return NextResponse.json({ areas: rows })
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id: trabajoId } = await params
    const body = await req.json() // { nombre, notas?, ubicacion }
    const now = new Date().toISOString()
    const id = crypto.randomUUID()

    await db.insert(areas).values({
        id, trabajo_id: trabajoId,
        nombre: body.nombre,
        notas: body.notas ?? '',
        ubicacion: body.ubicacion, // 'INTERIOR' | 'EXTERIOR'
        created_at: now, updated_at: now,
    })

    return NextResponse.json({ area: { id } }, { status: 201 })
}
