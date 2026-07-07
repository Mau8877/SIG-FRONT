import { NAVIGATION_ITEMS } from "./navigation"
import { type UserRole } from "./roles"

export function hasRole(role: UserRole | undefined, allowedRoles: UserRole[]) {
  return Boolean(role && allowedRoles.includes(role))
}

export function canAccessRoute(role: UserRole | undefined, route: string) {
  const item = NAVIGATION_ITEMS.find((navigationItem) => navigationItem.route === route)

  if (!item) {
    return true
  }

  return hasRole(role, item.allowedRoles)
}
