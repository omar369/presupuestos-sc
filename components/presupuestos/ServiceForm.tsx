"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
import { Combobox } from "@/components/ui/combobox";
import { MarcasModelos } from "@/lib/lista_marcas_modelos";
import { serviceSchema } from "@/lib/schemas";

type ServiceFormData = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  onSubmit: (serviceData: ServiceFormData) => void;
  onClose: () => void;
}

export function ServiceForm({ onSubmit, onClose }: ServiceFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      tipoServicio: 'PINTURA',
      cantidadM2: 0,
      tipoSuperficie: 'LISO',
      marcaModelo: MarcasModelos[0].value, // Set initial default from the list
    },
  });
  
  // Watch the 'marcaModelo' field to make the Combobox a controlled component
  const marcaModeloValue = useWatch({
    control,
    name: 'marcaModelo',
  });

  const processForm = (data: ServiceFormData) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(processForm)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Tipo de Servicio */}
        <div className="space-y-1.5">
          <Label htmlFor="service-tipo">Tipo de Servicio</Label>
          <Select
            defaultValue={control._defaultValues.tipoServicio}
            onValueChange={(value) => setValue('tipoServicio', value as 'PINTURA')}
          >
            <SelectTrigger id="service-tipo" className="border-input">
              <SelectValue placeholder="Selecciona un tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PINTURA">PINTURA</SelectItem>
            </SelectContent>
          </Select>
          {errors.tipoServicio && (
            <p className="text-sm text-red-500">{errors.tipoServicio.message}</p>
          )}
        </div>

        {/* Cantidad M2 */}
        <div className="space-y-1.5">
          <Label htmlFor="service-m2">Cantidad M2</Label>
          <Input
            id="service-m2"
            type="number"
            step="0.01"
            {...register('cantidadM2')}
            className="border-input"
          />
          {errors.cantidadM2 && (
            <p className="text-sm text-red-500">{errors.cantidadM2.message}</p>
          )}
        </div>

        {/* Tipo de Superficie */}
        <div className="space-y-1.5">
          <Label htmlFor="service-superficie">Tipo de Superficie</Label>
          <Select
            defaultValue={control._defaultValues.tipoSuperficie}
             onValueChange={(value) => setValue('tipoSuperficie', value as 'LISO' | 'RUGOSO' | 'EXTRARUGOSO')}
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
          {errors.tipoSuperficie && (
            <p className="text-sm text-red-500">{errors.tipoSuperficie.message}</p>
          )}
        </div>

        {/* Marca/Modelo */}
        <div className="space-y-1.5">
          <Label htmlFor="service-marca">Marca/Modelo</Label>
          <Combobox
            options={MarcasModelos}
            value={marcaModeloValue}
            onChange={(value) => setValue('marcaModelo', value, { shouldValidate: true })}
            placeholder="Selecciona una clave"
            searchPlaceholder="Busca una clave..."
            noResultsMessage="No se encontró la clave."
          />
          {errors.marcaModelo && (
            <p className="text-sm text-red-500">{errors.marcaModelo.message}</p>
          )}
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
