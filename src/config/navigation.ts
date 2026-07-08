import {
  Baby,
  ClipboardList,
  LayoutDashboard,
  LogIn,
  MapPin,
  School,
  type LucideIcon,
} from "lucide-react"

import { USER_ROLES, type UserRole } from "./roles"

export type NavigationItem = {
  label: string
  route: string
  icon: LucideIcon
  allowedRoles: UserRole[]
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    label: "Dashboard",
    route: "/dashboard",
    icon: LayoutDashboard,
    allowedRoles: [
      USER_ROLES.TUTOR,
      USER_ROLES.ADMIN_CENTRO,
      USER_ROLES.SUPER_ADMIN,
    ],
  },
  {
    label: "Mis Ninos",
    route: "/children",
    icon: Baby,
    allowedRoles: [USER_ROLES.TUTOR],
  },
  {
    label: "Ninos del Centro",
    route: "/center-children",
    icon: School,
    allowedRoles: [USER_ROLES.ADMIN_CENTRO],
  },
  {
    label: "Zonas Seguras",
    route: "/zones",
    icon: MapPin,
    allowedRoles: [
      USER_ROLES.TUTOR,
      USER_ROLES.ADMIN_CENTRO,
    ],
  },
  {
    label: "Bitacora General",
    route: "/audit",
    icon: ClipboardList,
    allowedRoles: [USER_ROLES.SUPER_ADMIN],
  },
  {
    label: "Bitacora Accesos",
    route: "/access-audit",
    icon: LogIn,
    allowedRoles: [USER_ROLES.SUPER_ADMIN],
  },
]
