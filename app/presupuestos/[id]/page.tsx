// TEMPORARILY DISABLED - presupuestoId functionality not in use
// import { db } from "@/db";
// import { notFound } from "next/navigation";
// import { PresupuestoView } from "@/components/presupuestos/PresupuestoView";
// import { AlertTriangle, ServerCrash } from "lucide-react";
// import { ServiciosPrecios } from "@/lib/lista_precios_servicio";
// import { MarcasModelos } from "@/lib/lista_marcas_modelos";
// import { Servicio } from "@/db/schema";

export default function PresupuestoPage() {
  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="border border-black rounded-md bg-secondary p-4 sm:p-6">
        <h1 className="text-2xl font-semibold mb-4">Funcionalidad Deshabilitada</h1>
        <p className="text-muted-foreground">
          La funcionalidad de presupuestos está temporalmente deshabilitada debido a modificaciones en la aplicación.
        </p>
      </div>
    </main>
  );
}
