import { School } from "lucide-react"

import { Badge } from "@/components/ui/badge"

import type { Nino } from "../types"

type ChildCenterInfoProps = {
  nino: Nino
}

export function ChildCenterInfo({ nino }: ChildCenterInfoProps) {
  if (!nino.centro) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
        Sin centro educativo vinculado
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2">
      <School className="mt-0.5 size-4 text-muted-foreground" aria-hidden="true" />
      <div className="min-w-0 space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Centro educativo
        </p>
        <p className="break-words text-sm font-medium text-foreground">
          {nino.centro.nombre}
        </p>
      </div>
      <Badge variant="outline" className="ml-auto shrink-0">
        Vinculado
      </Badge>
    </div>
  )
}
