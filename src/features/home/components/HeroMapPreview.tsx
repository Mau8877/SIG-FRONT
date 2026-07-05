import {
  BellRing,
  MapPin,
  Pencil,
  RotateCcw,
  ShieldCheck,
} from "lucide-react"
import { useCallback, useMemo, useRef, useState, type PointerEvent } from "react"

import { Button } from "@/components/ui/button"

const VIEW_W = 400
const VIEW_H = 300
const CLOSE_DISTANCE = 16

type Point = {
  x: number
  y: number
}

const defaultZone: Point[] = [
  { x: 113.45, y: 176.72 },
  { x: 146.22, y: 84.99 },
  { x: 221.85, y: 88.36 },
  { x: 223.53, y: 172.51 },
]

const defaultMarker: Point = { x: 176.26, y: 130.65 }

function pointInPolygon(point: Point, polygon: Point[]) {
  let inside = false

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const current = polygon[i]
    const previous = polygon[j]
    const intersects =
      current.y > point.y !== previous.y > point.y &&
      point.x <
        ((previous.x - current.x) * (point.y - current.y)) /
          (previous.y - current.y) +
          current.x

    if (intersects) {
      inside = !inside
    }
  }

  return inside
}

function toPath(points: Point[]) {
  return points.map((point) => `${point.x},${point.y}`).join(" ")
}

