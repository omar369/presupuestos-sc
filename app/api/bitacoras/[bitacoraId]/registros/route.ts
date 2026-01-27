import { NextResponse } from 'next/server'
import { db } from '@/db'
import { bitacoraRegistros, bitacoras, croquis, areas, servicios } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(_req: Request, { params }: { params: Promise<{ bitacoraId: string }> }) {
    const { bitacoraId } = await params
    const rows = await db.select({
        id: bitacoraRegistros.id,
        fecha: bitacoraRegistros.fecha,
        horaInicio: bitacoraRegistros.horaInicio,
        horaFin: bitacoraRegistros.horaFin,
        empleados: bitacoraRegistros.empleados,
        accidentes: bitacoraRegistros.accidentes,
        notasFinales: bitacoraRegistros.notasFinales,
        snapshotJson: bitacoraRegistros.snapshotJson,
        createdAt: bitacoraRegistros.createdAt,
    }).from(bitacoraRegistros).where(eq(bitacoraRegistros.bitacoraId, bitacoraId)).orderBy(desc(bitacoraRegistros.createdAt))

    return NextResponse.json({ registros: rows })
}

export async function POST(req: Request, { params }: { params: Promise<{ bitacoraId: string }> }) {
    const { bitacoraId } = await params
    const body = await req.json()

    const b = await db.select().from(bitacoras).where(eq(bitacoras.id, bitacoraId)).get()
    if (!b) return NextResponse.json({ error: 'Bitácora no encontrada' }, { status: 404 })

    const c = await db.select({
        id: croquis.id, payloadJson: croquis.payloadJson, updatedAt: croquis.updatedAt
    }).from(croquis).where(eq(croquis.id, b.croquisId)).get()
    if (!c) return NextResponse.json({ error: 'Croquis no encontrado' }, { status: 404 })

    const a = await db.select().from(areas).where(eq(areas.trabajo_id, b.trabajoId))
    const s = await db.select().from(servicios).where(eq(servicios.trabajo_id, b.trabajoId))

    const snapshotJson = JSON.stringify({
        croquis: { id: c.id, updatedAt: c.updatedAt, payload: JSON.parse(c.payloadJson) },
        areas: a,
        servicios: s,
    })

    const now = new Date()
    const id = crypto.randomUUID()
    const fecha = now.toISOString().slice(0, 10)

    await db.insert(bitacoraRegistros).values({
        id, bitacoraId, fecha,
        horaInicio: body.horaInicio,
        horaFin: body.horaFin,
        empleados: Number(body.empleados ?? 0),
        accidentes: body.accidentes ?? '',
        notasFinales: body.notasFinales ?? '',
        snapshotJson,
        createdAt: now.toISOString(),
    })

    return NextResponse.json({ registro: { id } }, { status: 201 })
}
