import { NextResponse } from "next/server";
import { db } from "@/db";
import { croquis } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(_req: Request, { params }: { params: Promise<{ croquisId: string }> }) {
    const { croquisId } = await params
    const row = await db.select({ payloadJson: croquis.payloadJson, trabajoId: croquis.trabajoId }).from(croquis).where(eq(croquis.id, croquisId)).get()
    if (!row) return NextResponse.json({ error: 'Croquis no encontrado' }, { status: 404 })
    return NextResponse.json({ croquis: row })
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ croquisId: string }> }
) {
    const { croquisId } = await params;
    const body = await req.json();

    const now = new Date().toISOString();

    if (typeof body?.payloadJson === "string") {
        const updated = await db
            .update(croquis)
            .set({ payloadJson: body.payloadJson, updatedAt: now })
            .where(eq(croquis.id, croquisId))
            .returning({ id: croquis.id, updatedAt: croquis.updatedAt });

        if (updated.length === 0)
            return NextResponse.json({ error: "Croquis no encontrado" }, { status: 404 });

        return NextResponse.json({ croquis: updated[0] });
    }

    if (typeof body?.name === "string") {
        const updated = await db
            .update(croquis)
            .set({ name: body.name, updatedAt: now })
            .where(eq(croquis.id, croquisId))
            .returning({ id: croquis.id, name: croquis.name, updatedAt: croquis.updatedAt });

        if (updated.length === 0)
            return NextResponse.json({ error: "Croquis no encontrado" }, { status: 404 });

        return NextResponse.json({ croquis: updated[0] });
    }

    return NextResponse.json(
        { error: "Se requiere payloadJson (string) o name (string)" },
        { status: 400 }
    );
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ croquisId: string }> }) {
    const { croquisId } = await params
    await db.delete(croquis).where(eq(croquis.id, croquisId))
    return NextResponse.json({ ok: true })
}
