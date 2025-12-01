// components/presupuestos/AreaForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PlusCircle } from "lucide-react";

// Esto podría moverse a un archivo de tipos compartido, ej: 'types/cotizaciones.ts'
export interface Area {
  id: string;
  name: string;
  location: "INTERIOR" | "EXTERIOR";
  services: Service[];
}

export interface Service {
    id: string;
    tipoServicio: 'PINTURA';
    cantidadM2: number;
    tipoSuperficie: 'LISO' | 'RUGOSO' | 'EXTRARUGOSO';
    marcaModelo: string;
}

interface AreaFormProps {
  onAddArea: (area: Omit<Area, 'id' | 'services'>) => void;
}

export function AreaForm({ onAddArea }: AreaFormProps) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState<"INTERIOR" | "EXTERIOR">("EXTERIOR");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("El nombre del área es obligatorio.");
      return;
    }
    onAddArea({ name, location });
    setName("");
    setLocation("EXTERIOR");
    setError(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-input rounded-lg p-4 bg-secondary space-y-4"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
        <div className="space-y-2 flex-grow w-full">
          <Label htmlFor="area-name">Nombre del Área</Label>
          <Input
            id="area-name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Ej: Cocina, Fachada Principal"
            className="border-black"
          />
        </div>
        <div className="space-y-2">
          <Label>Ubicación</Label>
          <RadioGroup
            value={location}
            onValueChange={(value: "INTERIOR" | "EXTERIOR") => setLocation(value)}
            className="flex items-center space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="INTERIOR" id="r-interior" />
              <Label htmlFor="r-interior">Interior</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="EXTERIOR" id="r-exterior" />
              <Label htmlFor="r-exterior">Exterior</Label>
            </div>
          </RadioGroup>
        </div>
        <Button type="submit" className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Agregar Área
        </Button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
