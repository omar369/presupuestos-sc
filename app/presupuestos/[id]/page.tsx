import { db } from "@/db";
import { notFound } from "next/navigation";
import { PresupuestoView } from "@/components/presupuestos/PresupuestoView";

type PresupuestoPageProps = {
  params: {
    id: string;
  };
};


export default async function PresupuestoPage({
  params,
}: PresupuestoPageProps) {

  const presupuestoId = parseInt(params.id, 10);
  if (isNaN(presupuestoId)) {
    notFound();
  }

  // La consulta a la base de datos se hace en el servidor
  const budget = await db.query.presupuestos.findFirst({
    where: (presupuestos, { eq }) => eq(presupuestos.id, presupuestoId),
    with: {
      cliente: true,
      areas: {
        with: {
          servicios: true, // Corregido de 'services' a 'servicios'
        },
      },
    },
  });

  if (!budget) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-2xl font-bold">Presupuesto No Encontrado</h1>
        <p className="text-gray-500">El presupuesto con el ID proporcionado no existe.</p>
      </div>
    );
  }

  // Pasamos los datos al componente cliente para que los renderice
  // @ts-ignore - El tipo de `budget` de la consulta es compatible pero TypeScript se queja
  return <PresupuestoView budget={budget} />;
}
