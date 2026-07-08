import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { PaginationControls } from "@/src/components/Pagination"

import { useAtenderAlertaMutation, useGetAlertasQuery } from "../api/alertsApi"
import { downloadAlertasReporte } from "../api/alertsReport"
import { AlertsTable } from "../components/AlertsTable"
import { ALERT_TYPES, type AlertType } from "../types"

type EstadoFilter = "todas" | "pendientes" | "atendidas"

const TYPE_OPTIONS: { value: AlertType | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: ALERT_TYPES.SALIDA_ZONA, label: "Salida de zona" },
  { value: ALERT_TYPES.BATERIA_BAJA, label: "Batería baja" },
  { value: ALERT_TYPES.SOS, label: "SOS" },
]

const ESTADO_OPTIONS: { value: EstadoFilter; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "pendientes", label: "Pendientes" },
  { value: "atendidas", label: "Atendidas" },
]

export function AlertsScreen() {
  const [page, setPage] = useState(1)
  const [tipo, setTipo] = useState<AlertType | "todos">("todos")
  const [estado, setEstado] = useState<EstadoFilter>("todas")
  const [desde, setDesde] = useState("")
  const [hasta, setHasta] = useState("")
  const [attendingId, setAttendingId] = useState<number | null>(null)
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)

  const atendida = useMemo(() => {
    if (estado === "pendientes") return false
    if (estado === "atendidas") return true
    return undefined
  }, [estado])

  const queryParams = {
    tipo: tipo === "todos" ? undefined : tipo,
    atendida,
    desde: desde || undefined,
    hasta: hasta || undefined,
  }

  const { data, isLoading, isError, refetch, isFetching } = useGetAlertasQuery({
    page,
    ...queryParams,
  })
  const [atenderAlerta] = useAtenderAlertaMutation()

  async function handleExport() {
    setExporting(true)
    setExportError(null)
    try {
      await downloadAlertasReporte(queryParams)
    } catch (error) {
      setExportError(error instanceof Error ? error.message : "No se pudo generar el reporte.")
    } finally {
      setExporting(false)
    }
  }

  const rows = data?.results ?? []
  const total = data?.count ?? rows.length

  const resetPageAnd = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value)
    setPage(1)
  }

  async function handleAtender(id: number) {
    setAttendingId(id)
    try {
      await atenderAlerta(id).unwrap()
    } finally {
      setAttendingId(null)
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Alertas</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Historial de alertas de tus niños. Total: {total}.
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 pt-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
            <FilterGroup
              label="Tipo"
              options={TYPE_OPTIONS}
              value={tipo}
              onChange={resetPageAnd(setTipo)}
            />
            <FilterGroup
              label="Estado"
              options={ESTADO_OPTIONS}
              value={estado}
              onChange={resetPageAnd(setEstado)}
            />
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Desde</p>
              <Input
                type="date"
                value={desde}
                max={hasta || undefined}
                onChange={(event) => {
                  setDesde(event.target.value)
                  setPage(1)
                }}
                className="w-44"
              />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Hasta</p>
              <Input
                type="date"
                value={hasta}
                min={desde || undefined}
                onChange={(event) => {
                  setHasta(event.target.value)
                  setPage(1)
                }}
                className="w-44"
              />
            </div>
            <Button type="button" variant="secondary" onClick={() => void handleExport()} disabled={exporting}>
              {exporting ? "Generando…" : "Exportar CSV"}
            </Button>
          </div>
          {exportError ? <p className="text-sm text-destructive">{exportError}</p> : null}
        </CardContent>
      </Card>

      {isLoading ? <TableSkeleton /> : null}
      {isError ? <ErrorState onRetry={() => void refetch()} /> : null}
      {!isLoading && !isError && rows.length === 0 ? <EmptyState /> : null}
      {!isLoading && !isError && rows.length > 0 ? (
        <Card>
          <CardContent className="pt-5">
            <AlertsTable
              rows={rows}
              attendingId={attendingId}
              onAtender={(alerta) => void handleAtender(alerta.id_alerta)}
            />
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && !isError && data ? (
        <PaginationControls
          currentPage={page}
          count={data.count}
          hasNext={Boolean(data.next)}
          hasPrevious={Boolean(data.previous)}
          onPrevious={() => setPage((current) => Math.max(1, current - 1))}
          onNext={() => setPage((current) => current + 1)}
        />
      ) : null}

      {isFetching && !isLoading ? (
        <p className="text-center text-xs text-muted-foreground">Actualizando…</p>
      ) : null}
    </section>
  )
}

function FilterGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Button
            key={option.value}
            type="button"
            size="sm"
            variant={value === option.value ? "default" : "outline"}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  )
}

function TableSkeleton() {
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
        <CardTitle>No se pudieron cargar las alertas</CardTitle>
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
        <CardTitle>Sin alertas</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">No hay alertas para los filtros seleccionados.</p>
      </CardContent>
    </Card>
  )
}
