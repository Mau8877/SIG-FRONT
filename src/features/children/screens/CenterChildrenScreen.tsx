import { useState } from "react"

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PaginationControls } from "@/src/components/Pagination"

import { getNinoId, useGetInstitutionChildrenQuery } from "../api/childrenApi"
import type { Nino } from "../types"

export function CenterChildrenScreen() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, refetch } = useGetInstitutionChildrenQuery({
    page,
  })
  const ninos = data?.results ?? []

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <div className="border-b border-border pb-5">
        <h1 className="text-2xl font-semibold">Ninos del Centro</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Consulta los ninos actualmente vinculados a tu centro educativo.
        </p>
      </div>

      {isLoading ? <CenterChildrenSkeleton /> : null}

      {isError ? (
        <Card>
          <CardHeader>
            <CardTitle>Hubo un problema al cargar los ninos del centro.</CardTitle>
            <CardDescription>Intenta nuevamente.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => void refetch()}>
              Reintentar
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && !isError && ninos.length === 0 ? (
        <Card className="border-dashed bg-muted/20">
          <CardHeader>
            <CardTitle>Aun no hay ninos vinculados a este centro.</CardTitle>
            <CardDescription>
              Cuando un tutor vincule un nino, aparecera en esta lista.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {!isLoading && !isError && ninos.length > 0 ? (
        <>
          <div className="hidden rounded-lg border border-border bg-card md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nino</TableHead>
                  <TableHead>Fecha de nacimiento</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ninos.map((nino) => (
                  <TableRow key={getNinoId(nino)}>
                    <TableCell>
                      <ChildIdentity nino={nino} />
                    </TableCell>
                    <TableCell>{formatBirthDate(nino.fecha_nacimiento)}</TableCell>
                    <TableCell>
                      <StatusBadge active={nino.activo ?? true} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="grid gap-4 md:hidden">
            {ninos.map((nino) => (
              <Card key={getNinoId(nino)}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <ChildIdentity nino={nino} />
                    <StatusBadge active={nino.activo ?? true} />
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Nacimiento: {formatBirthDate(nino.fecha_nacimiento)}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : null}

      {!isLoading && !isError && data ? (
        <PaginationControls
          currentPage={page}
          count={data.count}
          hasNext={Boolean(data.next)}
          hasPrevious={Boolean(data.previous)}
          onPrevious={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
          onNext={() => setPage((currentPage) => currentPage + 1)}
        />
      ) : null}
    </section>
  )
}

function ChildIdentity({ nino }: { nino: Nino }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      {nino.foto_url ? (
        <img
          src={nino.foto_url}
          alt={nino.nombre}
          className="size-10 shrink-0 rounded-full border border-border object-cover"
        />
      ) : (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-sm font-medium text-muted-foreground">
          {nino.nombre.slice(0, 1).toUpperCase()}
        </div>
      )}
      <div className="min-w-0">
        <p className="break-words font-medium text-foreground">{nino.nombre}</p>
        <p className="text-xs text-muted-foreground">ID #{getNinoId(nino)}</p>
      </div>
    </div>
  )
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <Badge variant={active ? "default" : "outline"}>
      {active ? "Activo" : "Inactivo"}
    </Badge>
  )
}

function formatBirthDate(value: string | null) {
  return value || "Sin fecha registrada"
}

function CenterChildrenSkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((item) => (
        <Card key={item}>
          <CardContent className="flex items-center gap-3 py-4">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            <Skeleton className="h-5 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
