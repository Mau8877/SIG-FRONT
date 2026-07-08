import { appApi } from "@/src/store/api"

import type { HistorialParams, HistorialResponse } from "../types"

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1"

export const routeHistoryApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getHistorial: builder.query<HistorialResponse, HistorialParams>({
      query: ({ ninoId, desde, hasta }) => ({
        url: "/posiciones/historial/",
        params: { nino: ninoId, desde, hasta },
      }),
    }),
  }),
})

export const { useGetHistorialQuery } = routeHistoryApi

/** Descarga el CSV del recorrido (CU-38) respetando el rango de fechas. */
export async function downloadHistorialCsv(params: HistorialParams): Promise<void> {
  const search = new URLSearchParams({ nino: String(params.ninoId), formato: "csv" })
  if (params.desde) search.set("desde", params.desde)
  if (params.hasta) search.set("hasta", params.hasta)

  const response = await fetch(`${API_URL}/posiciones/historial/?${search.toString()}`, {
    credentials: "include",
  })
  if (!response.ok) {
    throw new Error(`No se pudo generar el reporte (${response.status}).`)
  }

  const blob = await response.blob()
  const objectUrl = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = objectUrl
  const disposition = response.headers.get("Content-Disposition")
  anchor.download = /filename="?([^"]+)"?/.exec(disposition ?? "")?.[1] ?? "historial.csv"
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(objectUrl)
}
