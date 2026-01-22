import { NextResponse } from 'next/server'
import { db } from '@/db'
import { croquisItems } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

export async function POST(req: Request, { params }: { params: Promise<{ croquisId: string }> }) {
    const { croquisId } = await params
    const body = await req.json() // { shapeId, areaId, servicioId }
    const now = new Date().toISOString()

    // upsert simple (delete+insert) por (croquisId, shapeId)
    await db.delete(croquisItems).where(and(eq(croquisItems.croquis_id, croquisId), eq(croquisItems.shape_id, body.shapeId)))
    await db.insert(croquisItems).values({
        id: crypto.randomUUID(),
        croquis_id: croquisId,
        shape_id: body.shapeId,
        area_id: body.areaId,
        servicio_id: body.servicioId,
        created_at: now,
        updated_at: now,
    })

    return NextResponse.json({ ok: true }, { status: 201 })
}

export async function GET(_req: Request, { params }: { params: Promise<{ croquisId: string }> }) {
    const { croquisId } = await params
    const rows = await db.select().from(croquisItems).where(eq(croquisItems.croquis_id, croquisId))
    return NextResponse.json({ items: rows })
}
