import { appApi } from "@/src/store/api"

import type { InstitutionMapData } from "../types"

export const institutionMapApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getInstitutionMap: builder.query<InstitutionMapData, void>({
      query: () => "/institutions/map/",
    }),
  }),
})

export const { useGetInstitutionMapQuery } = institutionMapApi
