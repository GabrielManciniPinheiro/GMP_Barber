import { getDashboardBookings } from "@/app/_actions/get-all-bookings"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Button } from "@/app/_components/ui/button"
import {
  CalendarIcon,
  Clock,
  User,
  LayoutDashboard,
  MapPin,
} from "lucide-react"
import Link from "next/link"
import BookingDeleteButton from "./_components/booking-delete-button"
import HorizontalScroll from "@/app/_components/ui/horizontal-scroll"

export default async function DashboardPage() {
  const bookings = await getDashboardBookings()

  // Funçãozinha auxiliar para escolher a cor do crachá
  const getBarberColor = (name: string) => {
    if (name.includes("Alan")) return "bg-orange-500/20 text-orange-500"
    if (name.includes("Cosme")) return "bg-purple-500/20 text-purple-500"
    if (name.includes("Léo")) return "bg-green-500/20 text-green-500"
    return "bg-gray-500/20 text-gray-500" // Cor padrão caso entre um novo barbeiro
  }

  return (
    <div className="space-y-6 p-5 md:p-10">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <LayoutDashboard /> Painel de Controle
          </h1>
          <p className="text-gray-400">
            Gerencie os agendamentos da barbearia.
          </p>
        </div>

        <Button asChild className="w-full md:w-auto">
          <Link href="/">Bloquear Horário (Novo Agendamento)</Link>
        </Button>
      </div>

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
                {bookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Nenhum agendamento encontrado.
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="transition-colors hover:bg-gray-800/50"
                    >
                      {/* Cliente */}
                      <td className="px-6 py-4 font-medium">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-primary" />
                          {booking.user?.name || "Cliente sem nome"}
                        </div>
                        <span className="block pl-6 text-xs text-gray-500">
                          {booking.user?.email}
                        </span>
                      </td>

                      {/* Profissional (AGORA COLORIDO! 🎨) */}
                      <td className="px-6 py-4">
                        <span
                          className={`flex w-fit items-center gap-2 rounded-full px-2 py-1 text-xs font-bold ${getBarberColor(booking.barbershopService.barbershop.name)}`}
                        >
                          <MapPin size={12} />
                          {booking.barbershopService.barbershop.name}
                        </span>
                      </td>

                      {/* Serviço */}
                      <td className="px-6 py-4">
                        {booking.barbershopService.name}
                        <div className="text-xs text-gray-500">
                          {Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(Number(booking.barbershopService.price))}
                        </div>
                      </td>

                      {/* Data */}
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

                      {/* Status */}
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

                      {/* Ações */}
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

      {/* BOTÃO DE VOLTAR AO MENU (NOVO!) */}
      <div className="flex w-full justify-center">
        <Button variant="secondary" asChild className="gap-2">
          <Link href="/">Voltar ao Menu</Link>
        </Button>
      </div>
    </div>
  )
}
