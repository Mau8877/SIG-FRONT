import { createFileRoute } from "@tanstack/react-router"

import { ZonaViewScreen } from "@/src/features/zones"

export const Route = createFileRoute("/_authenticated/zones/$id")({
  component: ZonaViewScreen,
})
