import {
  BatteryCharging,
  Bell,
  CircleDot,
  MapPin,
  ShieldCheck,
  Wifi,
} from "lucide-react"

export function LoginDevicePreview() {
  return (
    <div className="relative mx-auto flex min-h-0 w-full items-center justify-center">
      <div className="absolute size-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-10 size-52 rounded-full bg-success/10 blur-3xl" />

      <div className="relative z-10 w-[min(62%,300px)] rounded-[2.2rem] border border-border bg-background/95 p-3 shadow-sm ring-1 ring-foreground/5">
        <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-muted" />
        <div className="overflow-hidden rounded-[1.6rem] border border-border bg-muted/70 p-4">
          <header className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-xl bg-primary/15">
                <ShieldCheck className="size-4 text-foreground" />
              </span>
              <span className="text-sm font-semibold">Miraki</span>
            </div>
            <span className="rounded-full bg-success/10 px-2.5 py-1 text-[0.68rem] font-medium text-success-foreground">
              Protegido
            </span>
          </header>

          <section className="rounded-2xl border border-border bg-background/95 p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Ubicación activa</p>
                <h3 className="mt-1 text-xl font-semibold leading-tight">Mateo</h3>
              </div>
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                <MapPin className="size-5" />
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-2 text-xs">
              <CircleDot className="size-3.5 text-foreground" />
              Señal activa
              <span className="ml-auto size-2 rounded-full bg-success" />
            </div>
          </section>

          <div className="mt-3 grid gap-2">
            <StatusCard
              icon={<ShieldCheck className="size-4" />}
              title="Zona segura"
              tone="success"
            />
            <StatusCard icon={<Bell className="size-4" />} title="Sin alertas" tone="warning" />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-[0.64rem] text-muted-foreground">
            <BottomStatus icon={<BatteryCharging className="size-3.5" />} label="Batería" />
            <BottomStatus icon={<MapPin className="size-3.5" />} label="GPS" />
            <BottomStatus icon={<Wifi className="size-3.5" />} label="Online" />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusCard({
  icon,
  title,
  tone,
}: {
  icon: React.ReactNode
  title: string
  tone: "success" | "warning"
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/90 p-3 shadow-sm">
      <span
        className={`flex size-8 shrink-0 items-center justify-center rounded-xl ${
          tone === "success"
            ? "bg-success/10 text-success-foreground"
            : "bg-warning/20 text-warning-foreground"
        }`}
      >
        {icon}
      </span>
      <p className="text-sm font-medium leading-tight">{title}</p>
    </div>
  )
}

function BottomStatus({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center justify-center gap-1 rounded-lg bg-background/90 px-1.5 py-1.5">
      {icon}
      {label}
    </div>
  )
}
