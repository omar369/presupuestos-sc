"use client";

import { useState, FormEvent } from 'react';
import { Area, Service, AreaForm } from './AreaForm';
import { ServiceForm } from './ServiceForm';
import { BudgetForm, type BudgetData } from './BudgetForm';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Trash2 } from 'lucide-react';

// Interfaces de la respuesta de la API (similares al archivo original)
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

export function QuoteForm() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [totalGeneral, setTotalGeneral] = useState<number | null>(null);
  const [detailedResults, setDetailedResults] = useState<DetailedServiceResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [presupuesto, setPresupuesto] = useState<BudgetData | null>(null);

  // Controla quÃ© diÃ¡logo de "AÃ±adir Servicio" estÃ¡ abierto
  const [openDialogForArea, setOpenDialogForArea] = useState<string | null>(null);

  const handleAddArea = (newArea: Omit<Area, 'id' | 'services'>) => {
    setAreas((prev) => [
      ...prev,
      {
        ...newArea,
        id: `area-${Date.now()}`,
        services: [],
      },
    ]);
  };

  const handleRemoveArea = (areaId: string) => {
    setAreas(areas.filter((area) => area.id !== areaId));
  };

  const handleAddService = (areaId: string, serviceData: Omit<Service, 'id'>) => {
    setAreas(prevAreas =>
      prevAreas.map(area => {
        if (area.id === areaId) {
          const newService: Service = {
            ...serviceData,
            id: `service-${Date.now()}`
          };
          return { ...area, services: [...area.services, newService] };
        }
        return area;
      })
    );
  };

  const handleRemoveService = (areaId: string, serviceId: string) => {
    setAreas(areas.map(area => {
      if (area.id === areaId) {
        return { ...area, services: area.services.filter(s => s.id !== serviceId) };
      }
      return area;
    }));
  };

  const handleSave = async () => {
    if (!presupuesto) {
      setError("No hay datos del presupuesto para guardar.");
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      ...presupuesto,
      areas: areas.map(area => ({
        ...area,
        id: undefined, // El ID de frontend no es necesario en el backend
        services: area.services.map(service => ({
          ...service,
          id: undefined, // El ID de frontend no es necesario
        }))
      }))
    };

    try {
      const response = await fetch('/api/presupuestos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al guardar el presupuesto.");
      }

      alert('Presupuesto guardado con éxito!');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setTotalGeneral(null);
    setDetailedResults([]);

    // Transformar la estructura de 'areas' a la que espera la API
    const apiPayload = areas.flatMap(area =>
      area.services.map(service => ({
        ...service,
        ubicacion: area.location, // Añadimos la ubicación del área
        areaName: area.name //Añadimos el nombre del área
      }))
    );

    if (apiPayload.length === 0) {
      setError("No hay servicios para cotizar. Agregue al menos un área y un servicio.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/calcula-presupuesto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload),
      });

      if (!response.ok) {
        const errorData: CalculateQuoteResponse = await response.json();
        throw new Error(errorData.error || 'Error desconocido al calcular el presupuesto.');
      }

      const result: CalculateQuoteResponse = await response.json();
      setTotalGeneral(result.totalGeneral);
      setDetailedResults(result.detallesServicios);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Paso 1: Crear Presupuesto */}
      {!presupuesto ? (
        <BudgetForm onCreate={(data) => setPresupuesto(data)} />
      ) : (
        <div className="border border-input rounded-lg bg-secondary p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="text-lg font-semibold">Presupuesto</h3>
              <p className="text-sm text-muted-foreground">
                {presupuesto.cliente} • {presupuesto.direccion} • {presupuesto.tipoLugar}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Paso 2: Áreas y Servicios */}
      {presupuesto && (
        <AreaForm onAddArea={handleAddArea} />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {presupuesto && (
          <Accordion type="multiple" className="w-full space-y-3">
            {areas.map(area => (
              <AccordionItem value={area.id} key={area.id} className="border border-input rounded-lg bg-background">
                <AccordionTrigger className="px-4 text-lg font-medium hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <span>{area.name} <span className="text-sm font-normal text-muted-foreground">({area.location})</span></span>
                    <div
                      role="button"
                      aria-label="Eliminar área"
                      onClick={(e) => {
                        e.stopPropagation(); // Previene que el acordeón se abra/cierre
                        handleRemoveArea(area.id);
                      }}
                      className="mr-2 p-2 rounded-full hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 border-t border-input">
                  <div className="space-y-3">
                    {area.services.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">No hay servicios en esta área.</p>
                    ) : (
                      <ul className="space-y-2">
                        {area.services.map(service => (
                          <li key={service.id} className="flex items-center justify-between p-2 rounded-md bg-secondary/50">
                            <span className="text-sm">{service.tipoServicio} - {service.cantidadM2}m² - {service.tipoSuperficie}</span>
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveService(area.id, service.id)}>
                              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}

                    <Dialog open={openDialogForArea === area.id} onOpenChange={(isOpen) => setOpenDialogForArea(isOpen ? area.id : null)}>
                      <DialogTrigger asChild>
                        <Button type="button" variant="outline" className="w-full">
                          <Plus className="mr-2 h-4 w-4" />
                          Agregar Servicio
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Añadir Servicio a "{area.name}"</DialogTitle>
                        </DialogHeader>
                        <ServiceForm
                          onSubmit={(serviceData) => handleAddService(area.id, serviceData)}
                          onClose={() => setOpenDialogForArea(null)}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}

        {presupuesto && areas.length > 0 && (
          <div className="flex justify-end pt-4 gap-x-4">
            <Button type="submit" disabled={loading} size="sm">
              {loading ? 'Actualizando…' : 'Actualizar Sub-total'}
            </Button>
            <Button type="button" onClick={handleSave} disabled={loading} size="sm" variant="secondary">
              {loading ? 'Guardando…' : 'Guardar Presupuesto'}
            </Button>
          </div>
        )}
      </form>

      {error && (
        <p className="text-sm text-red-600 font-medium p-4 bg-destructive/10 rounded-lg">{error}</p>
      )}

      {totalGeneral !== null && (
        <div className="mt-6 border border-input rounded-lg bg-secondary p-4 sm:p-5">
          {/* Encabezado con el total */}
          <div className='flex justify-between items-start mb-6'>
            <div>
              <h3 className="text-lg font-semibold">Resultados del Presupuesto</h3>
              <p className="text-xs text-muted-foreground">Desglose de los servicios cotizados.</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total General</p>
              <p className="text-2xl font-bold">${totalGeneral.toFixed(2)}</p>
            </div>
          </div>

          {/* Contenedor de la tabla de detalles */}
          <div className="space-y-4">
            {/* Encabezados de la tabla */}
            <div className="grid grid-cols-5 gap-4 text-xs text-muted-foreground font-medium border-b pb-2">
              <div className="col-span-1">Área</div>
              <div className="col-span-1">Servicio</div>
              <div className="col-span-1 text-right">Total m²</div>
              <div className="col-span-1 text-right">Precio/m²</div>
              <div className="col-span-1 text-right">Sub-total</div>
            </div>

            {/* Filas de datos */}
            <div className="space-y-3">
              {detailedResults.map((d) => (
                <div key={d.id} className="grid grid-cols-5 gap-4 items-center border-b border-dashed border-border/50 pb-3">
                  <div className="col-span-1 font-medium">{d.areaName}</div>
                  <div className="col-span-1 text-xs text-muted-foreground">{d.claveGenerada}</div>
                  <div className="col-span-1 text-right text-xs">{d.cantidadM2.toFixed(2)} m²</div>
                  <div className="col-span-1 text-right text-xs">${d.precioPorM2.toFixed(2)}</div>
                  <div className="col-span-1 text-right text-xs font-semibold">${d.costoTotal.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