function centroid(points: Point[]) {
  const sum = points.reduce<Point>(
    (total, point) => ({
      x: total.x + point.x,
      y: total.y + point.y,
    }),
    { x: 0, y: 0 },
  )

  return {
    x: sum.x / points.length,
    y: sum.y / points.length,
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function HeroMapPreview() {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [points, setPoints] = useState<Point[]>(defaultZone)
  const [draft, setDraft] = useState<Point[]>([])
  const [drawing, setDrawing] = useState(false)
  const [marker, setMarker] = useState<Point>(defaultMarker)
  const [draggingMarker, setDraggingMarker] = useState(false)

  const closed = points.length >= 3
  const insideZone = closed ? pointInPolygon(marker, points) : null
  const center = useMemo(() => (closed ? centroid(points) : null), [closed, points])

  const toSvgPoint = useCallback((event: PointerEvent<SVGElement>): Point => {
    const svg = svgRef.current

    if (!svg) {
      return { x: 0, y: 0 }
    }

    const rect = svg.getBoundingClientRect()

    return {
      x: ((event.clientX - rect.left) / rect.width) * VIEW_W,
      y: ((event.clientY - rect.top) / rect.height) * VIEW_H,
    }
  }, [])

  function handleMapPointerDown(event: PointerEvent<SVGSVGElement>) {
    if (!drawing) {
      return
    }

    const point = toSvgPoint(event)
    const firstPoint = draft[0]

    if (
      draft.length >= 3 &&
      firstPoint &&
      Math.hypot(point.x - firstPoint.x, point.y - firstPoint.y) < CLOSE_DISTANCE
    ) {
      setPoints(draft)
      setDraft([])
      setDrawing(false)
      return
    }

    setDraft((currentDraft) => [...currentDraft, point])
  }

  function startDrawing() {
    setPoints([])
    setDraft([])
    setDrawing(true)
  }

  function resetZone() {
    setPoints(defaultZone)
    setDraft([])
    setDrawing(false)
    setMarker(defaultMarker)
  }

  function handleMarkerPointerDown(event: PointerEvent<SVGGElement>) {
    event.stopPropagation()
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    setDraggingMarker(true)
  }

  function handlePointerMove(event: PointerEvent<SVGSVGElement>) {
    if (!draggingMarker) {
      return
    }

    const point = toSvgPoint(event)
    setMarker({
      x: clamp(point.x, 8, VIEW_W - 8),
      y: clamp(point.y, 8, VIEW_H - 8),
    })
  }

  function stopDraggingMarker() {
    setDraggingMarker(false)
  }

  const statusTitle = drawing
    ? "Dibuja una zona segura"
    : closed
      ? "Zona segura definida"
      : "Define una zona segura"

  const statusDescription = drawing
    ? draft.length === 0
      ? "Marca puntos sobre el mapa para iniciar."
      : "Toca cerca del primer punto para cerrar."
    : closed
      ? "Arrastra el pin para probar entradas y salidas."
      : "Crea una geocerca para activar el monitoreo."

  return (
    <div className="relative mx-auto w-full max-w-lg select-none">
      <div className="rounded-3xl border border-border bg-background p-4 shadow-xl">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              {statusTitle}
            </p>
            <p className="mt-1 max-w-[17rem] text-xs leading-5 text-muted-foreground">
              {statusDescription}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
            {!drawing && (
              <Button type="button" size="xs" onClick={startDrawing}>
                <Pencil className="size-3" aria-hidden="true" />
                {closed ? "Editar zona" : "Dibujar zona"}
              </Button>
            )}

            {(closed || drawing) && (
              <Button
                type="button"
                size="xs"
                variant="outline"
                onClick={resetZone}
              >
                <RotateCcw className="size-3" aria-hidden="true" />
                Reiniciar
              </Button>
            )}
          </div>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            className={`h-full w-full touch-none ${drawing ? "cursor-crosshair" : ""}`}
            onPointerDown={handleMapPointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={stopDraggingMarker}
            onPointerLeave={stopDraggingMarker}
          >
            <rect
              x="0"
              y="0"
              width={VIEW_W}
              height={VIEW_H}
              fill="var(--muted)"
            />

            <path
              d="M0,80 C100,68 300,96 400,74"
              stroke="var(--background)"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M0,80 C100,68 300,96 400,74"
              stroke="var(--border)"
              strokeWidth="1.5"
              strokeDasharray="6 8"
              fill="none"
            />
            <path
              d="M0,182 C120,192 280,164 400,186"
              stroke="var(--background)"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M0,182 C120,192 280,164 400,186"
              stroke="var(--border)"
              strokeWidth="1.5"
              strokeDasharray="6 8"
              fill="none"
            />
            <path
              d="M0,250 L400,244"
              stroke="var(--background)"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M0,250 L400,244"
              stroke="var(--border)"
              strokeWidth="1.5"
              strokeDasharray="6 8"
              fill="none"
            />
            <path
              d="M64,300 C94,200 132,100 172,0"
              stroke="var(--background)"
              strokeWidth="15"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M64,300 C94,200 132,100 172,0"
              stroke="var(--border)"
              strokeWidth="1.5"
              strokeDasharray="6 8"
              fill="none"
            />
            <path
              d="M226,0 L232,300"
              stroke="var(--background)"
              strokeWidth="11"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M226,0 L232,300"
              stroke="var(--border)"
              strokeWidth="1.5"
              strokeDasharray="6 8"
              fill="none"
            />
            <path
              d="M322,0 C312,100 332,200 342,300"
              stroke="var(--background)"
              strokeWidth="11"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M322,0 C312,100 332,200 342,300"
              stroke="var(--border)"
              strokeWidth="1.5"
              strokeDasharray="6 8"
              fill="none"
            />

            {draft.length > 0 && (
              <polyline
                points={toPath(draft)}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2"
                strokeDasharray="5 4"
              />
            )}

            {draft.map((point, index) => (
              <circle
                key={`${point.x}-${point.y}-${index}`}
                cx={point.x}
                cy={point.y}
                r={index === 0 ? 6 : 3.5}
                fill={index === 0 ? "var(--background)" : "var(--primary)"}
                stroke="var(--primary)"
                strokeWidth="2"
              />
            ))}

            {closed && (
              <polygon
                points={toPath(points)}
                fill="var(--success)"
                fillOpacity="0.2"
                stroke="var(--success)"
                strokeWidth="2.5"
              />
            )}

            {closed && center && (
              <text
                x={center.x}
                y={center.y}
                fontSize="10"
                textAnchor="middle"
                fill="var(--success-foreground)"
                fontWeight="600"
              >
                Zona segura
              </text>
            )}

            <g
              transform={`translate(${marker.x} ${marker.y})`}
              onPointerDown={handleMarkerPointerDown}
              onClick={(event) => event.stopPropagation()}
              className={drawing ? "cursor-default" : "cursor-grab"}
            >
              {!drawing && (
                <circle
                  r="16"
                  fill={insideZone === false ? "var(--warning)" : "var(--primary)"}
                  opacity="0.18"
                >
                  <animate
                    attributeName="r"
                    values="14;20;14"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.25;0;0.25"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
              <circle
                r="10"
                fill={insideZone === false ? "var(--warning)" : "var(--primary)"}
                stroke="var(--background)"
                strokeWidth="2"
              />
              <foreignObject x="-7" y="-7" width="14" height="14">
                <MapPin
                  className="size-3.5 text-primary-foreground"
                  strokeWidth={3}
                />
              </foreignObject>
            </g>
          </svg>
        </div>
      </div>

      {!drawing && !closed && (
        <div className="absolute -bottom-6 left-2 z-30 max-w-[220px] rounded-2xl border border-border bg-background p-4 shadow-lg sm:left-6">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Pencil className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Dibuja tu zona
              </p>
              <p className="text-xs leading-5 text-muted-foreground">
                Toca "Dibujar zona" y marca las esquinas en el mapa.
              </p>
            </div>
          </div>
        </div>
      )}

      {closed && insideZone && (
        <div className="absolute bottom-3 left-3 z-20 max-w-[calc(100%-1.5rem)] rounded-full border border-border bg-background px-3 py-2 shadow-lg sm:bottom-4 sm:left-4">
          <div className="flex items-center gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-success text-success-foreground">
              <ShieldCheck className="size-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold text-foreground sm:text-sm">
                Zona segura activa
              </p>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Ubicacion dentro del area
              </p>
            </div>
          </div>
        </div>
      )}

      {closed && insideZone === false && (
        <div className="absolute -bottom-6 right-2 z-30 max-w-[220px] rounded-2xl border border-border bg-background p-4 shadow-lg sm:right-8">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-warning text-warning-foreground">
              <BellRing className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Alerta preventiva
              </p>
              <p className="text-xs leading-5 text-muted-foreground">
                Salida detectada fuera del limite seguro.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
