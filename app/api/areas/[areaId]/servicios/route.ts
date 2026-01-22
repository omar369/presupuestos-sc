import { NextResponse } from 'next/server'
import { db } from '@/db'
import { servicios } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(_req: Request, { params }: { params: Promise<{ areaId: string }> }) {
    const { areaId } = await params
    const rows = await db.select().from(servicios).where(eq(servicios.area_id, areaId)).orderBy(desc(servicios.updated_at))
    return NextResponse.json({ servicios: rows })
}

export async function POST(req: Request, { params }: { params: Promise<{ areaId: string }> }) {
    const { areaId } = await params
    const body = await req.json() // { trabajoId, tipoServicio, unidad, cantidad, productoMarca?, productoModelo? }
    const now = new Date().toISOString()
    const id = crypto.randomUUID()

    await db.insert(servicios).values({
        id,
        trabajo_id: body.trabajoId,
        area_id: areaId,
        tipo_servicio: body.tipoServicio,
        unidad: body.unidad,
        cantidad: String(body.cantidad),
        producto_marca: body.productoMarca ?? '',
        producto_modelo: body.productoModelo ?? '',
        created_at: now,
        updated_at: now,
    })

    return NextResponse.json({ servicio: { id } }, { status: 201 })
}
