import { CircleHelp } from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const questions = [
  {
    question: "Necesito instalar mapas reales para probar la Home?",
    answer:
      "No. Esta version usa una preview visual interactiva. Los mapas reales pueden integrarse despues en las pantallas de monitoreo.",
  },
  {
    question: "La geocerca de la Home guarda datos reales?",
    answer:
      "No. Es una simulacion para explicar el concepto de zona segura, marcador y alerta preventiva.",
  },
  {
    question: "Que vera un tutor en la plataforma?",
    answer:
      "Una vista clara de menores registrados, zonas seguras, ubicaciones, alertas y eventos para revisar.",
  },
]

export function FaqSection() {
  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Preguntas rapidas
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Una primera version clara para presentar la idea
          </h2>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {questions.map((item) => (
            <Card
              key={item.question}
              className="rounded-2xl border shadow-sm ring-0 [--card-spacing:--spacing(6)]"
            >
              <CardHeader>
                <span className="mb-2 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <CircleHelp className="size-5" aria-hidden="true" />
                </span>
                <CardTitle className="text-lg font-bold text-card-foreground">
                  {item.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">
                  {item.answer}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
