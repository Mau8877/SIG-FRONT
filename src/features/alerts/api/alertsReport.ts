import type { GetAlertasParams } from "./alertsApi"

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1"

/**
 * Descarga el reporte CSV de alertas (CU-37) respetando los filtros actuales.
 * Usa la cookie de sesión (credentials: include) como el resto de la app.
 */
export async function downloadAlertasReporte(params: GetAlertasParams): Promise<void> {
  const search = new URLSearchParams()
  if (params.tipo) search.set("tipo", params.tipo)
  if (params.atendida !== undefined) search.set("atendida", String(params.atendida))
  if (params.ninoId) search.set("nino_id", String(params.ninoId))
  if (params.desde) search.set("desde", params.desde)
  if (params.hasta) search.set("hasta", params.hasta)

  const response = await fetch(`${API_URL}/alertas/reporte/?${search.toString()}`, {
    credentials: "include",
  })

  if (!response.ok) {
    throw new Error(`No se pudo generar el reporte (${response.status}).`)
  }

  const blob = await response.blob()
  const objectUrl = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = objectUrl
  anchor.download = extractFilename(response) ?? "reporte_alertas.csv"
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(objectUrl)
}

function extractFilename(response: Response): string | null {
  const disposition = response.headers.get("Content-Disposition")
  if (!disposition) return null
  const match = /filename="?([^"]+)"?/.exec(disposition)
  return match?.[1] ?? null
}
