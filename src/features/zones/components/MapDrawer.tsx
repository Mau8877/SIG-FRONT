import { useEffect, useRef, useState } from "react"
import { Hand, PenTool } from "lucide-react"

import type { GeoJSONPolygon } from "../types"

// Leaflet usa window directamente, por lo que la importación debe hacerse
// dentro del componente para evitar errores en entornos SSR o de prueba.
let L: typeof import("leaflet") | null = null

type Props = {
  initialPolygon?: GeoJSONPolygon | null
  onChange: (polygon: GeoJSONPolygon | null) => void
  readOnly?: boolean
  height?: string
  referenceZones?: { polygon: GeoJSONPolygon; nombre: string }[]
}

export function MapDrawer({ initialPolygon, onChange, readOnly = false, height = "360px", referenceZones }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<import("leaflet").Map | null>(null)
  const clickHandlerRef = useRef<((e: import("leaflet").LeafletMouseEvent) => void) | null>(null)
  const polygonLayerRef = useRef<import("leaflet").Polygon | null>(null)
  const pointsRef = useRef<import("leaflet").LatLng[]>([])
  const previewLayerRef = useRef<import("leaflet").Polyline | null>(null)
  const markerLayersRef = useRef<import("leaflet").CircleMarker[]>([])
  const referenceGroupRef = useRef<import("leaflet").LayerGroup | null>(null)
  const [leafletReady, setLeafletReady] = useState(false)
  const [mode, setMode] = useState<"pan" | "draw">("draw")
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
      clickHandlerRef.current = (e) => {
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
      }

      map.on("click", clickHandlerRef.current)
    }

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [leafletReady, initialPolygon, readOnly])

  useEffect(() => {
    if (!L || !mapRef.current || !clickHandlerRef.current) return

    const leaflet = L
    const map = mapRef.current
    const container = map.getContainer()
    map.off("click", clickHandlerRef.current)

    // Override cursor en el container y sus hijos interactivos
    function setCursor(cursor: string) {
      container.style.cursor = cursor
      container.querySelectorAll<HTMLElement>(".leaflet-interactive, .leaflet-grab, .leaflet-container")
        .forEach((el) => { el.style.cursor = cursor })
    }

    if (readOnly) {
      setCursor("default")
      return
    }

    if (mode === "draw") {
      map.on("click", clickHandlerRef.current)
      setCursor("crosshair")
      return
    }

    // Modo pan: limpiar dibujo parcial si existe
    if (pointsRef.current.length > 0 || previewLayerRef.current) {
      previewLayerRef.current?.remove()
      previewLayerRef.current = null
      pointsRef.current = []
      setPointCount(0)

      const polygon = polygonLayerRef.current
      markerLayersRef.current.forEach((marker) => marker.remove())
      markerLayersRef.current = []

      if (polygon) {
        const rings = polygon.getLatLngs() as import("leaflet").LatLng[][]
        const confirmedPoints = rings[0]
        if (confirmedPoints) {
          confirmedPoints.forEach((latlng) => {
            const marker = leaflet.circleMarker(latlng, {
              radius: 5,
              color: "#ffffff",
              weight: 2,
              fillColor: "#22c55e",
              fillOpacity: 1,
            }).addTo(map)
            markerLayersRef.current.push(marker)
          })
        }
      }
    }

    setCursor("grab")
  }, [mode, leafletReady, readOnly])

  // Renderiza polígonos de referencia (zonas existentes) como fondo semi-transparente
  useEffect(() => {
    if (!L || !mapRef.current) return

    // Limpiar capa anterior
    referenceGroupRef.current?.remove()
    referenceGroupRef.current = null

    if (!referenceZones?.length) return

    const leaflet = L
    const group = leaflet.layerGroup()

    referenceZones.forEach((zone) => {
      const latlngs = zone.polygon.coordinates[0].map(
        ([lng, lat]) => leaflet.latLng(lat, lng)
      )
      leaflet.polygon(latlngs, {
        color: "#64748b",
        fillColor: "#64748b",
        fillOpacity: 0.2,
        weight: 2,
      })
        .bindTooltip(zone.nombre, { sticky: true, direction: "top" })
        .addTo(group)
    })

    group.addTo(mapRef.current)
    group.eachLayer((layer) => {
      ;(layer as import("leaflet").Path).bringToBack()
    })
    referenceGroupRef.current = group

    return () => {
      group.remove()
    }
  }, [referenceZones, leafletReady])

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

      {!readOnly && (
        <div className="flex gap-1 pb-2">
          <button
            type="button"
            onClick={() => setMode("pan")}
            title="Arrastrar mapa"
            className={`rounded-md p-2 transition-colors ${
              mode === "pan"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            <Hand className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setMode("draw")}
            title="Dibujar polígono"
            className={`rounded-md p-2 transition-colors ${
              mode === "draw"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            <PenTool className="h-4 w-4" />
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
          <p className="text-sm font-medium text-slate-700">
            {pointCount === 0
              ? "📍 Haz clic en el mapa para marcar los vértices de tu zona."
              : `📍 ${pointCount} punto${pointCount !== 1 ? "s" : ""} marcado${pointCount !== 1 ? "s" : ""}. Mínimo 3 para confirmar el perímetro.`}
          </p>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {mode === "draw" && pointCount >= 3 && (
              <button
                type="button"
                onClick={confirmPolygon}
                className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
              >
                ✓ Confirmar zona
              </button>
            )}
            {mode === "draw" && pointCount > 0 && (
              <button
                type="button"
                onClick={clearPolygon}
                className="rounded-md border border-destructive/50 bg-destructive/5 px-3 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
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
