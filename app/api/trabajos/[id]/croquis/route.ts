import { NextResponse } from 'next/server'
import { db } from '@/db'
import { croquis } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: trabajoId } = await params

    const rows = await db
        .select({
            id: croquis.id,
            name: croquis.name,
            updatedAt: croquis.updatedAt,
        })
        .from(croquis)
        .where(eq(croquis.trabajoId, trabajoId))
        .limit(1)

    // Return single croquis object or null (1:1 relationship)
    return NextResponse.json({ croquis: rows[0] || null })
}

export async function POST(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: trabajoId } = await params

    // Check if croquis already exists for this trabajo (1:1 relationship)
    const existing = await db
        .select({ id: croquis.id })
        .from(croquis)
        .where(eq(croquis.trabajoId, trabajoId))
        .limit(1)

    if (existing.length > 0) {
        return NextResponse.json(
            { error: 'Ya existe un croquis para este trabajo' },
            { status: 409 }
        )
    }

    const id = crypto.randomUUID()
    const now = new Date().toISOString()

    await db.insert(croquis).values({
        id,
        trabajoId,
        name: 'Nuevo croquis',
        docVersion: '1',
        payloadJson: JSON.stringify({
            doc: { id, docVersion: 1, entities: {}, order: [] },
            background: null,
            bgTransform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, locked: true },
            svgRoot: null,
        }),
        createdAt: now,
        updatedAt: now,
    })

    return NextResponse.json({ croquis: { id } }, { status: 201 })
}