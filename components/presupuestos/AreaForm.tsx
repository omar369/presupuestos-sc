"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PlusCircle } from "lucide-react";
import { areaFormSchema } from "@/lib/schemas";
import type { Area, Service } from "@/lib/types";

type AreaFormData = z.infer<typeof areaFormSchema>;

interface AreaFormProps {
  onAddArea: (area: AreaFormData) => void;
}

export function AreaForm({ onAddArea }: AreaFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AreaFormData>({
    resolver: zodResolver(areaFormSchema),
    defaultValues: {
      name: "",
      location: "EXTERIOR",
    },
  });

  const processSubmit = (data: AreaFormData) => {
    onAddArea(data);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(processSubmit)}
      className="border border-input rounded-lg p-4 bg-secondary space-y-4"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
        <div className="space-y-2 flex-grow w-full">
          <Label htmlFor="area-name">Nombre del Área</Label>
          <Input
            id="area-name"
            {...register("name")}
            placeholder="Ej: Cocina, Fachada Principal"
            className="border-black"
          />
          {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Ubicación</Label>
          {/* @ts-ignore */}
          <RadioGroup
            defaultValue={control._defaultValues.location}
            onValueChange={(value: "INTERIOR" | "EXTERIOR") => setValue("location", value)}
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
          {errors.location && <p className="text-sm text-red-600">{errors.location.message}</p>}
        </div>
        <Button type="submit" className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Agregar Área
        </Button>
      </div>
    </form>
  );
}
