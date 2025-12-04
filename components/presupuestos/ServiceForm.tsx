"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Service } from "./AreaForm"; // Reutilizamos la interfaz

// Omitimos 'id' ya que será generado al añadir el servicio
type ServiceFormData = Omit<Service, "id">;

interface ServiceFormProps {
  // La función onSubmit ahora recibe los datos del formulario del servicio
  onSubmit: (serviceData: ServiceFormData) => void;
  // Para cerrar el diálogo desde el formulario (ej. después de enviar)
  onClose: () => void;
}

const initialState: ServiceFormData = {
  tipoServicio: 'PINTURA',
  cantidadM2: 0,
  tipoSuperficie: 'LISO',
  marcaModelo: 'SCVinR',
};

export function ServiceForm({ onSubmit, onClose }: ServiceFormProps) {
  const [formData, setFormData] = useState<ServiceFormData>(initialState);

  const handleChange = (
    field: keyof ServiceFormData,
    value: any
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Opcional: Resetear el formulario después de enviar
    setFormData(initialState);
    onClose(); // Cierra el diálogo
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Tipo de Servicio */}
        <div className="space-y-1.5">
          <Label htmlFor="service-tipo">Tipo de Servicio</Label>
          <Select
            value={formData.tipoServicio}
            onValueChange={(v) => handleChange('tipoServicio', v as 'PINTURA')}
          >
            <SelectTrigger id="service-tipo" className="border-input">
              <SelectValue placeholder="Selecciona un tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PINTURA">PINTURA</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Cantidad M2 */}
        <div className="space-y-1.5">
          <Label htmlFor="service-m2">Cantidad M2</Label>
          <Input
            id="service-m2"
            type="number"
            value={formData.cantidadM2}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange('cantidadM2', parseFloat(e.target.value) || 0)
            }
            min={0}
            className="border-input"
          />
        </div>

        {/* Tipo de Superficie */}
        <div className="space-y-1.5">
          <Label htmlFor="service-superficie">Tipo de Superficie</Label>
          <Select
            value={formData.tipoSuperficie}
            onValueChange={(v) =>
              handleChange('tipoSuperficie', v as 'LISO' | 'RUGOSO' | 'EXTRARUGOSO')
            }
          >
            <SelectTrigger id="service-superficie" className="border-input">
              <SelectValue placeholder="Selecciona superficie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LISO">LISO</SelectItem>
              <SelectItem value="RUGOSO">RUGOSO</SelectItem>
              <SelectItem value="EXTRARUGOSO">EXTRARUGOSO</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Marca/Modelo */}
        <div className="space-y-1.5">
          <Label htmlFor="service-marca">Marca/Modelo (Compacta)</Label>
          <Input
            id="service-marca"
            type="text"
            value={formData.marcaModelo}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange('marcaModelo', e.target.value)
            }
            placeholder="Ej: SCVinR"
            className="border-input"
            disabled
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">Agregar Servicio</Button>
      </div>
    </form>
  );
}
