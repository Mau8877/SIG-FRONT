import { Button } from "@/components/ui/button"

function App() {
  return (
    <main className="min-h-screen bg-teal-400 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-white">
          SIG Front
        </h1>

        <p className="mt-3 text-lime-400">
          Si ves estilos, bordes, colores y el botón correctamente, Tailwind y
          shadcn están funcionando.
        </p>

        <div className="mt-6 flex gap-3">
          <Button>
            Botón shadcn
          </Button>

          <Button variant="outline">
            Secundario
          </Button>
        </div>
      </div>
    </main>
  )
}

export default App