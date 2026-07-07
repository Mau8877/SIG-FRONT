import { combineReducers } from "@reduxjs/toolkit"

import { authReducer } from "@/src/features/auth/store/authSlice"

import { appApi } from "./api"

export const rootReducer = combineReducers({
  auth: authReducer,
  [appApi.reducerPath]: appApi.reducer,
})
