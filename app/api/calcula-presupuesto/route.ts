import { NextResponse } from 'next/server';
import { ServiciosPrecios, getRangoM2Key } from '@/lib/lista_precios_servicio';

interface ServiceInput {
  id: string;
  areaName?: string;
  tipoServicio: 'PINTURA';
  ubicacion: 'INTERIOR' | 'EXTERIOR';
  cantidadM2: number;
  tipoSuperficie: 'LISO' | 'RUGOSO' | 'EXTRARUGOSO';
  marcaModelo: string;
}

interface DetailedServiceResult {
  id: string;
  areaName?: string;
  claveGenerada: string;
  precioPorM2: number;
  cantidadM2: number;
  costoTotal: number;
  error?: string;
}

interface CalculateQuoteResponse {
  totalGeneral: number;
  detallesServicios: DetailedServiceResult[];
  error?: string;
}

function buildClaveDeServicio(params: ServiceInput): string {
  const { tipoServicio, ubicacion, cantidadM2, tipoSuperficie, marcaModelo } = params;

  const ts = tipoServicio[0].toUpperCase();

  const ub = ubicacion[0].toUpperCase();

  const rm2 = getRangoM2Key(cantidadM2);

  let tsuf: string;
  if (tipoSuperficie === 'LISO') tsuf = 'L';
  else if (tipoSuperficie === 'RUGOSO') tsuf = 'R';
  else if (tipoSuperficie === 'EXTRARUGOSO') tsuf = 'X';
  else tsuf = 'X';

  const mm = marcaModelo;

  return `${ts}${ub}${rm2}${tsuf}${mm}`;
}


export async function POST(request: Request) {
  try {
    const services: ServiceInput[] = await request.json();

    if (!Array.isArray(services)) {
      return NextResponse.json(
        { error: 'El cuerpo de la petición debe ser un array de servicios.' },
        { status: 400 }
      );
    }

    let totalGeneral = 0;
    const detallesServicios: DetailedServiceResult[] = [];

    for (const service of services) {
      // Validaciones básicas de cada servicio
      if (!service.tipoServicio || !service.ubicacion || service.cantidadM2 === undefined || service.cantidadM2 < 0 || !service.tipoSuperficie || !service.marcaModelo) {
        detallesServicios.push({
          id: service.id,
          areaName: service.areaName,
          claveGenerada: "N/A",
          precioPorM2: 0,
          cantidadM2: service.cantidadM2,
          costoTotal: 0,
          error: `Datos incompletos o inválidos para el servicio con ID: ${service.id || 'desconocido'}.`
        });
        continue;
      }

      const claveGenerada = buildClaveDeServicio(service);

      // Buscar el precio en nuestra "base de datos" en memoria
      const preciosPorTipoServicio = ServiciosPrecios[service.tipoServicio];
      if (!preciosPorTipoServicio) {
        detallesServicios.push({
          id: service.id,
          areaName: service.areaName,
          claveGenerada: claveGenerada,
          precioPorM2: 0,
          cantidadM2: service.cantidadM2,
          costoTotal: 0,
          error: `Tipo de servicio '${service.tipoServicio}' no encontrado en la lista de precios.`,
        });
        continue;
      }

      const precioPorM2 = preciosPorTipoServicio[claveGenerada];

      if (precioPorM2 === undefined) {
        detallesServicios.push({
          id: service.id,
          areaName: service.areaName,
          claveGenerada: claveGenerada,
          precioPorM2: 0,
          cantidadM2: service.cantidadM2,
          costoTotal: 0,
          error: `Clave de servicio '${claveGenerada}' no encontrada en la lista de precios para '${service.tipoServicio}'.`,
        });
        continue;
      }

      const costoTotal = precioPorM2 * service.cantidadM2;
      totalGeneral += costoTotal;

      detallesServicios.push({
        id: service.id,
        areaName: service.areaName,
        claveGenerada: claveGenerada,
        precioPorM2: precioPorM2,
        cantidadM2: service.cantidadM2,
        costoTotal: costoTotal,
      });
    }

    return NextResponse.json({
      totalGeneral,
      detallesServicios,
    } as CalculateQuoteResponse);

  } catch (error) {
    console.error('Error al calcular la cotización:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al procesar la cotización.' },
      { status: 500 }
    );
  }
}
