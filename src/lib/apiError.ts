export function getApiErrorMessage(error: unknown, fallback = "Ocurrio un error inesperado.") {
  if (!error) {
    return fallback
  }

  if (typeof error === "object" && "data" in error) {
    return normalizeErrorData(error.data, fallback)
  }

  if (typeof error === "object" && "message" in error && typeof error.message === "string") {
    return error.message
  }

  return fallback
}

export function normalizeErrorData(data: unknown, fallback = "Ocurrio un error inesperado.") {
  if (!data) {
    return fallback
  }

  if (typeof data === "string") {
    return data
  }

  if (Array.isArray(data)) {
    return data.map(String).join(" ")
  }

  if (typeof data === "object") {
    const record = data as Record<string, unknown>

    if (typeof record.detail === "string") {
      return record.detail
    }

    const fieldMessages = Object.entries(record)
      .map(([field, value]) => `${field}: ${formatFieldError(value)}`)
      .filter(Boolean)

    if (fieldMessages.length > 0) {
      return fieldMessages.join(" ")
    }
  }

  return fallback
}

function formatFieldError(value: unknown) {
  if (Array.isArray(value)) {
    return value.map(String).join(", ")
  }

  if (typeof value === "string") {
    return value
  }

  return JSON.stringify(value)
}
