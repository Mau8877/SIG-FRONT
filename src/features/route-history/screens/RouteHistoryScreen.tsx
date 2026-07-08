import { useState } from "react"
import { skipToken } from "@reduxjs/toolkit/query"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useGetNinosQuery } from "@/src/features/children/api/childrenApi"

import { downloadHistorialCsv, useGetHistorialQuery } from "../api/routeHistoryApi"

function ninoId(nino: { id_nino?: number; id?: number }): number | null {
  return nino.id_nino ?? nino.id ?? null
}

export function RouteHistoryScreen() {
  const { data: ninosData, isLoading: loadingNinos } = useGetNinosQuery()
  const [selected, setSelected] = useState<number | null>(null)
  const [desde, setDesde] = useState("")
  const [hasta, setHasta] = useState("")
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)

  const params = selected ? { ninoId: selected, desde: desde || undefined, hasta: hasta || undefined } : skipToken
  const { data, isFetching, isError } = useGetHistorialQuery(params)

  const ninos = ninosData?.results ?? []

  async function handleExport() {
    if (!selected) return
    setExporting(true)
    setExportError(null)
    try {
      await downloadHistorialCsv({ ninoId: selected, desde: desde || undefined, hasta: hasta || undefined })
    } catch (error) {
      setExportError(error instanceof Error ? error.message : "No se pudo generar el reporte.")
    } finally {
      setExporting(false)
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Historial de Rutas</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Consultá y exportá el recorrido de un niño por rango de fechas.
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 pt-5">
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Niño</p>
            {loadingNinos ? (
              <Skeleton className="h-9 w-64" />
            ) : ninos.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tenés niños registrados.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {ninos.map((nino) => {
                  const id = ninoId(nino)
                  if (id === null) return null
                  return (
                    <Button
                      key={id}
                      type="button"
                      size="sm"
                      variant={selected === id ? "default" : "outline"}
                      onClick={() => setSelected(id)}
                    >
                      {nino.nombre}
                    </Button>
                  )
                })}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Desde</p>
              <Input type="date" value={desde} max={hasta || undefined} onChange={(e) => setDesde(e.target.value)} className="w-44" />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Hasta</p>
              <Input type="date" value={hasta} min={desde || undefined} onChange={(e) => setHasta(e.target.value)} className="w-44" />
            </div>
            <Button type="button" variant="secondary" onClick={() => void handleExport()} disabled={!selected || exporting}>
              {exporting ? "Generando…" : "Exportar CSV"}
            </Button>
          </div>
          {exportError ? <p className="text-sm text-destructive">{exportError}</p> : null}
        </CardContent>
      </Card>

      {!selected ? (
        <Card>
          <CardContent className="pt-5">
            <p className="text-sm text-muted-foreground">Seleccioná un niño para ver su recorrido.</p>
          </CardContent>
        </Card>
      ) : isFetching ? (
        <Skeleton className="h-64 w-full" />
      ) : isError ? (
        <Card>
          <CardContent className="pt-5">
            <p className="text-sm text-destructive">No se pudo cargar el historial.</p>
          </CardContent>
        </Card>
      ) : data ? (
        <Card>
          <CardContent className="space-y-4 pt-5">
            <p className="text-sm text-muted-foreground">
              {data.count} posiciones{data.truncated ? ` (mostrando las primeras ${data.results.length})` : ""}.
            </p>
            {data.results.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sin posiciones en el rango seleccionado.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Latitud</TableHead>
                    <TableHead>Longitud</TableHead>
                    <TableHead>Velocidad</TableHead>
                    <TableHead>Batería</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.results.map((pos) => (
                    <TableRow key={pos.id_posicion}>
                      <TableCell className="whitespace-nowrap">{new Date(pos.fecha_posicion).toLocaleString()}</TableCell>
                      <TableCell>{pos.latitud.toFixed(6)}</TableCell>
                      <TableCell>{pos.longitud.toFixed(6)}</TableCell>
                      <TableCell>{pos.velocidad === null ? "—" : `${pos.velocidad} m/s`}</TableCell>
                      <TableCell>{pos.bateria === null ? "—" : `${pos.bateria}%`}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      ) : null}
    </section>
  )
}
