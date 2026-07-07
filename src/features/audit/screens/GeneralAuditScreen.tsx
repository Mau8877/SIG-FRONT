import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { PaginationControls } from "@/src/components/Pagination"

import { useGetGeneralAuditQuery } from "../api/auditApi"
import { AuditTable } from "../components/AuditTable"

const columns = [
  { label: "Tabla", keys: ["tabla", "tabla_afectada", "table_name"] },
  { label: "ID registro", keys: ["id_registro", "registro_id", "record_id"] },
  { label: "Operacion", keys: ["operacion", "accion", "operation"] },
  { label: "Actor", keys: ["actor", "usuario", "usuario_correo", "correo"] },
  { label: "Fecha", keys: ["fecha", "created_at", "timestamp"] },
  { label: "IP", keys: ["ip", "direccion_ip", "ip_address"] },
  { label: "Antes", keys: ["datos_anteriores", "before", "old_values"] },
  { label: "Nuevos", keys: ["datos_nuevos", "after", "new_values"] },
]

export function GeneralAuditScreen() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, refetch } = useGetGeneralAuditQuery({ page })
  const rows = data?.results ?? []
  const total = data?.count ?? rows.length

  return (
    <AuditScreenShell
      title="Bitacora General"
      description={`Operaciones registradas por el sistema. Total: ${total}.`}
    >
      {isLoading ? <AuditSkeleton /> : null}
      {isError ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : null}
      {!isLoading && !isError && rows.length === 0 ? (
        <EmptyState />
      ) : null}
      {!isLoading && !isError && rows.length > 0 ? (
        <AuditTable rows={rows} columns={columns} detailTitle="Detalle de bitacora" />
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
    </AuditScreenShell>
  )
}

function AuditScreenShell({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  )
}

function AuditSkeleton() {
  return (
    <Card>
      <CardContent className="space-y-3 pt-5">
        {[0, 1, 2, 3, 4].map((item) => (
          <Skeleton key={item} className="h-9 w-full" />
        ))}
      </CardContent>
    </Card>
  )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>No se pudo cargar la bitacora</CardTitle>
        <CardDescription>Intenta nuevamente.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" onClick={onRetry}>
          Reintentar
        </Button>
      </CardContent>
    </Card>
  )
}

function EmptyState() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sin registros</CardTitle>
        <CardDescription>No hay eventos para mostrar.</CardDescription>
      </CardHeader>
    </Card>
  )
}
