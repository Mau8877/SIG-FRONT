import { Button } from "@/components/ui/button"
import { getTotalPages } from "@/src/types/api"

type PaginationControlsProps = {
  currentPage: number
  count: number
  hasNext: boolean
  hasPrevious: boolean
  onNext: () => void
  onPrevious: () => void
}

export function PaginationControls({
  currentPage,
  count,
  hasNext,
  hasPrevious,
  onNext,
  onPrevious,
}: PaginationControlsProps) {
  const totalPages = getTotalPages(count)

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm text-card-foreground sm:flex-row sm:items-center sm:justify-between">
      <p className="text-center text-muted-foreground sm:text-left">
        {count} registros · Pagina {currentPage} de {totalPages}
      </p>
      <div className="flex items-center justify-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={!hasPrevious || currentPage <= 1}
        >
          Anterior
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={!hasNext || currentPage >= totalPages}
        >
          Siguiente
        </Button>
      </div>
    </div>
  )
}
