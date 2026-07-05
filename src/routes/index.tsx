import { createFileRoute } from "@tanstack/react-router"
import { HomeScreen } from "@/src/features/home"

export const Route = createFileRoute("/")({
  component: HomeScreen,
})
