import { appApi } from "@/src/store/api"
import type { PaginatedResponse } from "@/src/types/api"

import type { ZonaSegura, ZonaPayload, ZonaUpdatePayload, HorarioZona } from "../types"

export type GetZonasParams = {
  page?: number
  includeInactive?: boolean
}

export const zonesApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getZonas: builder.query<PaginatedResponse<ZonaSegura>, GetZonasParams | void>({
      query: (params) => ({
        url: "/zones/zonas/",
        params: {
          page: params?.page ?? 1,
          include_inactive: params?.includeInactive ? "true" : undefined,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "Zona", id: "LIST" },
              ...result.results.map((zona) => ({
                type: "Zona" as const,
                id: getZonaId(zona),
              })),
            ]
          : [{ type: "Zona", id: "LIST" }],
    }),
    getZona: builder.query<ZonaSegura, number>({
      query: (id) => `/zones/zonas/${id}/`,
      providesTags: (_result, _error, id) => [{ type: "Zona", id }],
    }),
    createZona: builder.mutation<ZonaSegura, ZonaPayload>({
      query: (body) => ({
        url: "/zones/zonas/",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Zona", id: "LIST" }],
    }),
    updateZona: builder.mutation<ZonaSegura, { id: number; body: ZonaUpdatePayload }>({
      query: ({ id, body }) => ({
        url: `/zones/zonas/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Zona", id },
        { type: "Zona", id: "LIST" },
      ],
    }),
    deactivateZona: builder.mutation<unknown, number>({
      query: (id) => ({
        url: `/zones/zonas/${id}/deactivate/`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Zona", id },
        { type: "Zona", id: "LIST" },
      ],
    }),
    reactivateZona: builder.mutation<unknown, number>({
      query: (id) => ({
        url: `/zones/zonas/${id}/reactivate/`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Zona", id },
        { type: "Zona", id: "LIST" },
      ],
    }),
    syncHorarios: builder.mutation<ZonaSegura, { id: number; body: HorarioZona[] }>({
      query: ({ id, body }) => ({
        url: `/zones/zonas/${id}/horarios/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Zona", id },
        { type: "Zona", id: "LIST" },
      ],
    }),
    vincularNino: builder.mutation<ZonaSegura, { id: number; id_nino: number }>({
      query: ({ id, id_nino }) => ({
        url: `/zones/zonas/${id}/vincular_nino/`,
        method: "POST",
        body: { id_nino },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Zona", id },
        { type: "Zona", id: "LIST" },
      ],
    }),
    desactivarNino: builder.mutation<ZonaSegura, { id: number; id_nino: number }>({
      query: ({ id, id_nino }) => ({
        url: `/zones/zonas/${id}/desactivar_nino/`,
        method: "POST",
        body: { id_nino },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Zona", id },
        { type: "Zona", id: "LIST" },
      ],
    }),
  }),
})

export const {
  useGetZonasQuery,
  useGetZonaQuery,
  useCreateZonaMutation,
  useUpdateZonaMutation,
  useDeactivateZonaMutation,
  useReactivateZonaMutation,
  useSyncHorariosMutation,
  useVincularNinoMutation,
  useDesactivarNinoMutation,
} = zonesApi

export function getZonaId(zona: ZonaSegura) {
  return zona.id_zona ?? 0
}
