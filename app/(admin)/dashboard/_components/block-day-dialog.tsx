"use client"

import { Button } from "@/app/_components/ui/button"
import { Calendar } from "@/app/_components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select"
import { useState } from "react"
import { ptBR } from "date-fns/locale"
import { createDayBlocking } from "@/app/_actions/create-day-blocking"
import { toast } from "sonner"
import { Barbershop, BarbershopService } from "@prisma/client"
import { Loader2, Ban } from "lucide-react"

// Tipagem auxiliar
interface BarbershopWithServices extends Barbershop {
  services: BarbershopService[]
}

interface BlockDayDialogProps {
  barbershops: BarbershopWithServices[]
}

const BlockDayDialog = ({ barbershops }: BlockDayDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedBarbershopId, setSelectedBarbershopId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const handleBlockDay = async () => {
    if (!selectedDate || !selectedBarbershopId) return

    try {
      setIsLoading(true)

      // Pega um serviço qualquer do barbeiro para vincular o bloqueio
      const barber = barbershops.find((b) => b.id === selectedBarbershopId)
      const serviceId = barber?.services[0]?.id

      if (!serviceId) {
        toast.error("Erro: Barbeiro sem serviços.")
        return
      }

      await createDayBlocking({
        barbershopId: selectedBarbershopId,
        date: selectedDate,
        serviceId: serviceId,
      })

      toast.success("Dia bloqueado com sucesso!")
      setIsOpen(false)
    } catch (error) {
      console.error(error)
      toast.error("Erro ao bloquear dia.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          className="w-full gap-2 font-bold md:w-auto"
        >
          <Ban size={18} />
          Bloquear Dia
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[90%] rounded-xl">
        <DialogHeader>
          <DialogTitle>Bloquear Agenda (Dia Inteiro)</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="rounded bg-red-50 p-2 text-xs text-red-500">
            Isso criará agendamentos em todos os horários livres deste dia.
          </p>

          {/* Seletor de Barbeiro */}
          <div className="space-y-2">
            <label className="text-sm font-bold">Profissional:</label>
            <Select onValueChange={setSelectedBarbershopId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {barbershops.map((barber) => (
                  <SelectItem key={barber.id} value={barber.id}>
                    {barber.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Calendário */}
          <div className="space-y-2">
            <label className="text-sm font-bold">Data:</label>
            <div className="flex justify-center rounded-md border p-2">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={ptBR}
                disabled={{ before: new Date() }}
              />
            </div>
          </div>

          <Button
            onClick={handleBlockDay}
            disabled={!selectedDate || !selectedBarbershopId || isLoading}
            className="mt-4 w-full bg-red-600 font-bold hover:bg-red-700"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Confirmar Bloqueio"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default BlockDayDialog
