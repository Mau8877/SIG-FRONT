export function FullPageLoading({ label }: { label: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <div className="rounded-lg border border-border bg-card px-6 py-5 text-center shadow-sm">
        <div className="mx-auto mb-3 size-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}
