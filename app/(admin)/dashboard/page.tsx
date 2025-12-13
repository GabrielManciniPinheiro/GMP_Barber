import { getDashboardBookings } from "@/app/_actions/get-all-bookings" // Importe do SEU arquivo
import { db } from "@/app/_lib/prisma"
import { LayoutDashboard } from "lucide-react"
import DashboardTable from "./_components/dashboard-table"
import BlockDayDialog from "./_components/block-day-dialog"

export default async function DashboardPage() {
  // 1. Busca os agendamentos (Agora vem ordenado por data ASC)
  const bookings = await getDashboardBookings()

  // 2. Busca as barbearias (Para preencher o botão de bloquear)
  const barbershops = await db.barbershop.findMany({
    include: {
      services: true,
    },
  })

  return (
    <div className="space-y-6 p-5 pb-20 md:p-10">
      {/* CABEÇALHO */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <LayoutDashboard /> Painel de Controle
          </h1>
          <p className="text-gray-400">
            Gerencie os agendamentos da barbearia.
          </p>
        </div>

        {/* BOTÃO DE BLOQUEIO DE DIA */}
        <BlockDayDialog barbershops={barbershops} />
      </div>

      {/* TABELA DE DADOS */}
      <DashboardTable bookings={bookings} />
    </div>
  )
}
