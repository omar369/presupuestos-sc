import { db } from "@/db";
import { notFound } from "next/navigation";
import { PresupuestoView } from "@/components/presupuestos/PresupuestoView";
import { AlertTriangle, ServerCrash } from "lucide-react";

type PresupuestoPageProps = {
  params: {
    id: string;
  };
};

/**
 * Esta es una Página de Servidor (Server Page) de Next.js para mostrar un presupuesto específico.
 * En Next.js 15+, el objeto `params` es una Promesa que debe ser resuelta.
 * @see https://nextjs.org/docs/messages/sync-dynamic-apis
 */
export default async function PresupuestoPage({ params }: PresupuestoPageProps) {
  
  // En Next.js 15+, `params` es una promesa y debe ser resuelta con `await`.
  const resolvedParams = await params;
  const presupuestoId = parseInt(resolvedParams.id, 10);

  // 1. Validación del parámetro de la URL
  if (isNaN(presupuestoId)) {
    notFound();
  }

  let budget;

  // 2. Obtención de datos con Drizzle ORM
  try {
    budget = await db.query.presupuestos.findFirst({
      where: (presupuestos, { eq }) => eq(presupuestos.id, presupuestoId),
      with: {
        cliente: true,
        areas: {
          with: {
            servicios: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error al obtener el presupuesto desde la base de datos:", error);
    return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[80vh] text-center">
        <ServerCrash className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-red-600">Error del Servidor</h1>
        <p className="text-gray-500 mt-2">
          No se pudo establecer conexión con la base de datos.
          <br />
          Por favor, inténtelo de nuevo más tarde.
        </p>
      </div>
    );
  }

  // 3. Manejo del caso "No Encontrado"
  if (!budget) {
    return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[80vh] text-center">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
        <h1 className="text-2xl font-bold">Presupuesto No Encontrado</h1>
        <p className="text-gray-500 mt-2">
          El presupuesto con el ID <span className="font-mono">{presupuestoId}</span> no existe.
        </p>
      </div>
    );
  }

  // 4. Renderizado del componente de cliente
  // @ts-ignore - Se usa porque el tipo anidado de Drizzle es complejo, pero estructuralmente compatible.
  return <PresupuestoView budget={budget} />;
}
