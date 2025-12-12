"use client"

import { Prisma } from "@prisma/client"
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"
import { format, isFuture, isPast } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"
import Image from "next/image"
import PhoneItem from "./phone-item"
import { Button } from "./ui/button"
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
} from "./ui/alert-dialog"
import { deleteBooking } from "../_actions/delete-booking"
import { toast } from "sonner"
import { useState } from "react"
import { Loader2 } from "lucide-react"

interface BookingItemProps {
  booking: Prisma.BookingGetPayload<{
    include: {
      barbershopService: {
        include: {
          barbershop: true
        }
      }
    }
  }>
}

const BookingItem = ({ booking }: BookingItemProps) => {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)

  // Variáveis de estado do tempo
  const isBookingFinished = isPast(booking.date)
  const isBookingFuture = isFuture(booking.date)

  // --- REGRA DE NEGÓCIO: 2 HORAS ---
  // Calcula a diferença em horas entre o agendamento e o momento atual
  const timeDifferenceInHours =
    (booking.date.getTime() - new Date().getTime()) / (1000 * 60 * 60)

  // Só permite cancelar se:
  // 1. O agendamento for no futuro
  // 2. A diferença for maior que 2 horas
  const canCancel = isBookingFuture && timeDifferenceInHours > 2

  const handleCancelClick = async () => {
    try {
      setIsDeleteLoading(true)
      await deleteBooking(booking.id)
      toast.success("Reserva cancelada com sucesso!")
    } catch (error) {
      console.error(error)
      toast.error("Erro ao cancelar reserva.")
    } finally {
      setIsDeleteLoading(false)
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        {/* CARD DO AGENDAMENTO (VISUAL PRINCIPAL) */}
        <Card className="min-w-full cursor-pointer rounded-xl border-none bg-[#1A1B1F] shadow-sm transition-colors hover:bg-[#2A2B2F]">
          <CardContent className="flex justify-between px-0 py-0">
            {/* ESQUERDA - INFO DO SERVIÇO */}
            <div className="flex flex-col gap-2 py-5 pl-5">
              <Badge
                className="w-fit"
                variant={isBookingFinished ? "secondary" : "default"}
              >
                {isBookingFinished ? "Finalizado" : "Confirmado"}
              </Badge>
              <h3 className="font-semibold">
                {booking.barbershopService.name}
              </h3>

              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={booking.barbershopService.barbershop.imageURL}
                  />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <span className="text-sm">
                  {booking.barbershopService.barbershop.name}
                </span>
              </div>
            </div>

            {/* DIREITA - DATA (BORDA ESQUERDA SEPARANDO) */}
            <div className="flex w-[100px] flex-col items-center justify-center border-l border-solid border-secondary px-5">
              <p className="text-sm capitalize">
                {format(booking.date, "MMMM", { locale: ptBR })}
              </p>
              <p className="text-2xl font-bold">{format(booking.date, "dd")}</p>
              <p className="text-sm">{format(booking.date, "HH:mm")}</p>
            </div>
          </CardContent>
        </Card>
      </SheetTrigger>

      {/* CONTEÚDO DO SHEET (DETALHES AO CLICAR) */}
      <SheetContent className="w-[85%] overflow-y-auto rounded-xl">
        <SheetHeader>
          <SheetTitle className="text-left">Informações da Reserva</SheetTitle>
        </SheetHeader>

        {/* MAPA ESTÁTICO */}
        <div className="relative mt-6 flex h-[180px] w-full items-end rounded-xl px-4 pb-4">
          <Image
            alt={`Mapa da barbearia ${booking.barbershopService.barbershop.name}`}
            src="/map.png" // Certifique-se que essa imagem existe na pasta public
            fill
            className="rounded-xl object-cover"
          />

          <div className="absolute inset-0 rounded-xl bg-black/40" />

          <Card className="z-10 mx-auto w-full rounded-xl">
            <CardContent className="flex items-center gap-3 px-5 py-3">
              <Avatar>
                <AvatarImage
                  src={booking.barbershopService.barbershop.imageURL}
                />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold">
                  {booking.barbershopService.barbershop.name}
                </h3>
                <p className="max-w-[180px] truncate text-xs text-gray-400">
                  {booking.barbershopService.barbershop.address}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Badge
            className="w-fit"
            variant={isBookingFinished ? "secondary" : "default"}
          >
            {isBookingFinished ? "Finalizado" : "Confirmado"}
          </Badge>

          {/* RESUMO DE VALORES E DATAS */}
          <Card className="mb-6 mt-3">
            <CardContent className="space-y-3 p-3">
              <div className="flex items-center justify-between">
                <h2 className="font-bold">{booking.barbershopService.name}</h2>
                <h3 className="text-sm font-bold">
                  {Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(booking.barbershopService.price))}
                </h3>
              </div>

              <div className="flex items-center justify-between">
                <h2 className="text-sm text-gray-400">Data</h2>
                <h3 className="text-sm">
                  {format(booking.date, "d 'de' MMMM", {
                    locale: ptBR,
                  })}
                </h3>
              </div>

              <div className="flex items-center justify-between">
                <h2 className="text-sm text-gray-400">Horário</h2>
                <h3 className="text-sm">{format(booking.date, "HH:mm")}</h3>
              </div>

              <div className="flex items-center justify-between">
                <h2 className="text-sm text-gray-400">Barbearia</h2>
                <h3 className="text-sm">
                  {booking.barbershopService.barbershop.name}
                </h3>
              </div>
            </CardContent>
          </Card>

          {/* TELEFONES */}
          <div className="space-y-3">
            {booking.barbershopService.barbershop.phones.map((phone, index) => (
              <PhoneItem key={index} phone={phone} />
            ))}
          </div>
        </div>

        {/* RODAPÉ COM AÇÕES */}
        <SheetFooter className="mt-6 pb-6">
          <div className="flex w-full items-center gap-3">
            <SheetClose asChild>
              <Button variant="secondary" className="w-full">
                Voltar
              </Button>
            </SheetClose>

            {/* BOTÃO CANCELAR COM LÓGICA DE 2 HORAS */}
            {!isBookingFinished && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    disabled={!canCancel || isDeleteLoading} // Trava se faltar < 2h
                    className="w-full"
                    variant="destructive"
                  >
                    {isDeleteLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}

                    {/* Texto Muda se estiver bloqueado */}
                    {!canCancel && isBookingFuture
                      ? "Cancelar Reserva"
                      : "Cancelar Reserva"}
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent className="w-[90%]">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancelar Reserva?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja cancelar sua reserva? Essa ação não
                      pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex-row gap-3">
                    <AlertDialogCancel className="mt-0 w-full">
                      Voltar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      disabled={isDeleteLoading}
                      className="w-full bg-red-500 hover:bg-red-600"
                      onClick={handleCancelClick}
                    >
                      {isDeleteLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Confirmar"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          {/* AVISO EM VERMELHO PARA O USUÁRIO ENTENDER O BLOQUEIO */}
          {!canCancel && isBookingFuture && (
            <p className="mb-4 mt-1 text-center text-xs text-red-400">
              *Cancelamento disponível apenas com 2 horas de antecedência.
            </p>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default BookingItem
