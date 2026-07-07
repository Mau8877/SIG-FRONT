import { Link } from "@tanstack/react-router"
import { useState } from "react"
import { CheckCircle2, History, MapPin, ShieldCheck, Sparkles } from "lucide-react"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PaginationControls } from "@/src/components/Pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { getApiErrorMessage } from "@/src/lib/apiError"

import {
  getZonaId,
  useDeactivateZonaMutation,
  useGetZonasQuery,
  useReactivateZonaMutation,
} from "../api/zonesApi"
import { MapDrawer } from "../components/MapDrawer"
import type { ZonaSegura } from "../types"

export function ZonasScreen() {
  const [page, setPage] = useState(1)
  const [deactivateTarget, setDeactivateTarget] = useState<ZonaSegura | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Siempre pedimos includeInactive: true para mostrar activas y desactivadas en secciones separadas
  const { data, isLoading, isError, refetch } = useGetZonasQuery({ page, includeInactive: true })
  const [deactivateZona, deactivateState] = useDeactivateZonaMutation()
  const [reactivateZona, reactivateState] = useReactivateZonaMutation()

  const zonas = data?.results ?? []
  const activas = zonas.filter((z) => z.activo !== false)
  const inactivas = zonas.filter((z) => z.activo === false)

  async function handleDeactivate() {
    if (!deactivateTarget) return
    setError(null)
    try {
      await deactivateZona(getZonaId(deactivateTarget)).unwrap()
      setDeactivateTarget(null)
    } catch (err) {
      setError(getApiErrorMessage(err, "No se pudo desactivar la zona segura."))
    }
  }

  async function handleReactivate(zona: ZonaSegura) {
    setError(null)
    try {
      await reactivateZona(getZonaId(zona)).unwrap()
    } catch (err) {
      setError(getApiErrorMessage(err, "No se pudo reactivar la zona segura."))
    }
  }

  return (
    <section className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <MapPin className="size-6 text-primary" />
            Mis Zonas Seguras
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Administra las áreas georreferenciadas permitidas y revisa el historial de zonas inhabilitadas.
          </p>
        </div>
        <Button render={<Link to="/zones/create" />}>
          <Sparkles className="size-4 mr-1.5" />
          Nueva zona
        </Button>
      </div>

      {error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {isLoading ? <ZonasSkeleton /> : null}

      {isError ? (
        <Card>
          <CardHeader>
            <CardTitle>No se pudo cargar la lista</CardTitle>
            <CardDescription>Ocurrió un error al obtener las zonas seguras.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => void refetch()}>
              Reintentar
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && !isError ? (
        <>
          {/* SECCIÓN 1: ZONAS ACTIVAS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <ShieldCheck className="size-5 text-success" />
                Zonas Activas en Monitoreo
                <Badge variant="default" className="ml-1 bg-success text-success-foreground">
                  {activas.length}
                </Badge>
              </h2>
            </div>

            {activas.length === 0 ? (
              <Card className="border-dashed bg-muted/30">
                <CardHeader className="text-center py-8">
                  <CardTitle className="text-base font-normal text-muted-foreground">
                    No tienes zonas activas monitoreando en este momento.
                  </CardTitle>
                  <CardDescription>
                    Crea una nueva zona o reactiva alguna de la sección inferior.
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {activas.map((zona) => (
                  <ZonaCard
                    key={getZonaId(zona)}
                    zona={zona}
                    reactivating={reactivateState.isLoading}
                    onDeactivate={() => setDeactivateTarget(zona)}
                    onReactivate={() => void handleReactivate(zona)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* SECCIÓN 2: ZONAS DESACTIVADAS */}
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium flex items-center gap-2 text-muted-foreground">
                <History className="size-5" />
                Zonas Desactivadas / Historial
                <Badge variant="outline" className="ml-1">
                  {inactivas.length}
                </Badge>
              </h2>
            </div>

            {inactivas.length === 0 ? (
              <Card className="border-dashed bg-muted/10">
                <CardContent className="py-6 text-center text-sm text-muted-foreground">
                  No tienes zonas desactivadas. Cuando desactives una zona, aparecerá aquí para que puedas reactivarla en cualquier momento.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {inactivas.map((zona) => (
                  <ZonaCard
                    key={getZonaId(zona)}
                    zona={zona}
                    reactivating={reactivateState.isLoading}
                    onDeactivate={() => setDeactivateTarget(zona)}
                    onReactivate={() => void handleReactivate(zona)}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      ) : null}

      {!isLoading && !isError && data && (data.next || data.previous) ? (
        <PaginationControls
          currentPage={page}
          count={data.count}
          hasNext={Boolean(data.next)}
          hasPrevious={Boolean(data.previous)}
          onPrevious={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => p + 1)}
        />
      ) : null}

      <AlertDialog
        open={Boolean(deactivateTarget)}
        onOpenChange={(open) => !open && setDeactivateTarget(null)}
      >
        {deactivateTarget ? (
          <AlertDialogContent onClose={() => setDeactivateTarget(null)}>
            <AlertDialogHeader>
              <AlertDialogTitle>
                ¿Desactivar la zona "{deactivateTarget.nombre}"?
              </AlertDialogTitle>
              <AlertDialogDescription>
                La zona dejará de usarse en el monitoreo activo, pero pasará a la sección de <strong>Zonas Desactivadas / Historial</strong> inferior, desde donde podrás reactivarla cuando gustes.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button variant="outline" onClick={() => setDeactivateTarget(null)}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={() => void handleDeactivate()}
                disabled={deactivateState.isLoading}
              >
                {deactivateState.isLoading ? "Procesando..." : "Desactivar"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        ) : null}
      </AlertDialog>
    </section>
  )
}

function ZonaCard({
  zona,
  reactivating,
  onDeactivate,
  onReactivate,
}: {
  zona: ZonaSegura
  reactivating: boolean
  onDeactivate: () => void
  onReactivate: () => void
}) {
  const active = zona.activo ?? true
  const vertexCount = zona.poligono?.coordinates?.[0]?.length
    ? zona.poligono.coordinates[0].length - 1
    : 0

  return (
    <Card className={!active ? "opacity-80 bg-muted/20 border-dashed" : ""}>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-lg">{zona.nombre}</CardTitle>
            <CardDescription>
              {vertexCount > 0 ? `${vertexCount} vértices delimitados` : "Sin geometría"} • ID #{getZonaId(zona)}
            </CardDescription>
          </div>
          <Badge variant={active ? "default" : "outline"} className={active ? "bg-success text-success-foreground" : "text-muted-foreground"}>
            {active ? "Activa" : "Inactiva"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {zona.poligono && (
          <MapDrawer
            initialPolygon={zona.poligono}
            onChange={() => undefined}
            readOnly
            height="180px"
          />
        )}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border/50">
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              render={
                <Link
                  to="/zones/$id"
                  params={{ id: String(getZonaId(zona)) } as any}
                />
              }
            >
              Ver
            </Button>
            <Button
              variant="outline"
              size="sm"
              render={
                <Link
                  to="/zones/$id/edit"
                  params={{ id: String(getZonaId(zona)) } as any}
                />
              }
            >
              Editar
            </Button>
          </div>
          {active ? (
            <Button variant="destructive" size="sm" onClick={onDeactivate}>
              Desactivar
            </Button>
          ) : (
            <Button variant="secondary" size="sm" onClick={onReactivate} disabled={reactivating} className="bg-primary/20 text-primary-foreground hover:bg-primary/30 font-medium">
              <CheckCircle2 className="size-4 mr-1" />
              {reactivating ? "Reactivando..." : "Reactivar"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function ZonasSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-6 w-48" />
      <div className="grid gap-4 md:grid-cols-2">
        {[0, 1].map((item) => (
          <Card key={item}>
            <CardHeader>
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-44 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
