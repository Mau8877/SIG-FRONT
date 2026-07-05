import { combineReducers } from "@reduxjs/toolkit"

import { appApi } from "./api"

export const rootReducer = combineReducers({
  [appApi.reducerPath]: appApi.reducer,
})
