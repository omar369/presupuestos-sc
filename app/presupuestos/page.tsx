"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function PresupuestosPage() {
  const router = useRouter();

  return (
    <main className="max-w-3xl mx-auto p-4 sm:p-6">
      <div className="mb-6 flex items-center gap-3 text-sm text-muted-foreground">
        <Link href="/" className="underline-offset-4 hover:underline">
          Inicio
        </Link>
        <span className="text-foreground/40">/</span>
        <span>Presupuestos</span>
      </div>

      <div className="border border-black rounded-md bg-secondary p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-semibold">Presupuestos</h1>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button className="w-full sm:w-auto" variant="outline" onClick={() => router.push("/")}>Inicio</Button>
            <Button className="w-full sm:w-auto" onClick={() => router.push("/presupuestos/nuevo")}>Crear nuevo</Button>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">Contenido simple por ahora…</p>
      </div>
    </main>
  );
}
