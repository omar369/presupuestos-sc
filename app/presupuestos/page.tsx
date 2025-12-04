"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function PresupuestosPage() {
  const router = useRouter();

  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="mb-6 flex items-center gap-3 text-sm text-muted-foreground">
        <Link href="/" className="underline-offset-4 hover:underline">
          Inicio
        </Link>
        <span className="text-foreground/40">/</span>
        <span>Historial de Presupuestos</span>
      </div>

      <div className="border border-black rounded-md bg-secondary p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold">Historial de Presupuestos</h1>
          <Button className="w-full sm:w-auto" onClick={() => router.push("/presupuestos/nuevo")}>
            Crear Nuevo Presupuesto
          </Button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Aquí se mostrará la lista de todos los presupuestos guardados. (Pendiente de implementar)
        </p>
      </div>
    </main>
  );
}