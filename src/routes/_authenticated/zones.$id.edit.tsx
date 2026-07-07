import { createFileRoute } from "@tanstack/react-router"

import { ZonaEditScreen } from "@/src/features/zones"

export const Route = createFileRoute("/_authenticated/zones/$id/edit")({
  component: ZonaEditScreen,
})
