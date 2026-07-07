// Mirrors the current Django REST Framework PAGE_SIZE configured by the backend.
export const API_PAGE_SIZE = 20

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export type PaginationQueryParams = {
  page?: number
}

export function getTotalPages(count: number) {
  return Math.max(1, Math.ceil(count / API_PAGE_SIZE))
}
