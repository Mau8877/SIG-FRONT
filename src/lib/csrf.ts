export function readCookie(name: string) {
  if (typeof document === "undefined") {
    return null
  }

  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${name}=`))

  if (!cookie) {
    return null
  }

  return decodeURIComponent(cookie.split("=").slice(1).join("="))
}

export function getCsrfToken() {
  return readCookie("csrftoken")
}
