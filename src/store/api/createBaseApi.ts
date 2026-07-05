import { fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export type ApiConfig = {
  baseUrl: string
  timeout?: number
}

export function createBaseApi({ baseUrl, timeout }: ApiConfig) {
  return fetchBaseQuery({
    baseUrl,
    timeout,
    credentials: "include",
  })
}
