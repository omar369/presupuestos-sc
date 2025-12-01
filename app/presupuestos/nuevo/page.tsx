'use client';

import Link from 'next/link';
import { QuoteForm } from '@/components/presupuestos/QuoteForm';

export default function NuevoPresupuestoPage() {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="mb-6 flex items-center gap-3 text-sm text-muted-foreground">
        <Link href="/" className="underline-offset-4 hover:underline">Inicio</Link>
        <span className="text-foreground/40">/</span>
        <Link href="/presupuestos" className="underline-offset-4 hover:underline">Presupuestos</Link>
        <span className="text-foreground/40">/</span>
        <span>Nuevo</span>
      </div>

      <h1 className="text-2xl font-bold mb-4">Crear Nuevo Presupuesto</h1>

      <QuoteForm />
    </div>
  );
}
