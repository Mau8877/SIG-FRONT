import { useEffect, useRef } from "react"

import { useAppDispatch } from "@/src/store/hooks"

import { authApi } from "../api/authApi"
import { authInitializing, authSessionCleared, authSessionStarted } from "../store/authSlice"

export function AuthBootstrap() {
  const dispatch = useAppDispatch()
  const bootstrapped = useRef(false)

  useEffect(() => {
    if (bootstrapped.current) {
      return
    }

    bootstrapped.current = true
    void bootstrapSession()

    async function bootstrapSession() {
      dispatch(authInitializing())

      try {
        await dispatch(authApi.endpoints.getCsrf.initiate()).unwrap()

        const user = await dispatch(authApi.endpoints.me.initiate()).unwrap()
        dispatch(authSessionStarted(user))
      } catch {
        try {
          await dispatch(authApi.endpoints.refresh.initiate()).unwrap()
          const user = await dispatch(authApi.endpoints.me.initiate(undefined, { forceRefetch: true })).unwrap()
          dispatch(authSessionStarted(user))
        } catch {
          dispatch(authSessionCleared())
        }
      }
    }
  }, [dispatch])

  return null
}
