import { Outlet } from "@tanstack/react-router"

import { Header } from "./Header"
import { Sidebar } from "./Sidebar"

export function AuthenticatedLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-y-0 left-0 hidden w-64 md:block">
        <Sidebar />
      </div>
      <div className="min-h-screen md:pl-64">
        <Header />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
