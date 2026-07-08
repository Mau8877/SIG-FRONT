import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

import type { GeoJSONPolygon, ZonaPayload } from "../types"
import { MapDrawer } from "./MapDrawer"

type Props = {
  initialValues?: Partial<ZonaPayload>
  submitLabel: string
  isSubmitting: boolean
  onSubmit: (values: ZonaPayload) => void
  onCancel: () => void
  mapHeight?: string
  referenceZones?: { polygon: GeoJSONPolygon; nombre: string }[]
}

export function ZonaForm({ initialValues, submitLabel, isSubmitting, onSubmit, onCancel, mapHeight = "520px", referenceZones }: Props) {
  const [nombre, setNombre] = useState(initialValues?.nombre ?? "")
  const [poligono, setPoligono] = useState<GeoJSONPolygon | null>(
    initialValues?.poligono ?? null
  )
  const [touched, setTouched] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setTouched(true)

    if (!nombre.trim() || !poligono) return

    onSubmit({ nombre: nombre.trim(), poligono })
  }

  const nombreError = touched && !nombre.trim() ? "El nombre es obligatorio." : null
  const poligonoError = touched && !poligono ? "Debes dibujar y confirmar una zona en el mapa." : null

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="zona-nombre">Nombre de la zona</Label>
        <Input
          id="zona-nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej: Casa, Colegio, Parque"
        />
        {nombreError && <p className="text-sm text-destructive">{nombreError}</p>}
      </div>

      <div className="space-y-1.5">
        <Label>Área de la zona</Label>
        <p className="text-xs text-muted-foreground">
          Busca una ubicación y haz clic en el mapa para definir los vértices. Confirma la zona cuando termines.
        </p>
        <MapDrawer
          initialPolygon={initialValues?.poligono ?? null}
          onChange={(poly) => setPoligono(poly)}
          height={mapHeight}
          referenceZones={referenceZones}
        />
        {poligonoError && <p className="text-sm text-destructive">{poligonoError}</p>}
        {poligono && (
          <p className="text-xs text-muted-foreground">
            Zona confirmada con {poligono.coordinates[0].length - 1} vértices.
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}
