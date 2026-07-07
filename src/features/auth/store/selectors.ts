import type { RootState } from "@/src/store"

export const selectAuthUser = (state: RootState) => state.auth.user
export const selectAuthStatus = (state: RootState) => state.auth.status
export const selectAuthRole = (state: RootState) => state.auth.user?.rol
