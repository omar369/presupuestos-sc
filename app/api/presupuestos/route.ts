import { NextResponse } from "next/server";
import { db } from "@/db";
import { clientes, presupuestos, areas, servicios } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

// POST: crea cliente + presupuesto + areas + servicios
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cliente, direccion, tipoLugar, areas: areasData, subtotal, impuestos, total } = body ?? {};

    if (!cliente || !direccion || !tipoLugar || !areasData || subtotal === undefined || impuestos === undefined || total === undefined) {
      return NextResponse.json(
        { error: "Faltan campos requeridos para crear el presupuesto." },
        { status: 400 }
      );
    }

    const result = await db.transaction(async (tx) => {
      const [insertedCliente] = await tx.insert(clientes).values({
        nombre: String(cliente),
        direccion: String(direccion),
        tipoLugar: String(tipoLugar) as any,
      }).returning();

      const clienteId = insertedCliente.id;

      const [insertedPresupuesto] = await tx.insert(presupuestos).values({
        clienteId,
        subtotal,
        impuestos,
        total,
      }).returning();

      const presupuestoId = insertedPresupuesto.id;

      for (const area of areasData) {
        const [insertedArea] = await tx.insert(areas).values({
          presupuestoId,
          nombre: area.name,
          ubicacion: area.location,
        }).returning();

        const areaId = insertedArea.id;

        if (area.services && area.services.length > 0) {
          for (const service of area.services) {
            await tx.insert(servicios).values({
              areaId,
              tipoServicio: service.tipoServicio,
              cantidadM2: service.cantidadM2,
              tipoSuperficie: service.tipoSuperficie,
              marcaModelo: service.marcaModelo,
              precioUnitario: service.precioUnitario,
              importe: service.importe,
            });
          }
        }
      }

      return { presupuestoId, clienteId };
    });

    return NextResponse.json({
      id: result.presupuestoId,
      clienteId: result.clienteId,
      message: "Presupuesto creado con éxito",
    });

  } catch (e: any) {
    console.error("POST /api/presupuestos error", e);
    return NextResponse.json({ error: "Error interno al crear el presupuesto" }, { status: 500 });
  }
}

// GET: lista presupuestos con datos del cliente
export async function GET() {
  try {
    const rows = await db
      .select({
        id: presupuestos.id,
        createdAt: presupuestos.createdAt,
        updatedAt: presupuestos.updatedAt,
        clienteId: presupuestos.clienteId,
        clienteNombre: clientes.nombre,
        clienteDireccion: clientes.direccion,
        tipoLugar: clientes.tipoLugar,
        total: presupuestos.total,
      })
      .from(presupuestos)
      .leftJoin(clientes, eq(presupuestos.clienteId, clientes.id))
      .orderBy(desc(presupuestos.createdAt));

    return NextResponse.json(rows);
  } catch (e: any) {
    console.error("GET /api/presupuestos error", e);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
