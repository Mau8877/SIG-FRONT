import { createApi } from "@reduxjs/toolkit/query/react"

import { createBaseApi } from "./createBaseApi"

export const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: createBaseApi({
    baseUrl: import.meta.env.VITE_API_URL,
    timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 60000,
  }),
  endpoints: () => ({}),
})
