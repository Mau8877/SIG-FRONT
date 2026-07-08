import { Clock, Home, School, Waypoints } from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const useCases = [
  {
    title: "Rutinas entre casa y colegio",
    description:
      "Acompana trayectos frecuentes sin depender de llamadas constantes.",
    icon: School,
    tone: "bg-secondary text-secondary-foreground",
  },
  {
    title: "Zonas familiares importantes",
    description:
      "Organiza casa, colegio, actividades y lugares de confianza.",
    icon: Home,
    tone: "bg-success text-success-foreground",
  },
  {
    title: "Eventos para revisar despues",
    description:
      "Consulta salidas, recorridos y momentos relevantes con contexto.",
    icon: Clock,
    tone: "bg-warning text-warning-foreground",
  },
]

export function UseCasesSection() {
  return (
    <section className="bg-muted/50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Para el dia a dia
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Pensado para rutinas reales, no para vigilar de mas
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Miraki ayuda a transformar ubicaciones y recorridos en informacion
              simple para tomar decisiones con calma.
            </p>

            <div className="mt-8 rounded-3xl border bg-card p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <Waypoints className="size-6" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-heading text-lg font-bold text-card-foreground">
                    Monitoreo con contexto
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Las alertas tienen mas valor cuando se entienden junto con
                    una zona, una rutina y un evento claro.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {useCases.map((useCase) => {
              const Icon = useCase.icon

              return (
                <Card
                  key={useCase.title}
                  className="rounded-2xl border shadow-sm ring-0 [--card-spacing:--spacing(5)]"
                >
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <span className={`flex size-11 items-center justify-center rounded-2xl ${useCase.tone}`}>
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <CardTitle className="text-lg font-bold text-card-foreground">
                        {useCase.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {useCase.description}
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
