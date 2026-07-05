import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import {
  createRouter,
  RouterProvider,
} from "@tanstack/react-router"

import "./index.css"
import { routeTree } from "./routeTree.gen"
import { store } from "./store/store"

const router = createRouter({
  routeTree,
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById("root")

if (!rootElement) {
  throw new Error("Root element not found")
}

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
