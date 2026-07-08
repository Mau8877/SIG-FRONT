import { useEffect, useRef, useState } from "react"

import type { InstitutionMapData } from "../types"

// Leaflet usa window directamente; se importa dinámicamente (igual que MapDrawer).
let L: typeof import("leaflet") | null = null

const SANTA_CRUZ: [number, number] = [-17.7833, -63.1821]

function markerColor(dentro: boolean | null): string {
  if (dentro === true) return "#16a34a"
  if (dentro === false) return "#dc2626"
  return "#94a3b8"
}

function statusLabel(dentro: boolean | null): string {
  if (dentro === true) return "Dentro de zona"
  if (dentro === false) return "Fuera de zona"
  return "Sin datos"
}

export function CenterMap({ data, height = "520px" }: { data: InstitutionMapData; height?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<import("leaflet").Map | null>(null)
  const layerRef = useRef<import("leaflet").LayerGroup | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    import("leaflet").then((mod) => {
      L = mod.default ?? mod
      setReady(true)
    })
  }, [])

  useEffect(() => {
    if (!ready || !L || !containerRef.current || mapRef.current) return

    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    document.head.appendChild(link)

    const map = L.map(containerRef.current).setView(SANTA_CRUZ, 14)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map)
    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [ready])

  // Redibuja zonas y niños cuando cambian los datos.
  useEffect(() => {
    if (!ready || !L || !mapRef.current) return
    const leaflet = L
    const map = mapRef.current

    layerRef.current?.remove()
    const group = leaflet.layerGroup().addTo(map)
    layerRef.current = group

    const bounds = leaflet.latLngBounds([])

    data.zonas.forEach((zona) => {
      const latlngs = zona.poligono.coordinates[0].map(([lng, lat]) => leaflet.latLng(lat, lng))
      const polygon = leaflet
        .polygon(latlngs, { color: "#2563eb", fillColor: "#2563eb", fillOpacity: 0.12, weight: 2 })
        .bindTooltip(zona.nombre, { sticky: true, direction: "top" })
      polygon.addTo(group)
      bounds.extend(polygon.getBounds())
    })

    data.children.forEach((child) => {
      if (child.latitud === null || child.longitud === null) return
      const color = markerColor(child.dentro_zona)
      const latlng = leaflet.latLng(child.latitud, child.longitud)
      const bateria = child.bateria === null ? "—" : `${child.bateria}%`
      const fecha = child.fecha_posicion ? new Date(child.fecha_posicion).toLocaleString() : "Sin datos"
      leaflet
        .circleMarker(latlng, { radius: 9, color: "#ffffff", weight: 2, fillColor: color, fillOpacity: 1 })
        .bindTooltip(
          `<strong>${child.nombre}</strong><br/>${statusLabel(child.dentro_zona)}<br/>Batería: ${bateria}<br/>${fecha}`,
          { direction: "top" },
        )
        .addTo(group)
      bounds.extend(latlng)
    })

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [32, 32], maxZoom: 16 })
    }
  }, [ready, data])

  return <div ref={containerRef} style={{ height }} className="w-full rounded-lg border border-border overflow-hidden" />
}
