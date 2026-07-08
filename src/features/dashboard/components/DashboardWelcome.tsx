import type { LucideIcon } from "lucide-react"

type DashboardWelcomeProps = {
  title: string
  description: string
  icon: LucideIcon
}

export function DashboardWelcome({
  title,
  description,
  icon: Icon,
}: DashboardWelcomeProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Dashboard</p>
          <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            {description}
          </p>
        </div>
        <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground sm:size-20">
          <Icon className="size-8 sm:size-10" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
