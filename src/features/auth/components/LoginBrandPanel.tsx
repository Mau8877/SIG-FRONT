import { Badge } from "@/components/ui/badge"

import { LoginDevicePreview } from "./LoginDevicePreview"

export function LoginBrandPanel() {
  return (
    <section className="relative hidden h-svh overflow-hidden bg-muted px-8 py-8 text-foreground lg:flex lg:flex-col xl:px-12 xl:py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,var(--primary)_0,transparent_24%),radial-gradient(circle_at_78%_78%,var(--success)_0,transparent_22%)] opacity-15" />

      <div className="relative z-10 flex shrink-0 flex-col items-center text-center">
        <Badge className="mb-5 bg-background/70 text-foreground" variant="outline">
          Miraki Seguridad Familiar
        </Badge>
        <h1 className="text-3xl font-semibold leading-tight xl:text-3xl">
          Protege lo que más importa
        </h1>
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center py-8">
        <LoginDevicePreview />
      </div>
    </section>
  )
}
