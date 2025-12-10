import { NextResponse } from 'next/server';
import { ServiciosPrecios, getRangoM2Key } from '@/lib/lista_precios_servicio';

interface ServiceInput {
  id: string;
  areaName?: string;
  tipoServicio: 'PINTURA' | 'ESMALTE' | 'EPOXICO' | 'SELLO' | 'OTROS';
  ubicacion: 'INTERIOR' | 'EXTERIOR';
  cantidadM2: string; // Acepta string desde el frontend
  unidadDeMedida: 'm2' | 'ml';
  tipoSuperficie: 'LISO' | 'RUGOSO' | 'EXTRARUGOSO' | 'SENCILLO' | 'MEDIO' | 'RUGOSO';
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
  subtotal: number;
  impuestos: number;
  total: number;
  detallesServicios: DetailedServiceResult[];
  error?: string;
}

function buildClaveDeServicio(params: {
  tipoServicio: 'PINTURA' | 'ESMALTE' | 'EPOXICO' | 'SELLO' | 'OTROS';
  ubicacion: 'INTERIOR' | 'EXTERIOR';
  cantidadM2: number; // Espera número para el cálculo
  unidadDeMedida: 'm2' | 'ml';
  tipoSuperficie: 'LISO' | 'RUGOSO' | 'EXTRARUGOSO' | 'SENCILLO' | 'MEDIO' | 'DIFICIL';
  marcaModelo: string;
}): string {
  const { tipoServicio, ubicacion, cantidadM2, tipoSuperficie, marcaModelo, unidadDeMedida } = params;

  const ts = tipoServicio[0].toUpperCase();

  const ub = ubicacion[0].toUpperCase();

  const rm2 = getRangoM2Key(cantidadM2);

  let tsuf: string;
  if (tipoSuperficie === 'LISO') tsuf = 'L';
  else if (tipoSuperficie === 'RUGOSO') tsuf = 'R';
  else if (tipoSuperficie === 'EXTRARUGOSO') tsuf = 'X';
  else if (tipoSuperficie === 'SENCILLO') tsuf = 'S';
  else if (tipoSuperficie === 'MEDIO') tsuf = 'M';
  else if (tipoSuperficie === 'DIFICIL') tsuf = 'D';
  else tsuf = 'ERR';

  const mm = marcaModelo;

  // Se añade la unidad de medida a la clave para diferenciar precios si es necesario en el futuro
  const um = unidadDeMedida.toUpperCase();

  return `${ts}${ub}${rm2}${tsuf}${mm}${um}`;
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

    let subtotal = 0;
    const detallesServicios: DetailedServiceResult[] = [];

    for (const service of services) {
      const cantidadM2Num = parseFloat(service.cantidadM2);

      // Validaciones básicas de cada servicio
      if (!service.tipoServicio || !service.ubicacion || !service.cantidadM2 || isNaN(cantidadM2Num) || cantidadM2Num < 0 || !service.tipoSuperficie || !service.marcaModelo || !service.unidadDeMedida) {
        detallesServicios.push({
          id: service.id,
          areaName: service.areaName,
          claveGenerada: "N/A",
          precioPorM2: 0,
          cantidadM2: isNaN(cantidadM2Num) ? 0 : cantidadM2Num,
          costoTotal: 0,
          error: `Datos incompletos o inválidos para el servicio con ID: ${service.id || 'desconocido'}.`
        });
        continue;
      }

      const claveGenerada = buildClaveDeServicio({ ...service, cantidadM2: cantidadM2Num });

      // Buscar el precio en nuestra "base de datos" en memoria
      const preciosPorTipoServicio = ServiciosPrecios[service.tipoServicio];
      if (!preciosPorTipoServicio) {
        detallesServicios.push({
          id: service.id,
          areaName: service.areaName,
          claveGenerada: claveGenerada,
          precioPorM2: 0,
          cantidadM2: cantidadM2Num,
          costoTotal: 0,
          error: `Tipo de servicio '${service.tipoServicio}' no encontrado en la lista de precios.`,
        });
        continue;
      }

      const serviceInfo = preciosPorTipoServicio[claveGenerada];

      if (serviceInfo === undefined) {
        detallesServicios.push({
          id: service.id,
          areaName: service.areaName,
          claveGenerada: claveGenerada,
          precioPorM2: 0,
          cantidadM2: cantidadM2Num,
          costoTotal: 0,
          error: `Clave de servicio '${claveGenerada}' no encontrada en la lista de precios para '${service.tipoServicio}'.`,
        });
        continue;
      }

      const costoTotal = serviceInfo.precio * cantidadM2Num;
      subtotal += costoTotal;

      detallesServicios.push({
        id: service.id,
        areaName: service.areaName,
        claveGenerada: claveGenerada,
        precioPorM2: serviceInfo.precio,
        cantidadM2: cantidadM2Num,
        costoTotal: costoTotal,
      });
    }

    const impuestos = subtotal * 0.16;
    const total = subtotal + impuestos;

    return NextResponse.json({
      subtotal,
      impuestos,
      total,
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
