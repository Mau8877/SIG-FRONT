import { Link } from "@tanstack/react-router"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigationItems = [
  { label: "Inicio", hash: undefined },
  { label: "Como funciona", hash: "como-funciona" },
  { label: "Beneficios", hash: "beneficios" },
]

export function HeaderHome() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-bold text-foreground"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
            Miraki
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.label}
              to="/"
              hash={item.hash}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            Iniciar sesion
          </Link>
          <Link
            to="/register"
            className={cn(buttonVariants({ variant: "default", size: "sm" }))}
          >
            Registrarse
          </Link>
        </div>
      </div>
    </header>
  )
}
