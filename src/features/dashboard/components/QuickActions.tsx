import { Link } from "@tanstack/react-router"
import type { LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type QuickAction = {
  label: string
  description: string
  to: "/children" | "/center-children" | "/zones"
  icon: LucideIcon
}

type QuickActionsProps = {
  title: string
  actions: QuickAction[]
}

export function QuickActions({ title, actions }: QuickActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Acciones frecuentes disponibles para tu rol.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon

          return (
            <Button
              key={action.label}
              variant="outline"
              className="h-auto justify-start gap-3 p-4 text-left"
              render={<Link to={action.to} />}
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block font-medium">{action.label}</span>
                <span className="mt-1 block whitespace-normal text-xs font-normal leading-5 text-muted-foreground">
                  {action.description}
                </span>
              </span>
            </Button>
          )
        })}
      </CardContent>
    </Card>
  )
}
