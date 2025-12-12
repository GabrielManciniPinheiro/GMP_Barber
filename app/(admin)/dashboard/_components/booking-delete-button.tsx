"use client"

import { Button } from "@/app/_components/ui/button"
import { Trash2, Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/_components/ui/alert-dialog"
import { adminCancelBooking } from "@/app/_actions/admin-cancel-booking"
import { toast } from "sonner"
import { useState } from "react"

interface BookingDeleteButtonProps {
  bookingId: string
}

const BookingDeleteButton = ({ bookingId }: BookingDeleteButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    try {
      setIsLoading(true)
      await adminCancelBooking(bookingId)
      toast.success("Agendamento cancelado com sucesso!")
    } catch (error) {
      console.error(error)
      toast.error("Erro ao cancelar.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" className="h-8 w-8 p-0">
          <Trash2 size={16} />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancelar este agendamento?</AlertDialogTitle>
          <AlertDialogDescription>
            Como administrador, você está removendo este horário da agenda. O
            cliente não será notificado automaticamente (ainda).
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Voltar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Confirmar Cancelamento"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default BookingDeleteButton
