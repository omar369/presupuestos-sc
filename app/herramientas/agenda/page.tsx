import { PageBreadcrumb } from "@/components/PageBreadcrumb";

export default function AgendaPage() {
  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-6">
      <PageBreadcrumb segments={[{ label: 'Agenda' }]} />

      <div className="border border-black rounded-md bg-secondary p-4 sm:p-6">
        <h1 className="text-2xl font-semibold">Agenda</h1>
        <p className="text-sm text-muted-foreground">(Pendiente de implementar)</p>
      </div>
    </main>
  );
}

