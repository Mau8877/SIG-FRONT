import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"

import { Sidebar } from "./Sidebar"

type MobileSidebarProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileSidebar({ open, onOpenChange }: MobileSidebarProps) {
  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => onOpenChange(true)}
        aria-label="Abrir menu"
      >
        <Menu />
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-foreground/30"
            aria-label="Cerrar menu"
            onClick={() => onOpenChange(false)}
          />
          <div className="relative h-full w-72 max-w-[85vw]">
            <Sidebar onNavigate={() => onOpenChange(false)} />
          </div>
        </div>
      ) : null}
    </>
  )
}
