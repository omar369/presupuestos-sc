"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import React from "react";

function NavItem({
  href,
  label,
  exact = true,
  onClick,
}: {
  href: string;
  label: string;
  exact?: boolean;
  onClick?: () => void;
}) {
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
      onClick={onClick}
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
}

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Sidebar({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
  const pathname = usePathname();

  const handleNavItemClick = () => {
    if (window.innerWidth < 768) {
      // md breakpoint
      setIsSidebarOpen(false);
    }
  };

  React.useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [pathname, setIsSidebarOpen]);

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 w-64 shrink-0 transform border-r border-black bg-secondary p-4 transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold">Panel</h1>
          <p className="text-sm text-muted-foreground">Inicio (dashboard)</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        >
          <X className="h-6 w-6" />
          <span className="sr-only">Close Sidebar</span>
        </Button>
      </div>

      <nav className="space-y-1">
        <div className="mb-2">
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
            Herramientas
          </p>
          <NavItem href="/" label="Inicio" exact onClick={handleNavItemClick} />
          <div className="mt-1 space-y-1">
            <NavItem
              href="/herramientas/agenda"
              label="Agenda"
              onClick={handleNavItemClick}
            />
            <NavItem
              href="/herramientas/documentacion"
              label="Documentación"
              onClick={handleNavItemClick}
            />
            <NavItem
              href="/herramientas/sobre-la-app"
              label="Sobre la app"
              onClick={handleNavItemClick}
            />
          </div>
        </div>

        <div className="h-px bg-black/70 my-3" />

        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
            Presupuestos
          </p>
          <div className="space-y-1">
            <NavItem
              href="/presupuestos/nuevo"
              label="Nuevo"
              onClick={handleNavItemClick}
            />
            <NavItem
              href="/presupuestos"
              label="Historial"
              exact={false}
              onClick={handleNavItemClick}
            />
          </div>
        </div>
      </nav>
    </aside>
  );
}

