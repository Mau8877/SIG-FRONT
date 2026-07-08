import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { useGetInstitutionMapQuery } from "../api/institutionMapApi"
import { CenterMap } from "../components/CenterMap"

export function CenterMapScreen() {
  const { data, isLoading, isError, refetch, isFetching } = useGetInstitutionMapQuery()

  const childrenWithPosition = data?.children.filter((child) => child.latitud !== null).length ?? 0

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Mapa del Centro</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Estado actual de los niños del centro y sus zonas seguras.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => void refetch()} disabled={isFetching}>
          {isFetching ? "Actualizando…" : "Actualizar"}
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-[520px] w-full" />
      ) : isError ? (
        <Card>
          <CardHeader>
            <CardTitle>No se pudo cargar el mapa</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => void refetch()}>
              Reintentar
            </Button>
          </CardContent>
        </Card>
      ) : data ? (
        <div className="space-y-4">
          <Legend />
          <CenterMap data={data} />
          <p className="text-sm text-muted-foreground">
            {childrenWithPosition} de {data.children.length} niños con ubicación reciente · {data.zonas.length} zonas.
          </p>
        </div>
      ) : null}
    </section>
  )
}

function Legend() {
  const items = [
    { color: "#16a34a", label: "Dentro de zona" },
    { color: "#dc2626", label: "Fuera de zona" },
    { color: "#94a3b8", label: "Sin datos" },
  ]
  return (
    <div className="flex flex-wrap gap-4">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
          {item.label}
        </div>
      ))}
    </div>
  )
}
