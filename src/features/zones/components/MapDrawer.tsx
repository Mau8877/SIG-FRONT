import { useEffect, useRef, useState } from "react"

import type { GeoJSONPolygon } from "../types"

// Leaflet usa window directamente, por lo que la importación debe hacerse
// dentro del componente para evitar errores en entornos SSR o de prueba.
let L: typeof import("leaflet") | null = null

type Props = {
  initialPolygon?: GeoJSONPolygon | null
  onChange: (polygon: GeoJSONPolygon | null) => void
  readOnly?: boolean
  height?: string
}

export function MapDrawer({ initialPolygon, onChange, readOnly = false, height = "360px" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<import("leaflet").Map | null>(null)
  const polygonLayerRef = useRef<import("leaflet").Polygon | null>(null)
  const pointsRef = useRef<import("leaflet").LatLng[]>([])
  const previewLayerRef = useRef<import("leaflet").Polyline | null>(null)
  const markerLayersRef = useRef<import("leaflet").CircleMarker[]>([])
  const [leafletReady, setLeafletReady] = useState(false)
  const [pointCount, setPointCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  // Carga Leaflet de forma dinámica para evitar errores con window en builds
  useEffect(() => {
    import("leaflet").then((mod) => {
      L = mod.default ?? mod
      setLeafletReady(true)
    })
  }, [])

  // Inicializa el mapa una vez que Leaflet está cargado
  useEffect(() => {
    if (!leafletReady || !L || !containerRef.current) return
    if (mapRef.current) return

    // Importar el CSS de Leaflet dinámicamente
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    document.head.appendChild(link)

    const map = L.map(containerRef.current).setView([-17.7833, -63.1821], 14)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map)

    mapRef.current = map

    // Si viene un polígono inicial, dibujarlo en el mapa
    if (initialPolygon) {
      const latlngs = initialPolygon.coordinates[0].map(
        ([lng, lat]) => L!.latLng(lat, lng)
      )
      polygonLayerRef.current = L.polygon(latlngs, {
        color: "#22c55e",
        fillOpacity: 0.25,
      }).addTo(map)
      map.fitBounds(polygonLayerRef.current.getBounds())

      // Dibujar marcadores circulares en cada vértice del polígono
      latlngs.slice(0, -1).forEach((latlng) => {
        const marker = L!.circleMarker(latlng, {
          radius: 5,
          color: "#ffffff",
          weight: 2,
          fillColor: "#22c55e",
          fillOpacity: 1,
        }).addTo(map)
        markerLayersRef.current.push(marker)
      })
    }

    if (!readOnly) {
      map.getContainer().style.cursor = "crosshair"

      map.on("click", (e) => {
        if (!L || !mapRef.current) return

        pointsRef.current.push(e.latlng)
        setPointCount(pointsRef.current.length)

        // Crear un marcador visual inmediatamente al hacer clic
        const marker = L.circleMarker(e.latlng, {
          radius: 6,
          color: "#ffffff",
          weight: 2,
          fillColor: "#3b82f6",
          fillOpacity: 1,
        }).addTo(mapRef.current)
        markerLayersRef.current.push(marker)

        // Actualizar la línea de previsualización mientras se dibuja
        if (previewLayerRef.current) {
          previewLayerRef.current.remove()
        }

        if (pointsRef.current.length >= 2) {
          previewLayerRef.current = L.polyline(pointsRef.current, {
            color: "#3b82f6",
            weight: 3,
            dashArray: "6",
          }).addTo(mapRef.current)
        }
      })
    }

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [leafletReady])

  function confirmPolygon() {
    if (!L || !mapRef.current) return
    if (pointsRef.current.length < 3) return

    if (polygonLayerRef.current) polygonLayerRef.current.remove()
    if (previewLayerRef.current) previewLayerRef.current.remove()
    markerLayersRef.current.forEach((m) => m.remove())
    markerLayersRef.current = []

    const closed = [...pointsRef.current, pointsRef.current[0]]
    polygonLayerRef.current = L.polygon(pointsRef.current, {
      color: "#22c55e",
      fillOpacity: 0.25,
    }).addTo(mapRef.current)

    // Dibujar marcadores verdes en los vértices confirmados
    pointsRef.current.forEach((latlng) => {
      const marker = L!.circleMarker(latlng, {
        radius: 5,
        color: "#ffffff",
        weight: 2,
        fillColor: "#22c55e",
        fillOpacity: 1,
      }).addTo(mapRef.current!)
      markerLayersRef.current.push(marker)
    })

    // Convertir a GeoJSON Polygon (coordenadas en orden [lng, lat])
    const coordinates = [closed.map((p) => [p.lng, p.lat])]
    onChange({ type: "Polygon", coordinates })

    pointsRef.current = []
    setPointCount(0)
    previewLayerRef.current = null
  }

  function clearPolygon() {
    if (polygonLayerRef.current) polygonLayerRef.current.remove()
    if (previewLayerRef.current) previewLayerRef.current.remove()
    markerLayersRef.current.forEach((m) => m.remove())
    markerLayersRef.current = []
    polygonLayerRef.current = null
    previewLayerRef.current = null
    pointsRef.current = []
    setPointCount(0)
    onChange(null)
  }

  async function handleSearch() {
    if (!searchQuery.trim() || !mapRef.current || !L) return
    setSearching(true)
    setSearchError(null)

    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`,
        { headers: { "Accept-Language": "es" } }
      )
      const data = await resp.json()

      if (!data.length) {
        setSearchError("No se encontró la ubicación.")
        return
      }

      const { lat, lon } = data[0]
      mapRef.current.setView([parseFloat(lat), parseFloat(lon)], 16)
    } catch {
      setSearchError("Error al buscar la ubicación.")
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="space-y-2">
      {!readOnly && (
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void handleSearch()}
            placeholder="Buscar ubicación..."
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button
            type="button"
            onClick={() => void handleSearch()}
            disabled={searching}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent"
          >
            {searching ? "Buscando..." : "Buscar"}
          </button>
        </div>
      )}

      {searchError && (
        <p className="text-sm text-destructive">{searchError}</p>
      )}

      <div
        ref={containerRef}
        style={{ height }}
        className="w-full rounded-lg border border-border overflow-hidden"
      />

      {!readOnly && (
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">
            {pointCount === 0
              ? "Haz clic en el mapa para agregar vértices del polígono."
              : `${pointCount} punto${pointCount !== 1 ? "s" : ""} marcado${pointCount !== 1 ? "s" : ""}. Mínimo 3 para confirmar.`}
          </p>
          <div className="ml-auto flex gap-2">
            {pointCount >= 3 && (
              <button
                type="button"
                onClick={confirmPolygon}
                className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90"
              >
                Confirmar zona
              </button>
            )}
            {pointCount > 0 && (
              <button
                type="button"
                onClick={clearPolygon}
                className="rounded-md border border-destructive/50 px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
