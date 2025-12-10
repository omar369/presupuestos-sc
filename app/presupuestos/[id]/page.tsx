import { db } from "@/db";
import { notFound } from "next/navigation";
import { PresupuestoView } from "@/components/presupuestos/PresupuestoView";
import { AlertTriangle, ServerCrash } from "lucide-react";
import { ServiciosPrecios } from "@/lib/lista_precios_servicio";
import { MarcasModelos } from "@/lib/lista_marcas_modelos";
import { Servicio } from "@/db/schema"; // Importar el tipo Servicio de Drizzle

// Función para obtener la descripción legible del servicio
function getServiceDescription(service: Servicio): string {
  const { tipoServicio, tipoSuperficie, marcaModelo, unidadDeMedida } = service;

  const tipoProducto = tipoServicio.toLowerCase(); // 'pintura'

  // Mapear el tipo de superficie
  let superficieAcabado: string;
  if (tipoSuperficie === 'LISO') superficieAcabado = 'acabado liso';
  else if (tipoSuperficie === 'RUGOSO') superficieAcabado = 'acabado rugoso';
  else superficieAcabado = 'acabado extra rugoso'; // EXTRARUGOSO

  // Buscar el nombre de la marca/modelo
  const marcaModeloDetalle = MarcasModelos.find(m => m.value === marcaModelo);
  const nombreMarcaModelo = marcaModeloDetalle ? marcaModeloDetalle.label : marcaModelo;

  // Determinar el tipo de pintura/producto para la descripción
  let tipoDeProductoDescriptivo: string;
  let marcaModeloConTipo: string = nombreMarcaModelo;

  if (tipoProducto === 'pintura') {
    if (nombreMarcaModelo.includes('Vinilica')) {
      tipoDeProductoDescriptivo = 'pintura vinílica';
    } else if (nombreMarcaModelo.includes('Esmalte')) {
      tipoDeProductoDescriptivo = 'pintura de esmalte';
      marcaModeloConTipo = `marca ${nombreMarcaModelo}`;
    } else {
      tipoDeProductoDescriptivo = 'pintura';
    }
  } else if (tipoProducto === 'esmalte') {
    tipoDeProductoDescriptivo = 'pintura de esmalte';
    marcaModeloConTipo = `marca ${nombreMarcaModelo}`;
  } else if (tipoProducto === 'epoxico') {
    tipoDeProductoDescriptivo = 'pintura epóxica';
    marcaModeloConTipo = `marca ${nombreMarcaModelo}`;
  } else if (tipoProducto === 'sello') {
    tipoDeProductoDescriptivo = 'sellador acrílico';
  } else {
    tipoDeProductoDescriptivo = tipoProducto; // Fallback
  }

  // Intentar extraer la ubicación de la clave de servicio si es posible
  // Esto es un poco más complejo ya que la clave no está disponible directamente aquí.
  // Podríamos inferirlo de la `area.ubicacion` pero `service` no tiene `area.ubicacion` directamente.
  // Por ahora, asumiremos que la ubicación se puede deducir o no es crítica para esta descripción.
  // O mejor, obtengamos la ubicación desde la clave si es que la clave se generó correctamente con ella.
  // Para este punto, el `service` objeto proviene de la DB y no contiene la ubicacion del área
  // por lo que no podemos inferir "para interior" o "para exterior" fácilmente aquí sin más datos.
  // Dejaré la ubicación como "N/A" o omitida por ahora, o buscaré una forma de pasarla.

  // Como la clave completa se genera en el frontend y en la API de cálculo, pero no está en el objeto 'Servicio' de la DB,
  // Necesitamos adaptar la descripción sin la ubicación.

  // Re-evaluando la descripción del usuario:
  // "Servicio de aplicación de (y ahí tomas el tipo de producto: pintura),
  // (luego el tipo de pintura), (luego marca modelo),
  // luego mencionas el tipo de superficie (acabado liso, rugoso o Ex rug.

  // Nueva Construcción simplificada sin ubicación (ya que no la tenemos en el objeto 'servicio' de la DB directamente)
  return `Servicio de aplicación de ${tipoDeProductoDescriptivo} ${marcaModeloConTipo} en superficie con ${superficieAcabado}.`;
}

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

  // 4. Enriquecer el objeto budget con el nombre descriptivo del servicio
  const enrichedBudget = {
    ...budget,
    areas: budget.areas.map(area => ({
      ...area,
      servicios: area.servicios.map(service => ({
        ...service,
        nombre: getServiceDescription(service), // Agregamos el nombre descriptivo
      })),
    })),
  };

  // 5. Renderizado del componente de cliente
  // @ts-ignore - Se usa porque el tipo anidado de Drizzle es complejo, pero estructuralmente compatible.
  return <PresupuestoView budget={enrichedBudget} />;
}
