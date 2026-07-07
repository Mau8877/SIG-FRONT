import { createApi } from "@reduxjs/toolkit/query/react"

import { createBaseApi } from "./createBaseApi"

export const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: createBaseApi({
    baseUrl: import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1",
    timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 60000,
  }),
  tagTypes: ["Nino", "Audit", "AccessAudit"],
  endpoints: () => ({}),
})
