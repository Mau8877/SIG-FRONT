import * as React from "react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./button"

type DialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

function Dialog({ open, children }: DialogProps) {
  if (!open) {
    return null
  }

  return <>{children}</>
}

function DialogContent({
  className,
  children,
  onClose,
  ...props
}: React.ComponentProps<"div"> & { onClose?: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 p-4">
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative max-h-[90svh] w-full max-w-lg overflow-auto rounded-lg border border-border bg-card p-6 text-card-foreground shadow-lg",
          className,
        )}
        {...props}
      >
        {onClose ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="absolute right-3 top-3"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X />
          </Button>
        ) : null}
        {children}
      </div>
    </div>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mb-4 flex flex-col gap-1.5", className)} {...props} />
}

function DialogTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 className={cn("text-lg font-semibold", className)} {...props} />
}

function DialogDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  )
}

export { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle }
