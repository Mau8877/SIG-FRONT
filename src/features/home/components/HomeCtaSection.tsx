import { Link } from "@tanstack/react-router"
import { ArrowRight, LogIn } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function HomeCtaSection() {
  return (
    <section className="bg-muted/60 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border bg-card px-6 py-10 text-center shadow-sm sm:px-10">
          <h2 className="font-heading text-3xl font-bold text-card-foreground sm:text-4xl">
            Empieza a cuidar lo que mas importa
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            Crea una cuenta para preparar zonas seguras, revisar ubicaciones y
            acompanar cada rutina con mayor tranquilidad.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className={cn(buttonVariants({ variant: "default", size: "lg" }))}
            >
              Registrarse
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              to="/login"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              <LogIn className="size-4" aria-hidden="true" />
              Iniciar sesion
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
