"use client";

import { useState, FormEvent } from "react";
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

export type TipoLugar =
  | "CASA"
  | "DEPARTAMENTO"
  | "BODEGA"
  | "LOCAL"
  | "OFICINA"
  | "OTRO";

export interface BudgetData {
  cliente: string;
  direccion: string;
  tipoLugar: TipoLugar;
}

export function BudgetForm({ onCreate }: { onCreate: (data: BudgetData) => void }) {
  const [cliente, setCliente] = useState("");
  const [direccion, setDireccion] = useState("");
  const [tipoLugar, setTipoLugar] = useState<TipoLugar>("CASA");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!cliente.trim() || !direccion.trim() || !tipoLugar) {
      setError("Completa todos los campos para crear el presupuesto.");
      return;
    }
    onCreate({ cliente: cliente.trim(), direccion: direccion.trim(), tipoLugar });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-input rounded-lg bg-secondary p-4 sm:p-5 space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="bf-cliente">Nombre cliente</Label>
          <Input
            id="bf-cliente"
            value={cliente}
            onChange={(e) => {
              setCliente(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Ej: Juan Pérez"
            className="border-black"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bf-direccion">Dirección</Label>
          <Input
            id="bf-direccion"
            value={direccion}
            onChange={(e) => {
              setDireccion(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Ej: Av. Siempre Viva 742"
            className="border-black"
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="bf-tipo">Tipo de lugar</Label>
          <Select value={tipoLugar} onValueChange={(v) => setTipoLugar(v as TipoLugar)}>
            <SelectTrigger id="bf-tipo" className="border-input">
              <SelectValue placeholder="Selecciona tipo de lugar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CASA">Casa</SelectItem>
              <SelectItem value="DEPARTAMENTO">Departamento</SelectItem>
              <SelectItem value="BODEGA">Bodega</SelectItem>
              <SelectItem value="LOCAL">Local</SelectItem>
              <SelectItem value="OFICINA">Oficina</SelectItem>
              <SelectItem value="OTRO">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end">
        <Button type="submit" size="lg">Crear Presupuesto</Button>
      </div>
    </form>
  );
}

