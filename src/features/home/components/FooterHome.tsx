import { Separator } from "@/components/ui/separator"

export function FooterHome() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-background">
      <Separator />
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p className="font-heading text-base font-bold text-foreground">
            SIG
          </p>
          <p className="mt-1">
            Plataforma de monitoreo geografico para seguridad familiar.
          </p>
        </div>
        <p>(c) {currentYear} SIG. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}
