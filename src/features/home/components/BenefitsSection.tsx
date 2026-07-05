import { BellRing, History, Map, Route, ShieldCheck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const benefits = [
  {
    title: "Zonas seguras personalizadas",
    description:
      "Organiza lugares de confianza y mantenlos visibles para el tutor.",
    icon: ShieldCheck,
    tone: "bg-success text-success-foreground",
  },
  {
    title: "Monitoreo de ubicacion",
    description:
      "Consulta informacion relevante sin convertir la experiencia en algo invasivo.",
    icon: Map,
    tone: "bg-secondary text-secondary-foreground",
  },
  {
    title: "Alertas oportunas",
    description:
      "Recibe avisos cuando un evento necesita atencion o seguimiento.",
    icon: BellRing,
    tone: "bg-warning text-warning-foreground",
  },
  {
    title: "Historial de eventos",
    description:
      "Revisa recorridos y cambios importantes para tomar mejores decisiones.",
    icon: History,
    tone: "bg-primary text-primary-foreground",
  },
]

export function BenefitsSection() {
  return (
    <section id="beneficios" className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Beneficios
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Una base visual lista para crecer
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              La Home presenta el alcance del sistema con un lenguaje cercano,
              pensado para seguridad familiar y monitoreo responsable.
            </p>
            <Badge
              variant="outline"
              className="mt-6 h-auto gap-2 bg-muted px-4 py-2 text-sm text-muted-foreground"
            >
              <Route className="size-4 text-secondary" aria-hidden="true" />
              Geocercas, eventos y recorridos en una misma experiencia
            </Badge>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((benefit) => {
              const Icon = benefit.icon

              return (
                <Card
                  key={benefit.title}
                  className="rounded-2xl border shadow-sm ring-0 transition-transform hover:-translate-y-1 [--card-spacing:--spacing(6)]"
                >
                  <CardHeader>
                    <span className={`flex size-11 items-center justify-center rounded-2xl ${benefit.tone}`}>
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="text-lg font-bold text-card-foreground">
                      {benefit.title}
                    </CardTitle>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
