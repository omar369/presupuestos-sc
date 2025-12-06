import { useForm } from "react-hook-form";
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
import { budgetSchema } from "@/lib/schemas";
import type { BudgetData } from "@/lib/types";

type FormBudgetData = z.infer<typeof budgetSchema>;

export function BudgetForm({ onCreate }: { onCreate: (data: FormBudgetData) => void }) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormBudgetData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      cliente: "",
      direccion: "",
      tipoLugar: "CASA",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onCreate)}
      className="border border-input rounded-lg bg-secondary p-4 sm:p-5 space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="bf-cliente">Nombre cliente</Label>
          <Input
            id="bf-cliente"
            {...register("cliente")}
            placeholder="Ej: Juan Pérez"
            className="border-black"
          />
          {errors.cliente && <p className="text-sm text-red-600">{errors.cliente.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bf-direccion">Dirección</Label>
          <Input
            id="bf-direccion"
            {...register("direccion")}
            placeholder="Ej: Av. Siempre Viva 742"
            className="border-black"
          />
          {errors.direccion && <p className="text-sm text-red-600">{errors.direccion.message}</p>}
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="bf-tipo">Tipo de lugar</Label>
           {/* @ts-ignore */}
          <Select
            defaultValue={control._defaultValues.tipoLugar}
            onValueChange={(value) => setValue("tipoLugar", value as any)}
          >
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
          {errors.tipoLugar && <p className="text-sm text-red-600">{errors.tipoLugar.message}</p>}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" size="lg">Crear Presupuesto</Button>
      </div>
    </form>
  );
}
