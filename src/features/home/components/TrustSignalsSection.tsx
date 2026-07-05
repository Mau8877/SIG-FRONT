import { BellRing, MapPinned, ShieldCheck, UsersRound } from "lucide-react"

const trustSignals = [
  {
    value: "Zonas",
    label: "seguras por rutina",
    icon: MapPinned,
  },
  {
    value: "Alertas",
    label: "cuando algo cambia",
    icon: BellRing,
  },
  {
    value: "Tutores",
    label: "con informacion clara",
    icon: UsersRound,
  },
  {
    value: "Historial",
    label: "para revisar eventos",
    icon: ShieldCheck,
  },
]

export function TrustSignalsSection() {
  return (
    <section className="bg-background pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-3 rounded-3xl border bg-card p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          {trustSignals.map((signal) => {
            const Icon = signal.icon

            return (
              <div
                key={signal.value}
                className="flex items-center gap-3 rounded-2xl bg-muted/60 p-4"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-heading text-lg font-bold text-foreground">
                    {signal.value}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {signal.label}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
