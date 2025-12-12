"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Clock, User, MapPin, Search } from "lucide-react"
import BookingDeleteButton from "./booking-delete-button"
import HorizontalScroll from "@/app/_components/ui/horizontal-scroll"
import { Input } from "@/app/_components/ui/input"
import { Button } from "@/app/_components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

// Definindo o tipo dos dados que vamos receber (para o TypeScript não reclamar)
interface DashboardTableProps {
  bookings: any[] // Usando any para simplificar, mas o ideal seria o tipo do Prisma
}

const DashboardTable = ({ bookings }: DashboardTableProps) => {
  const [search, setSearch] = useState("")

  // Lógica de Filtro: Busca por Nome do Cliente OU Nome do Profissional
  const filteredBookings = bookings.filter((booking) => {
    const searchTerm = search.toLowerCase()
    const clientName = booking.user?.name?.toLowerCase() || ""
    const barberName = booking.barbershopService.barbershop.name.toLowerCase()

    return clientName.includes(searchTerm) || barberName.includes(searchTerm)
  })

  // Função de cores (copiada da página anterior)
  const getBarberColor = (name: string) => {
    if (name.includes("Alan")) return "bg-orange-500/20 text-orange-500"
    if (name.includes("Cosme")) return "bg-purple-500/20 text-purple-500"
    if (name.includes("Leo")) return "bg-green-500/20 text-green-500"
    return "bg-gray-500/20 text-gray-500"
  }

  return (
    <div className="space-y-4">
      {/* CAMPO DE BUSCA (FILTRO) */}
      <div className="flex w-full max-w-sm items-center space-x-2 rounded-lg border border-gray-800 bg-[#1A1B1F] px-2">
        <Search className="text-gray-400" size={20} />
        <Input
          placeholder="Filtrar por cliente ou profissional..."
          className="border-none bg-transparent text-sm focus-visible:ring-0"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABELA COM SCROLL */}
      <div className="overflow-hidden rounded-lg border border-gray-800">
        <HorizontalScroll>
          <div className="w-full min-w-[800px] p-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-800 text-xs uppercase text-gray-200">
                <tr>
                  <th className="px-6 py-3">Cliente</th>
                  <th className="px-6 py-3">Profissional</th>
                  <th className="px-6 py-3">Serviço</th>
                  <th className="px-6 py-3">Data e Hora</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 bg-[#1A1B1F]">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Nenhum resultado encontrado para {search}.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="transition-colors hover:bg-gray-800/50"
                    >
                      <td className="px-6 py-4 font-medium">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-primary" />
                          {booking.user?.name || "Cliente sem nome"}
                        </div>
                        <span className="block pl-6 text-xs text-gray-500">
                          {booking.user?.email}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`flex w-fit items-center gap-2 rounded-full px-2 py-1 text-xs font-bold ${getBarberColor(booking.barbershopService.barbershop.name)}`}
                        >
                          <MapPin size={12} />
                          {booking.barbershopService.barbershop.name}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {booking.barbershopService.name}
                        <div className="text-xs text-gray-500">
                          {Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(Number(booking.barbershopService.price))}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <CalendarIcon size={14} className="text-gray-400" />
                          {format(booking.date, "dd 'de' MMMM", {
                            locale: ptBR,
                          })}
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-gray-400">
                          <Clock size={14} />
                          {format(booking.date, "HH:mm")}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-bold ${
                            booking.date < new Date()
                              ? "bg-gray-800 text-gray-400"
                              : "bg-primary/20 text-primary"
                          }`}
                        >
                          {booking.date < new Date()
                            ? "Finalizado"
                            : "Confirmado"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        {booking.date > new Date() && (
                          <BookingDeleteButton bookingId={booking.id} />
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </HorizontalScroll>
      </div>

      {/* BOTÃO VOLTAR (Trouxemos pra cá pra ficar junto da tabela) */}
      <div className="flex w-full justify-center">
        <Button variant="secondary" asChild className="gap-2">
          <Link href="/">
            <ChevronLeft size={18} />
            Voltar ao Início
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default DashboardTable
