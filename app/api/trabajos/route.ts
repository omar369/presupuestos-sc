import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { trabajos } from '@/db/schema'
import { trabajoCreateSchema } from '@/features/trabajos/core/schema'
import { randomUUID } from 'crypto'

export async function POST(req: NextRequest) {
    try {
        const validatedData = trabajoCreateSchema.parse(await req.json())
        const now = new Date()

        const newTrabajo = {
            id: randomUUID(),
            ...validatedData,
            createdAt: now,
            updatedAt: now,
        }

        const result = await db.insert(trabajos).values(newTrabajo).returning()
        return NextResponse.json({ data: result[0] }, { status: 201 })
    } catch (error) {
        console.error('Error creating trabajo:', error)
        return NextResponse.json({ error: 'Failed to create trabajo' }, { status: 500 })
    }
}

export async function GET() {
    try {
        const allTrabajos = await db.select().from(trabajos)
        return NextResponse.json({ data: allTrabajos })
    } catch (error) {
        console.error('Error fetching trabajos:', error)
        return NextResponse.json({ error: 'Failed to fetch trabajos' }, { status: 500 })
    }
}
