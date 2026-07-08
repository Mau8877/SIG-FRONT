import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getApiErrorMessage } from "@/src/lib/apiError"

import { useCreateZonaMutation, useGetZonasQuery } from "../api/zonesApi"
import { ZonaForm } from "../components/ZonaForm"
import type { ZonaPayload } from "../types"

export function ZonaCreateScreen() {
  const navigate = useNavigate()
  const [createZona, { isLoading }] = useCreateZonaMutation()
  const { data: zonasData } = useGetZonasQuery({ includeInactive: false })
  const [error, setError] = useState<string | null>(null)
  const referenceZones = zonasData?.results?.map((z) => ({ polygon: z.poligono, nombre: z.nombre })) ?? []

  async function handleCreate(values: ZonaPayload) {
    setError(null)
    try {
      await createZona(values).unwrap()
      void navigate({ to: "/zones" })
    } catch (err) {
      setError(getApiErrorMessage(err, "No se pudo crear la zona segura."))
    }
  }

  return (
    <section className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold">Nueva Zona Segura</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Dibuja en el mapa y define el área de control para el monitoreo geográfico.
        </p>
      </div>

      {error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Datos de la Zona</CardTitle>
          <CardDescription>
            Completa el nombre y delimita los vértices en el mapa interactivo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ZonaForm
            submitLabel="Crear zona"
            isSubmitting={isLoading}
            onCancel={() => void navigate({ to: "/zones" })}
            onSubmit={handleCreate}
            mapHeight="520px"
            referenceZones={referenceZones}
          />
        </CardContent>
      </Card>
    </section>
  )
}
