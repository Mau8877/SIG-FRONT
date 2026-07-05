import { BellRing, LocateFixed, MapPinned } from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const steps = [
  {
    title: "Define una zona segura",
    description:
      "Marca lugares importantes como casa, colegio o actividades frecuentes.",
    icon: MapPinned,
    tone: "bg-primary text-primary-foreground",
  },
  {
    title: "Monitorea la ubicacion",
    description:
      "Consulta el estado general y la ubicacion asociada cuando lo necesites.",
    icon: LocateFixed,
    tone: "bg-secondary text-secondary-foreground",
  },
  {
    title: "Recibe alertas",
    description:
      "Detecta salidas de zonas seguras y revisa eventos relevantes despues.",
    icon: BellRing,
    tone: "bg-warning text-warning-foreground",
  },
]

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="bg-muted/50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Como funciona
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Tres pasos claros para estar informado
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            La experiencia esta pensada para acompanarte sin ruido: configurar,
            observar y actuar cuando hace falta.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon

            return (
              <Card
                key={step.title}
                className="rounded-2xl border shadow-sm ring-0 [--card-spacing:--spacing(6)]"
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <span className={`flex size-12 items-center justify-center rounded-2xl ${step.tone}`}>
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-semibold text-muted-foreground">
                      Paso {index + 1}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-xl font-bold text-card-foreground">
                    {step.title}
                  </CardTitle>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
