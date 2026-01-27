import { NextResponse } from "next/server"
import { db } from "@/db"
import { bitacoras, croquis } from "@/db/schema"
import { eq, desc } from "drizzle-orm"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id: trabajoId } = await params
    const rows = await db.select().from(bitacoras).where(eq(bitacoras.trabajoId, trabajoId)).limit(1)

    // Return single bitácora object or null (1:1 relationship)
    return NextResponse.json({ bitacora: rows[0] || null })
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id: trabajoId } = await params
    const body = await req.json() // { croquisId, encargadoNombre, fechaInicioEst, fechaFinEst }

    // Check if bitácora already exists for this trabajo (1:1 relationship)
    const existingBitacora = await db.select({ id: bitacoras.id }).from(bitacoras).where(eq(bitacoras.trabajoId, trabajoId)).limit(1)
    if (existingBitacora.length > 0) {
        return NextResponse.json({ error: 'Ya existe una bitácora para este trabajo' }, { status: 409 })
    }

    const hasCroquis = await db.select({ id: croquis.id }).from(croquis).where(eq(croquis.trabajoId, trabajoId)).get()
    if (!hasCroquis) return NextResponse.json({ error: 'Necesitas un croquis para iniciar bitácora' }, { status: 400 })

    const valid = await db.select({ id: croquis.id }).from(croquis).where(eq(croquis.id, body.croquisId)).get()
    if (!valid) return NextResponse.json({ error: 'Croquis inválido' }, { status: 400 })

    const now = new Date().toISOString()
    const id = crypto.randomUUID()

    await db.insert(bitacoras).values({
        id, trabajoId, croquisId: body.croquisId,
        encargadoNombre: body.encargadoNombre,
        fechaInicioEst: body.fechaInicioEst,
        fechaFinEst: body.fechaFinEst,
        createdAt: now, updatedAt: now,
    })

    return NextResponse.json({ bitacora: { id } }, { status: 201 })
}