import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react"

import { authSessionCleared } from "@/src/features/auth/store/authSlice"
import { getCsrfToken } from "@/src/lib/csrf"

export type ApiConfig = {
  baseUrl: string
  timeout?: number
}

export function createBaseApi({ baseUrl, timeout }: ApiConfig) {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl,
    timeout,
    credentials: "include",
  })

  const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
  > = async (args, api, extraOptions) => {
    const requestArgs = withCsrfHeader(args)
    let result = await rawBaseQuery(requestArgs, api, extraOptions)

    if (result.error?.status !== 401 || shouldSkipRefresh(args)) {
      return result
    }

    const refreshResult = await refreshSession(rawBaseQuery, api, extraOptions)

    if (!refreshResult.ok) {
      api.dispatch(authSessionCleared())
      return result
    }

    result = await rawBaseQuery(requestArgs, api, extraOptions)
    return result
  }

  return baseQueryWithReauth
}

let refreshPromise: Promise<boolean> | null = null

async function refreshSession(
  rawBaseQuery: ReturnType<typeof fetchBaseQuery>,
  api: Parameters<BaseQueryFn>[1],
  extraOptions: Parameters<BaseQueryFn>[2],
) {
  if (!refreshPromise) {
    refreshPromise = Promise.resolve(rawBaseQuery(
      withCsrfHeader({
        url: "/auth/refresh/",
        method: "POST",
      }),
      api,
      extraOptions,
    ))
      .then((result) => !result.error)
      .finally(() => {
        refreshPromise = null
      })
  }

  return { ok: await refreshPromise }
}

function withCsrfHeader(args: string | FetchArgs): string | FetchArgs {
  if (typeof args === "string" || !isMutableMethod(args.method)) {
    return args
  }

  const csrfToken = getCsrfToken()

  if (!csrfToken) {
    return args
  }

  const headers = new Headers(args.headers as HeadersInit | undefined)
  headers.set("X-CSRFToken", csrfToken)

  return {
    ...args,
    headers,
  }
}

function isMutableMethod(method?: string) {
  return ["POST", "PATCH", "PUT", "DELETE"].includes(
    method?.toUpperCase() ?? "GET",
  )
}

function shouldSkipRefresh(args: string | FetchArgs) {
  const url = typeof args === "string" ? args : args.url

  return [
    "/auth/csrf/",
    "/auth/login/",
    "/auth/logout/",
    "/auth/me/",
    "/auth/refresh/",
    "/auth/register/",
  ].some((path) => url.includes(path))
}
