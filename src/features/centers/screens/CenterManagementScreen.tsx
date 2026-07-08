import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"

import { useGetMyCenterQuery, useUpdateMyCenterMutation } from "../api/centersApi"
import type { CentroEducativo } from "../types"

export function CenterManagementScreen() {
  const { data, isLoading, isError, refetch } = useGetMyCenterQuery()

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Gestión del Centro Educativo</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Consultá y actualizá los datos de tu centro.
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Datos del centro</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : isError || !data ? (
            <div className="space-y-3">
              <p className="text-sm text-destructive">No se pudo cargar el centro.</p>
              <Button variant="outline" onClick={() => void refetch()}>
                Reintentar
              </Button>
            </div>
          ) : (
            // key: reinicia el formulario si cambia el centro cargado.
            <CenterForm key={data.id_centro} center={data} />
          )}
        </CardContent>
      </Card>
    </section>
  )
}

function CenterForm({ center }: { center: CentroEducativo }) {
  const [updateMyCenter, { isLoading: isSaving }] = useUpdateMyCenterMutation()
  const [nombre, setNombre] = useState(center.nombre)
  const [direccion, setDireccion] = useState(center.direccion)
  const [feedback, setFeedback] = useState<{ type: "ok" | "error"; message: string } | null>(null)

  const canSave = nombre.trim().length > 0 && direccion.trim().length > 0 && !isSaving

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setFeedback(null)
    try {
      await updateMyCenter({ nombre: nombre.trim(), direccion: direccion.trim() }).unwrap()
      setFeedback({ type: "ok", message: "Datos del centro actualizados." })
    } catch {
      setFeedback({ type: "error", message: "No se pudieron guardar los cambios." })
    }
  }

  return (
    <form className="space-y-4" onSubmit={(event) => void handleSubmit(event)}>
      <div className="space-y-2">
        <Label htmlFor="center-nombre">Nombre</Label>
        <Input
          id="center-nombre"
          value={nombre}
          onChange={(event) => setNombre(event.target.value)}
          maxLength={150}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="center-direccion">Dirección</Label>
        <Textarea
          id="center-direccion"
          value={direccion}
          onChange={(event) => setDireccion(event.target.value)}
          rows={3}
          required
        />
      </div>
      {feedback ? (
        <p className={feedback.type === "ok" ? "text-sm text-emerald-600" : "text-sm text-destructive"}>
          {feedback.message}
        </p>
      ) : null}
      <Button type="submit" disabled={!canSave}>
        {isSaving ? "Guardando…" : "Guardar cambios"}
      </Button>
    </form>
  )
}
