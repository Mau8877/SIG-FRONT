import { createFileRoute } from "@tanstack/react-router"

import { ZonasScreen } from "@/src/features/zones"

export const Route = createFileRoute("/_authenticated/zones/")({
  component: ZonasScreen,
})
