"use client";

import { useEffect, useState } from "react";
import type { Presupuesto, Area, Servicio, Cliente } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfPresupuesto from "./PdfPresupuesto"; // Asegúrate que la ruta es correcta

// Extendemos los tipos para incluir las relaciones que vienen de la consulta
type ServicioConPrecio = Servicio & { precioUnitario: number; importe: number; nombre: string; };
type AreaConServicios = Area & { servicios: ServicioConPrecio[] };
type PresupuestoCompleto = Presupuesto & {
  cliente: Cliente | null;
  areas: AreaConServicios[];
};

interface PresupuestoViewProps {
  budget: PresupuestoCompleto;
}

export function PresupuestoView({ budget }: PresupuestoViewProps) {
  const { cliente, areas, createdAt, subtotal, impuestos, total } = budget;

  // Estado para asegurar que el link de PDF solo se renderice en el cliente
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Preparamos los datos para el componente PDF
  const presupuestoDataForPdf = {
    id: budget.id,
    createdAt: budget.createdAt.toISOString(),
    clienteNombre: budget.cliente?.nombre || 'N/A',
    clienteDireccion: budget.cliente?.direccion || 'N/A',
    subtotal: budget.subtotal,
    impuestos: budget.impuestos,
    total: budget.total,
    areas: budget.areas.map(area => ({
      nombre: area.nombre,
      servicios: area.servicios.map(s => ({
        cantidadM2: s.cantidadM2,
        unidadDeMedida: s.unidadDeMedida,
        tipoServicio: s.tipoServicio,
        tipoSuperficie: s.tipoSuperficie,
        marcaModelo: s.marcaModelo,
        precioUnitario: s.precioUnitario,
        importe: s.importe,
        nombre: s.nombre,
      })),
    })),
  };

  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-6 bg-gray-50">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Link href="/presupuestos" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
          &larr; Volver al Historial
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            Imprimir Pantalla
          </Button>
          {isClient && (
            <PDFDownloadLink
              document={<PdfPresupuesto presupuesto={presupuestoDataForPdf} />}
              fileName={`presupuesto_${String(budget.id).padStart(4, '0')}.pdf`}
            >
              {({ loading }) => (
                <Button variant="default" size="sm">
                  {loading ? 'Generando PDF...' : 'Imprimir PDF'}
                </Button>
              )}
            </PDFDownloadLink>
          )}
        </div>
      </div>

      <Card className="w-full mx-auto shadow-lg print:shadow-none print:border-none">
        <CardHeader className="bg-gray-100 p-6 print:bg-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">PRESUPUESTO</h1>
              <p className="text-muted-foreground">Presupuestos SC</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-700">Presupuesto #{String(budget.id).padStart(4, '0')}</p>
              <p className="text-sm text-muted-foreground">
                Fecha: {new Date(createdAt).toLocaleDateString('es-MX')}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-sm font-semibold uppercase text-gray-500 mb-2">Cliente</h2>
              <p className="font-medium text-gray-800">{cliente?.nombre}</p>
              <p className="text-sm text-muted-foreground">{cliente?.direccion}</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase text-gray-500 mb-2">Proyecto</h2>
              <p className="font-medium text-gray-800">{cliente?.tipoLugar}</p>
            </div>
          </div>

          <div className="space-y-6">
            {areas.map(area => (
              <div key={area.id}>
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-lg text-gray-700">{area.nombre}</h3>
                  <Badge variant="outline">{area.ubicacion}</Badge>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left">
                      <tr>
                        <th className="font-semibold text-gray-600 p-2">Descripción</th>
                        <th className="font-semibold text-gray-600 p-2 text-right">Cantidad</th>
                        <th className="font-semibold text-gray-600 p-2 text-right">Precio Unit.</th>
                        <th className="font-semibold text-gray-600 p-2 text-right">Importe</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {area.servicios.map(service => ( // Corregido de 'services'
                        <tr key={service.id}>
                          <td className="p-2">
                            <p className="font-medium">{service.nombre}</p>
                          </td>
                          <td className="p-2 text-right">{service.cantidadM2.toFixed(2)} {service.unidadDeMedida}</td>
                          <td className="p-2 text-right">${service.precioUnitario.toFixed(2)}</td>
                          <td className="p-2 text-right font-medium">${service.importe.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="bg-gray-100 p-6 print:bg-white">
          <div className="w-full flex justify-end">
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Impuestos (16%)</span>
                <span className="font-medium">${impuestos.toFixed(2)}</span>
              </div>
              <div className="border-t my-2"></div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
      <div className="text-center mt-6 print:hidden">
        <p className="text-xs text-muted-foreground">Gracias por su preferencia.</p>
      </div>
    </main>
  );
}
