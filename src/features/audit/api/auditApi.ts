import { appApi } from "@/src/store/api"
import type { PaginatedResponse } from "@/src/types/api"

import type { AccessAuditEntry, AuditEntry } from "../types"

type AuditListParams = {
  page?: number
}

export const auditApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getGeneralAudit: builder.query<PaginatedResponse<AuditEntry>, AuditListParams | void>({
      query: (params) => ({
        url: "/audit/bitacora/",
        params: {
          page: params?.page ?? 1,
        },
      }),
      providesTags: [{ type: "Audit", id: "LIST" }],
    }),
    getAccessAudit: builder.query<PaginatedResponse<AccessAuditEntry>, AuditListParams | void>({
      query: (params) => ({
        url: "/accounts/bitacora-accesos/",
        params: {
          page: params?.page ?? 1,
        },
      }),
      providesTags: [{ type: "AccessAudit", id: "LIST" }],
    }),
  }),
})

export const { useGetAccessAuditQuery, useGetGeneralAuditQuery } = auditApi
