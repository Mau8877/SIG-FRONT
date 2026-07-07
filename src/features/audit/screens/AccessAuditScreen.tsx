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

import { useGetAccessAuditQuery } from "../api/auditApi"
import { AuditTable } from "../components/AuditTable"

const columns = [
  { label: "Evento", keys: ["evento", "event", "accion"] },
  { label: "Correo", keys: ["correo", "email", "usuario_correo"] },
  { label: "Usuario", keys: ["usuario", "id_usuario", "user"] },
  { label: "IP", keys: ["ip", "direccion_ip", "ip_address"] },
  { label: "User agent", keys: ["user_agent", "userAgent"] },
  { label: "Fecha", keys: ["fecha", "created_at", "timestamp"] },
]

export function AccessAuditScreen() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, refetch } = useGetAccessAuditQuery({ page })
  const rows = data?.results ?? []
  const total = data?.count ?? rows.length

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Bitacora de Accesos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Eventos de acceso registrados por el backend. Total: {total}.
        </p>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="space-y-3 pt-5">
            {[0, 1, 2, 3, 4].map((item) => (
              <Skeleton key={item} className="h-9 w-full" />
            ))}
          </CardContent>
        </Card>
      ) : null}

      {isError ? (
        <Card>
          <CardHeader>
            <CardTitle>No se pudo cargar la bitacora</CardTitle>
            <CardDescription>Intenta nuevamente.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => void refetch()}>
              Reintentar
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && !isError && rows.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Sin registros</CardTitle>
            <CardDescription>No hay eventos para mostrar.</CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {!isLoading && !isError && rows.length > 0 ? (
        <AuditTable rows={rows} columns={columns} detailTitle="Detalle de acceso" />
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
