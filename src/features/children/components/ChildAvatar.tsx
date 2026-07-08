import { useState } from "react"
import { UserRound } from "lucide-react"

import { cn } from "@/lib/utils"

type ChildAvatarProps = {
  name: string
  photoUrl?: string | null
  className?: string
}

export function ChildAvatar({ name, photoUrl, className }: ChildAvatarProps) {
  const [imageError, setImageError] = useState(false)
  const showImage = Boolean(photoUrl && !imageError)

  return (
    <div
      className={cn(
        "flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted text-sm font-medium text-muted-foreground",
        className,
      )}
    >
      {showImage ? (
        <img
          src={photoUrl ?? undefined}
          alt={`Foto de ${name}`}
          className="size-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : name.trim() ? (
        <span>{name.trim().slice(0, 1).toUpperCase()}</span>
      ) : (
        <UserRound className="size-5" aria-hidden="true" />
      )}
    </div>
  )
}
