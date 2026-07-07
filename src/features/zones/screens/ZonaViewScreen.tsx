import { Link, useNavigate, useParams } from "@tanstack/react-router"
import { ArrowLeft, Edit, MapPin, ShieldAlert, ShieldCheck } from "lucide-react"

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

import { useGetZonaQuery } from "../api/zonesApi"
import { MapDrawer } from "../components/MapDrawer"

export function ZonaViewScreen() {
  const navigate = useNavigate()
  const { id } = useParams({ from: "/_authenticated/zones/$id" } as any)
  const zonaId = Number(id)
  const { data: zona, isLoading, isError } = useGetZonaQuery(zonaId)

  if (isLoading) {
    return (
      <section className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-1/3" />
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-96 w-full" />
          </CardContent>
        </Card>
      </section>
    )
  }

  if (isError || !zona) {
    return (
      <section className="space-y-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>No se pudo cargar la zona</CardTitle>
            <CardDescription>
              Es posible que no exista o no tengas permisos para verla.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => void navigate({ to: "/zones" })}>
              Volver a la lista
            </Button>
          </CardContent>
        </Card>
      </section>
    )
  }

  const active = zona.activo ?? true
  const vertexCount = zona.poligono?.coordinates?.[0]?.length
    ? zona.poligono.coordinates[0].length - 1
    : 0

  return (
    <section className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => void navigate({ to: "/zones" })}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold">{zona.nombre}</h1>
              <Badge variant={active ? "default" : "outline"} className="flex items-center gap-1">
                {active ? <ShieldCheck className="size-3" /> : <ShieldAlert className="size-3" />}
                {active ? "Activa" : "Inactiva"}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {vertexCount} vértices delimitados • ID de control: #{zona.id_zona ?? zonaId}
            </p>
          </div>
        </div>
        <Button render={<Link to="/zones/$id/edit" params={{ id: String(zonaId) } as any} />}>
          <Edit className="size-4" />
          Editar zona
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="size-5 text-primary" />
            Área Geográfica de Monitoreo
          </CardTitle>
          <CardDescription>
            Vista en detalle del polígono de seguridad configurado para esta zona.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {zona.poligono ? (
            <MapDrawer
              initialPolygon={zona.poligono}
              onChange={() => undefined}
              readOnly
              height="520px"
            />
          ) : (
            <p className="text-sm text-muted-foreground py-10 text-center">
              Sin geometría configurada.
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
