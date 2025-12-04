"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function NavItem({ href, label, exact = true }: { href: string; label: string; exact?: boolean }) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "w-full justify-start border border-black bg-background",
        isActive && "bg-black/10 font-semibold"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
}

export function Sidebar() {
  return (
    <aside className="w-64 shrink-0 p-4 border border-black bg-secondary">
      <div className="mb-4">
        <h1 className="text-xl font-semibold">Panel</h1>
        <p className="text-sm text-muted-foreground">Inicio (dashboard)</p>
      </div>

      <nav className="space-y-1">
        <div className="mb-2">
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Herramientas</p>
          <NavItem href="/" label="Inicio" exact />
          <div className="mt-1 space-y-1">
            <NavItem href="/herramientas/agenda" label="Agenda" />
            <NavItem href="/herramientas/documentacion" label="Documentación" />
            <NavItem href="/herramientas/sobre-la-app" label="Sobre la app" />
          </div>
        </div>

        <div className="h-px bg-black/70 my-3" />

        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Presupuestos</p>
          <div className="space-y-1">
            <NavItem href="/presupuestos/nuevo" label="Nuevo" />
            <NavItem href="/presupuestos" label="Historial" exact={false} />
          </div>
        </div>
      </nav>
    </aside>
  );
}

