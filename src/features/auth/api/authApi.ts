import { appApi } from "@/src/store/api"

import type { AuthUser, LoginRequest, LoginResponse, RegisterRequest } from "../types"

export const authApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getCsrf: builder.query<{ detail?: string }, void>({
      query: () => "/auth/csrf/",
    }),
    register: builder.mutation<unknown, RegisterRequest>({
      query: (body) => ({
        url: "/auth/register/",
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login/",
        method: "POST",
        body,
      }),
    }),
    me: builder.query<AuthUser, void>({
      query: () => "/auth/me/",
    }),
    refresh: builder.mutation<unknown, void>({
      query: () => ({
        url: "/auth/refresh/",
        method: "POST",
      }),
    }),
    logout: builder.mutation<unknown, void>({
      query: () => ({
        url: "/auth/logout/",
        method: "POST",
      }),
    }),
  }),
})

export const {
  useGetCsrfQuery,
  useLazyMeQuery,
  useLoginMutation,
  useLogoutMutation,
  useRefreshMutation,
  useRegisterMutation,
} = authApi
