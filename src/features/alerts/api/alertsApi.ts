import { appApi } from "@/src/store/api"
import type { PaginatedResponse } from "@/src/types/api"

import type { Alerta, AlertType } from "../types"

export type GetAlertasParams = {
  page?: number
  tipo?: AlertType
  atendida?: boolean
  ninoId?: number
  desde?: string
  hasta?: string
}

export const alertsApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getAlertas: builder.query<PaginatedResponse<Alerta>, GetAlertasParams | void>({
      query: (params) => ({
        url: "/alertas/",
        params: {
          page: params?.page ?? 1,
          tipo: params?.tipo,
          atendida: params?.atendida === undefined ? undefined : String(params.atendida),
          nino_id: params?.ninoId,
          desde: params?.desde,
          hasta: params?.hasta,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "Alerta", id: "LIST" },
              ...result.results.map((alerta) => ({ type: "Alerta" as const, id: alerta.id_alerta })),
            ]
          : [{ type: "Alerta", id: "LIST" }],
    }),
    atenderAlerta: builder.mutation<Alerta, number>({
      query: (id) => ({
        url: `/alertas/${id}/atender/`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Alerta", id },
        { type: "Alerta", id: "LIST" },
      ],
    }),
  }),
})

export const { useGetAlertasQuery, useAtenderAlertaMutation } = alertsApi
