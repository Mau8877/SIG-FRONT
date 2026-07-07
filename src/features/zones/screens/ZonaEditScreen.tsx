import { useNavigate, useParams } from "@tanstack/react-router"
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
import { getApiErrorMessage } from "@/src/lib/apiError"

import { useGetZonaQuery, useUpdateZonaMutation, useSyncHorariosMutation } from "../api/zonesApi"
import { HorariosEditor } from "../components/HorariosEditor"
import { NinosSelector } from "../components/NinosSelector"
import { ZonaForm } from "../components/ZonaForm"
import type { ZonaPayload, HorarioZona } from "../types"

export function ZonaEditScreen() {
  const navigate = useNavigate()
  const { id } = useParams({ from: "/_authenticated/zones/$id/edit" } as any)
  const zonaId = Number(id)
  const { data: zona, isLoading: isFetching, isError } = useGetZonaQuery(zonaId)
  const [updateZona, { isLoading: isUpdating }] = useUpdateZonaMutation()
  const [syncHorarios, { isLoading: isSyncingHorarios }] = useSyncHorariosMutation()
  const [error, setError] = useState<string | null>(null)

  async function handleUpdate(values: ZonaPayload) {
    setError(null)
    try {
      await updateZona({ id: zonaId, body: values }).unwrap()
      void navigate({ to: "/zones/$id", params: { id: String(zonaId) } as any })
    } catch (err) {
      setError(getApiErrorMessage(err, "No se pudo actualizar la zona segura."))
    }
  }

  async function handleSaveHorarios(horarios: HorarioZona[]) {
    try {
      await syncHorarios({ id: zonaId, body: horarios }).unwrap()
    } catch (err) {
      console.error("Error al guardar horarios:", err)
    }
  }

  if (isFetching) {
    return (
      <section className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-1/3" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
          </CardHeader>
          <CardContent>
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

  return (
    <section className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold">Editar Zona Segura: {zona.nombre}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Modifica los parámetros o redibuja el área de control geográfica de la zona.
        </p>
      </div>

      {error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Modificar Zona</CardTitle>
          <CardDescription>
            Ajusta el nombre o redibuja el área georreferenciada en el mapa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ZonaForm
            initialValues={{
              nombre: zona.nombre,
              poligono: zona.poligono,
            }}
            submitLabel="Guardar cambios"
            isSubmitting={isUpdating}
            onCancel={() => void navigate({ to: "/zones/$id", params: { id: String(zonaId) } as any })}
            onSubmit={handleUpdate}
            mapHeight="520px"
          />
        </CardContent>
      </Card>

      <HorariosEditor
        horarios={zona.horarios}
        onSave={handleSaveHorarios}
        isLoading={isSyncingHorarios}
      />

      <NinosSelector
        idZona={zonaId}
        ninosAsociados={zona.ninos_asociados}
      />
    </section>
  )
}
