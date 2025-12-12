"use client"

import { Button } from "@/app/_components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/app/_components/ui/dialog"
import SignInDialog from "@/app/_components/sign-in-dialog" // <--- SEU COMPONENTE AQUI
import { LogInIcon } from "lucide-react"

const AuthFallback = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-5 py-12 text-center">
      <div className="mb-2 rounded-full bg-gray-100 p-4">
        <LogInIcon className="h-8 w-8 text-gray-400" />
      </div>

      <h2 className="text-lg font-bold">Acesso Restrito</h2>
      <p className="mb-4 max-w-[300px] text-sm text-gray-400">
        Para ver seus agendamentos e gerenciar suas reservas, você precisa
        entrar na sua conta.
      </p>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full max-w-[200px] gap-2 font-bold">
            <LogInIcon size={18} />
            Entrar com Google
          </Button>
        </DialogTrigger>

        <DialogContent className="w-[90%] rounded-xl">
          {/* componente do login */}
          <SignInDialog />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AuthFallback
