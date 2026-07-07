import { appApi } from "@/src/store/api"
import type { PaginatedResponse } from "@/src/types/api"

import type { Nino, NinoPayload } from "../types"

export type GetNinosParams = {
  page?: number
  includeInactive?: boolean
}

export const childrenApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getNinos: builder.query<PaginatedResponse<Nino>, GetNinosParams | void>({
      query: (params) => ({
        url: "/children/ninos/",
        params: {
          page: params?.page ?? 1,
          include_inactive: params?.includeInactive ? "true" : undefined,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "Nino", id: "LIST" },
              ...result.results.map((nino) => ({
                type: "Nino" as const,
                id: getNinoId(nino),
              })),
            ]
          : [{ type: "Nino", id: "LIST" }],
    }),
    getNino: builder.query<Nino, number>({
      query: (id) => `/children/ninos/${id}/`,
      providesTags: (_result, _error, id) => [{ type: "Nino", id }],
    }),
    createNino: builder.mutation<Nino, NinoPayload>({
      query: (body) => ({
        url: "/children/ninos/",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Nino", id: "LIST" }],
    }),
    updateNino: builder.mutation<Nino, { id: number; body: Partial<NinoPayload> }>({
      query: ({ id, body }) => ({
        url: `/children/ninos/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Nino", id },
        { type: "Nino", id: "LIST" },
      ],
    }),
    deactivateNino: builder.mutation<unknown, number>({
      query: (id) => ({
        url: `/children/ninos/${id}/deactivate/`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Nino", id },
        { type: "Nino", id: "LIST" },
      ],
    }),
    reactivateNino: builder.mutation<unknown, number>({
      query: (id) => ({
        url: `/children/ninos/${id}/reactivate/`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Nino", id },
        { type: "Nino", id: "LIST" },
      ],
    }),
  }),
})

export const {
  useCreateNinoMutation,
  useDeactivateNinoMutation,
  useGetNinoQuery,
  useGetNinosQuery,
  useReactivateNinoMutation,
  useUpdateNinoMutation,
} = childrenApi

export function getNinoId(nino: Nino) {
  return nino.id_nino ?? nino.id ?? 0
}
