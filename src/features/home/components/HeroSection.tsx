import { Link } from "@tanstack/react-router"
import { ArrowRight, ShieldCheck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { HeroMapPreview } from "./HeroMapPreview"

export function HeroSection() {
  return (
    <section className="overflow-hidden bg-background">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-10 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:pb-24 lg:pt-14">
        <div className="max-w-3xl">
          <Badge
            variant="outline"
            className="mb-4 h-auto gap-2 bg-muted px-4 py-2 text-sm text-muted-foreground"
          >
            <ShieldCheck className="size-4 text-success" aria-hidden="true" />
            Monitoreo familiar con zonas seguras
          </Badge>

          <h1 className="font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
            Seguridad y tranquilidad, estes donde estes
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Define zonas seguras, consulta ubicaciones y recibe alertas cuando
            algo salga de lo esperado.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/register"
              className={cn(buttonVariants({ variant: "default", size: "lg" }))}
            >
              Crear cuenta
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              to="/"
              hash="como-funciona"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Ver como funciona
            </Link>
          </div>
        </div>

        <HeroMapPreview />
      </div>
    </section>
  )
}
