import { Link, useRouterState } from "@tanstack/react-router"

import { NAVIGATION_ITEMS } from "@/src/config/navigation"
import { hasRole } from "@/src/config/permissions"
import { selectAuthRole } from "@/src/features/auth"
import { useAppSelector } from "@/src/store/hooks"
import { cn } from "@/lib/utils"

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const role = useAppSelector(selectAuthRole)
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const items = NAVIGATION_ITEMS.filter((item) => hasRole(role, item.allowedRoles))

  return (
    <aside className="flex h-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="border-b border-sidebar-border px-5 py-5">
        <p className="text-lg font-semibold">Miraki</p>
        <p className="text-xs text-muted-foreground">Panel de gestion</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {items.map((item) => {
          const Icon = item.icon
          const active = pathname === item.route

          return (
            <Link
              key={item.route}
              to={item.route}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                active && "bg-sidebar-primary text-sidebar-primary-foreground",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
