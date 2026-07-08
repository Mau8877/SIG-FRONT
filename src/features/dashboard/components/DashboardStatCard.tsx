import type { LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type DashboardStatCardProps = {
  title: string
  description: string
  icon: LucideIcon
  value?: number | string
  isLoading?: boolean
  action?: React.ReactNode
}

export function DashboardStatCard({
  title,
  description,
  icon: Icon,
  value,
  isLoading,
  action,
}: DashboardStatCardProps) {
  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
            <Icon className="size-5" aria-hidden="true" />
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {typeof value !== "undefined" || isLoading ? (
          <div>
            {isLoading ? (
              <Skeleton className="h-9 w-20" />
            ) : (
              <p className="text-3xl font-semibold">{value}</p>
            )}
          </div>
        ) : null}
        {action ? <div>{action}</div> : null}
      </CardContent>
    </Card>
  )
}

export function StatActionButton({
  children,
  render,
  variant = "outline",
}: {
  children: React.ReactNode
  render: React.ReactElement
  variant?: React.ComponentProps<typeof Button>["variant"]
}) {
  return (
    <Button variant={variant} size="sm" render={render}>
      {children}
    </Button>
  )
}
