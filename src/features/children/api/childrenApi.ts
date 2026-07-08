import { appApi } from "@/src/store/api"
import type { PaginatedResponse } from "@/src/types/api"

import type {
  AssignCenterPayload,
  CentroEducativoSelection,
  Nino,
  NinoPayload,
} from "../types"

export type GetNinosParams = {
  page?: number
  includeInactive?: boolean
}

export type GetCentersParams = {
  page?: number
}

export type GetInstitutionChildrenParams = {
  page?: number
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
    getCenters: builder.query<PaginatedResponse<CentroEducativoSelection>, GetCentersParams | void>({
      query: (params) => ({
        url: "/institutions/centers/",
        params: {
          page: params?.page ?? 1,
        },
      }),
      providesTags: [{ type: "Center", id: "LIST" }],
    }),
    assignNinoCenter: builder.mutation<
      Nino,
      { id: number; body: AssignCenterPayload }
    >({
      query: ({ id, body }) => ({
        url: `/children/ninos/${id}/assign-center/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Nino", id },
        { type: "Nino", id: "LIST" },
        { type: "InstitutionChildren", id: "LIST" },
      ],
    }),
    removeNinoCenter: builder.mutation<unknown, number>({
      query: (id) => ({
        url: `/children/ninos/${id}/remove-center/`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Nino", id },
        { type: "Nino", id: "LIST" },
        { type: "InstitutionChildren", id: "LIST" },
      ],
    }),
    getInstitutionChildren: builder.query<
      PaginatedResponse<Nino>,
      GetInstitutionChildrenParams | void
    >({
      query: (params) => ({
        url: "/institutions/children/",
        params: {
          page: params?.page ?? 1,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "InstitutionChildren", id: "LIST" },
              ...result.results.map((nino) => ({
                type: "Nino" as const,
                id: getNinoId(nino),
              })),
            ]
          : [{ type: "InstitutionChildren", id: "LIST" }],
    }),
    createNino: builder.mutation<Nino, NinoPayload>({
      query: (body) => ({
        url: "/children/ninos/",
        method: "POST",
        body: toNinoFormData(body),
      }),
      invalidatesTags: [{ type: "Nino", id: "LIST" }],
    }),
    updateNino: builder.mutation<Nino, { id: number; body: NinoPayload }>({
      query: ({ id, body }) => ({
        url: `/children/ninos/${id}/`,
        method: "PATCH",
        body: toNinoFormData(body),
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Nino", id },
        { type: "Nino", id: "LIST" },
        { type: "InstitutionChildren", id: "LIST" },
      ],
    }),
    removeNinoPhoto: builder.mutation<unknown, number>({
      query: (id) => ({
        url: `/children/ninos/${id}/remove-photo/`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Nino", id },
        { type: "Nino", id: "LIST" },
        { type: "InstitutionChildren", id: "LIST" },
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
  useAssignNinoCenterMutation,
  useCreateNinoMutation,
  useDeactivateNinoMutation,
  useGetCentersQuery,
  useGetInstitutionChildrenQuery,
  useGetNinoQuery,
  useGetNinosQuery,
  useRemoveNinoCenterMutation,
  useRemoveNinoPhotoMutation,
  useReactivateNinoMutation,
  useUpdateNinoMutation,
} = childrenApi

export function getNinoId(nino: Nino) {
  return nino.id_nino ?? nino.id ?? 0
}

function toNinoFormData(values: NinoPayload) {
  const formData = new FormData()

  formData.append("nombre", values.nombre)
  formData.append("fecha_nacimiento", values.fecha_nacimiento)

  if (values.foto) {
    formData.append("foto", values.foto)
  }

  return formData
}
