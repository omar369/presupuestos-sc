import { NextResponse } from 'next/server'
import { db } from '@/db'
import { trabajos } from '@/db/schema'
import { sql } from 'drizzle-orm'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_: Request, { params }: Ctx) {
    const { id } = await params
    if (!id || id === 'undefined') return NextResponse.json({ error: 'id inválido' }, { status: 400 })

    const rows = await db.select().from(trabajos).where(sql`${trabajos.id} = ${id}`)
    const row = rows[0]
    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ data: row })
}

export async function DELETE(_: Request, { params }: Ctx) {
    const { id } = await params
    if (!id || id === 'undefined') return NextResponse.json({ error: 'id inválido' }, { status: 400 })

    await db.delete(trabajos).where(sql`${trabajos.id} = ${id}`)
    return NextResponse.json({ ok: true })
}
