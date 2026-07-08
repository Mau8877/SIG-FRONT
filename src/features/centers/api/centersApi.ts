import { appApi } from "@/src/store/api"

import type { CentroEducativo, UpdateCentroPayload } from "../types"

const MY_CENTER_TAG = { type: "Center" as const, id: "MINE" }

export const centersApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyCenter: builder.query<CentroEducativo, void>({
      query: () => "/institutions/my-center/",
      providesTags: [MY_CENTER_TAG],
    }),
    updateMyCenter: builder.mutation<CentroEducativo, UpdateCentroPayload>({
      query: (body) => ({
        url: "/institutions/my-center/",
        method: "PATCH",
        body,
      }),
      invalidatesTags: [MY_CENTER_TAG],
    }),
  }),
})

export const { useGetMyCenterQuery, useUpdateMyCenterMutation } = centersApi
