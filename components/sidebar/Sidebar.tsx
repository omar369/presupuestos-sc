"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X, Menu } from "lucide-react";
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
  const [isCollapsed, setIsCollapsed] = React.useState(false);

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
        "fixed inset-y-0 left-0 z-20 shrink-0 transform border-r border-black bg-secondary p-4 transition-all duration-300 ease-in-out md:relative md:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        isCollapsed ? "md:w-16" : "md:w-64"
      )}
      style={{
        width: isSidebarOpen ? (isCollapsed ? "64px" : "256px") : undefined,
      }}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          {/* Hamburger button - only visible on desktop */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex shrink-0 h-8 w-8"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expandir menú" : "Colapsar menú"}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">
              {isCollapsed ? "Expandir menú" : "Colapsar menú"}
            </span>
          </Button>

          {/* Title - hidden when collapsed */}
          {!isCollapsed && (
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-semibold">Panel</h1>
              <p className="text-sm text-muted-foreground">Inicio (dashboard)</p>
            </div>
          )}
        </div>

        {/* Close button - only visible on mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden shrink-0"
          onClick={() => setIsSidebarOpen(false)}
        >
          <X className="h-6 w-6" />
          <span className="sr-only">Close Sidebar</span>
        </Button>
      </div>

      {/* Navigation - hidden when collapsed */}
      {!isCollapsed && (
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
              <NavItem
                href="/herramientas/trabajos"
                label="Trabajos"
                onClick={handleNavItemClick}
              />
            </div>
          </div>

          {/* TEMPORARILY DISABLED - presupuestoId functionality not in use */}
          {/* <div className="h-px bg-black/70 my-3" /> */}

          {/* <div> */}
          {/*   <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2"> */}
          {/*     Presupuestos */}
          {/*   </p> */}
          {/*   <div className="space-y-1"> */}
          {/*     <NavItem */}
          {/*       href="/presupuestos/nuevo" */}
          {/*       label="Nuevo" */}
          {/*       onClick={handleNavItemClick} */}
          {/*     /> */}
          {/*   </div> */}
          {/* </div> */}
        </nav>
      )}
    </aside>
  );
}


