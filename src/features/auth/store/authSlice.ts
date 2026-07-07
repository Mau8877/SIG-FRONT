import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import type { AuthStatus, AuthUser } from "../types"

type AuthState = {
  user: AuthUser | null
  status: AuthStatus
}

const initialState: AuthState = {
  user: null,
  status: "initializing",
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authSessionStarted(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload
      state.status = "authenticated"
    },
    authSessionCleared(state) {
      state.user = null
      state.status = "unauthenticated"
    },
    authInitializing(state) {
      state.status = "initializing"
    },
  },
})

export const { authInitializing, authSessionStarted, authSessionCleared } =
  authSlice.actions

export const authReducer = authSlice.reducer
