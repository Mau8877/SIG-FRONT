import { Link } from "@tanstack/react-router"

import { Separator } from "@/components/ui/separator"

export function FooterHome() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card">
      <Separator />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                Miraki
              </span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
              Plataforma de monitoreo geografico orientada a seguridad
              familiar, geocercas, alertas y seguimiento responsable.
            </p>
          </div>

          <div>
            <p className="font-heading text-sm font-bold text-foreground">
              Navegacion
            </p>
            <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
              <Link to="/" className="transition-colors hover:text-foreground">
                Inicio
              </Link>
              <Link
                to="/"
                hash="como-funciona"
                className="transition-colors hover:text-foreground"
              >
                Como funciona
              </Link>
              <Link
                to="/"
                hash="beneficios"
                className="transition-colors hover:text-foreground"
              >
                Beneficios
              </Link>
            </div>
          </div>

          <div>
            <p className="font-heading text-sm font-bold text-foreground">
              Acceso
            </p>
            <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
              <Link
                to="/login"
                className="transition-colors hover:text-foreground"
              >
                Iniciar sesion
              </Link>
              <Link
                to="/register"
                className="transition-colors hover:text-foreground"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>(c) {currentYear} Miraki. Todos los derechos reservados.</p>
          <p>Seguridad familiar con informacion clara y accionable.</p>
        </div>
      </div>
    </footer>
  )
}
