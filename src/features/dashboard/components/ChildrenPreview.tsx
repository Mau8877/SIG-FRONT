import { Link } from "@tanstack/react-router"
import { AlertCircle, Baby } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ChildAvatar } from "@/src/features/children/components/ChildAvatar"
import type { Nino } from "@/src/features/children"

type ChildrenPreviewProps = {
  title: string
  description: string
  childrenList: Nino[]
  isLoading: boolean
  isError: boolean
  emptyTitle: string
  emptyDescription: string
  errorMessage: string
  actionLabel: string
  actionTo: "/children" | "/center-children"
  onRetry: () => void
  showCenter?: boolean
  emptyAction?: React.ReactNode
}

export function ChildrenPreview({
  title,
  description,
  childrenList,
  isLoading,
  isError,
  emptyTitle,
  emptyDescription,
  errorMessage,
  actionLabel,
  actionTo,
  onRetry,
  showCenter = false,
  emptyAction,
}: ChildrenPreviewProps) {
  const previewItems = childrenList.slice(0, 4)

  return (
    <Card>
      <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {!isLoading && !isError && childrenList.length > 0 ? (
          <Button variant="outline" size="sm" render={<Link to={actionTo} />}>
            {actionLabel}
          </Button>
        ) : null}
      </CardHeader>
      <CardContent>
        {isLoading ? <ChildrenPreviewSkeleton /> : null}

        {isError ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <div className="space-y-3">
                <p>{errorMessage}</p>
                <Button variant="outline" size="sm" onClick={onRetry}>
                  Reintentar
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        {!isLoading && !isError && childrenList.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-muted/20 p-5 text-center">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Baby className="size-6" aria-hidden="true" />
            </div>
            <h3 className="font-semibold">{emptyTitle}</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              {emptyDescription}
            </p>
            {emptyAction ? <div className="mt-4">{emptyAction}</div> : null}
          </div>
        ) : null}

        {!isLoading && !isError && previewItems.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {previewItems.map((nino) => (
              <ChildPreviewCard key={nino.id_nino ?? nino.id ?? nino.nombre} nino={nino} showCenter={showCenter} />
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

function ChildPreviewCard({ nino, showCenter }: { nino: Nino; showCenter: boolean }) {
  const active = nino.activo ?? true

  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="flex items-start gap-3">
        <ChildAvatar name={nino.nombre} photoUrl={nino.foto_url} className="size-11" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="break-words font-medium text-foreground">{nino.nombre}</p>
            <Badge variant={active ? "default" : "outline"}>
              {active ? "Activo" : "Inactivo"}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {nino.fecha_nacimiento ? `Nacimiento: ${nino.fecha_nacimiento}` : "Sin fecha registrada"}
          </p>
          {showCenter ? (
            <p className="mt-2 text-sm text-muted-foreground">
              {nino.centro ? `Centro: ${nino.centro.nombre}` : "Sin centro vinculado"}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function ChildrenPreviewSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {[0, 1, 2, 3].map((item) => (
        <div key={item} className="rounded-lg border border-border bg-background p-3">
          <div className="flex gap-3">
            <Skeleton className="size-11 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
