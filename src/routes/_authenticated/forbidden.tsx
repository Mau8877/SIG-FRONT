import { createFileRoute } from "@tanstack/react-router"

import { ForbiddenScreen } from "@/src/features/auth"

export const Route = createFileRoute("/_authenticated/forbidden")({
  component: ForbiddenScreen,
})
