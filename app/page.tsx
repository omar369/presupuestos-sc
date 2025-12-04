import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <p className="text-sm text-muted-foreground">Resumen general y pendientes</p>
      </div>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="border border-black rounded-md bg-secondary p-4">
          <p className="text-sm text-muted-foreground">Presupuestos de hoy</p>
          <p className="text-3xl font-bold">3</p>
        </div>
        <div className="border border-black rounded-md bg-secondary p-4">
          <p className="text-sm text-muted-foreground">Pendientes</p>
          <p className="text-3xl font-bold">5</p>
        </div>
        <div className="border border-black rounded-md bg-secondary p-4">
          <p className="text-sm text-muted-foreground">Aprobados (semana)</p>
          <p className="text-3xl font-bold">8</p>
        </div>
      </section>

      {/* Pending + agenda preview */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="border border-black rounded-md bg-secondary p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Pendientes</h3>
            <Button asChild size="sm" variant="outline" className="border-black">
              <Link href="/herramientas/agenda">Ver agenda</Link>
            </Button>
          </div>
          <ul className="space-y-2">
            <li className="border border-black rounded-md bg-background p-3">Llamar a cliente ACME sobre revisión de propuesta</li>
            <li className="border border-black rounded-md bg-background p-3">Actualizar lista de precios de servicios</li>
            <li className="border border-black rounded-md bg-background p-3">Preparar presupuesto para evento sábado</li>
          </ul>
        </div>

        <div className="border border-black rounded-md bg-secondary p-4">
          <h3 className="font-semibold mb-3">Agenda de hoy</h3>
          <div className="border border-black rounded-md bg-background p-3">
            <p className="text-sm">09:00 - Reunión interna</p>
            <p className="text-sm">12:30 - Llamada con proveedor</p>
            <p className="text-sm">16:00 - Entrega propuesta</p>
          </div>
          <Button asChild className="w-full mt-3" variant="outline" size="sm">
            <Link href="/presupuestos/nuevo">Crear presupuesto</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
