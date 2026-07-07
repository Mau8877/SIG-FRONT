import { createFileRoute } from "@tanstack/react-router"

import { ZonaCreateScreen } from "@/src/features/zones"

export const Route = createFileRoute("/_authenticated/zones/create")({
  component: ZonaCreateScreen,
})
