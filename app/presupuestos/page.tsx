// TEMPORARILY DISABLED - presupuestoId functionality not in use
// "use client";

// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { useEffect, useState } from "react";

// // Define the type for a budget based on the API response
// type Budget = {
//   id: number;
//   createdAt: string;
//   updatedAt: string;
//   clienteId: number;
//   clienteNombre: string;
//   clienteDireccion: string;
//   tipoLugar: string;
//   total: number;
// };

// export default function PresupuestosPage() {
//   const router = useRouter();
//   const [budgets, setBudgets] = useState<Budget[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchBudgets = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch("/api/presupuestos");
//         if (!response.ok) {
//           throw new Error("Error al cargar los presupuestos");
//         }
//         const data = await response.json();
//         setBudgets(data);
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBudgets();
//   }, []);

//   return (
//     <main className="max-w-4xl mx-auto p-4 sm:p-6">
//       <div className="mb-6 flex items-center gap-3 text-sm text-muted-foreground">
//         <Link href="/" className="underline-offset-4 hover:underline">
//           Inicio
//         </Link>
//         <span className="text-foreground/40">/</span>
//         <span>Historial de Presupuestos</span>
//       </div>

//       <div className="border border-black rounded-md bg-secondary p-4 sm:p-6">
//         <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//           <h1 className="text-2xl font-semibold">Historial de Presupuestos</h1>
//           <Button className="w-full sm:w-auto" onClick={() => router.push("/presupuestos/nuevo")}>
//             Crear Nuevo Presupuesto
//           </Button>
//         </div>

//         {loading && <p className="mt-4 text-center">Cargando presupuestos...</p>}
//         {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

//         {!loading && !error && (
//           <div className="mt-6 flow-root">
//             <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
//               <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
//                 {budgets.length > 0 ? (
//                   <div className="divide-y divide-gray-300">
//                     <div className="grid grid-cols-4 gap-x-4 px-2 py-2 text-left text-xs font-semibold text-muted-foreground">
//                       <div className="col-span-2">Cliente / Dirección</div>
//                       <div>Fecha</div>
//                       <div className="text-right">Total</div>
//                     </div>
//                     {budgets.map((budget) => (
//                       <Link
//                         key={budget.id}
//                         href={`/presupuestos/${budget.id}`}
//                         className="grid grid-cols-4 gap-x-4 px-2 py-4 text-sm text-foreground hover:bg-gray-100/50"
//                       >
//                         <div className="col-span-2">
//                           <p className="font-medium">{budget.clienteNombre}</p>
//                           <p className="text-xs text-muted-foreground">{budget.clienteDireccion}</p>
//                         </div>
//                         <div>{new Date(budget.createdAt).toLocaleDateString()}</div>
//                         <div className="text-right font-medium">${budget.total.toFixed(2)}</div>
//                       </Link>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="mt-4 text-sm text-muted-foreground text-center">
//                     No hay presupuestos guardados.
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }

export default function PresupuestosPage() {
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
