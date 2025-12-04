import Link from "next/link";

export default function SobreLaAppPage() {
  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="mb-6 flex items-center gap-3 text-sm text-muted-foreground">
        <Link href="/" className="underline-offset-4 hover:underline">Inicio</Link>
        <span className="text-foreground/40">/</span>
        <span>Herramientas</span>
        <span className="text-foreground/40">/</span>
        <span>Sobre la app</span>
      </div>

      <div className="border border-black rounded-md bg-secondary p-4 sm:p-6">
        <h1 className="text-2xl font-semibold">Sobre la app</h1>
        <p className="text-sm text-muted-foreground">(Pendiente de implementar)</p>
      </div>
    </main>
  );
}

