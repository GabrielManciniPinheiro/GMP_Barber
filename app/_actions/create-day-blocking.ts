"use server"

import { db } from "@/app/_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/_lib/auth"
import { revalidatePath } from "next/cache"
import { set } from "date-fns"

// Horários para preencher a agenda
const TIME_LIST = [
  "09:00",
  "09:45",
  "10:30",
  "11:15",
  "12:00",
  "12:45",
  "13:30",
  "14:15",
  "15:00",
  "15:45",
  "16:30",
  "17:15",
  "18:00",
  "18:45",
  "19:30",
]

interface BlockDayParams {
  barbershopId: string
  date: Date
  serviceId: string
}

export const createDayBlocking = async ({
  barbershopId,
  date,
  serviceId,
}: BlockDayParams) => {
  const session = await getServerSession(authOptions)

  if ((session?.user as any).role !== "ADMIN") {
    throw new Error("Não autorizado")
  }

  const adminUserId = (session?.user as any).id

  // 1. Gera os horários
  const bookingsToCreate = TIME_LIST.map((time) => {
    const [hour, minute] = time.split(":").map(Number)

    // Ajusta a data para o horário específico
    const bookingDate = set(date, {
      hours: hour,
      minutes: minute,
      seconds: 0,
      milliseconds: 0,
    })

    return {
      date: bookingDate,
      barbershopServiceId: serviceId, // Obrigatório
      userId: adminUserId, // Obrigatório
      // REMOVI O 'barbershopId' DAQUI POIS PROVAVELMENTE NÃO EXISTE NA TABELA BOOKING
    }
  })

  // 2. Verifica conflitos (opcional, mas bom pra evitar erro de chave duplicada se houver)
  // Vamos simplificar: Tenta buscar o que já existe nesse dia/barbearia
  const existingBookings = await db.booking.findMany({
    where: {
      date: {
        gte: set(date, { hours: 0, minutes: 0 }),
        lte: set(date, { hours: 23, minutes: 59 }),
      },
      // Filtra bookings desta barbearia através do serviço
      barbershopService: {
        barbershopId: barbershopId,
      },
    },
  })

  // 3. Filtra: Só cria o que estiver livre
  const finalBookings = bookingsToCreate.filter((newBooking) => {
    return !existingBookings.some(
      (existing) => existing.date.getTime() === newBooking.date.getTime(),
    )
  })

  if (finalBookings.length === 0) {
    // Se não tem nada pra criar (dia cheio), retorna sucesso falso mas sem quebrar
    return { success: false }
  }

  // 4. Cria tudo de uma vez
  await db.booking.createMany({
    data: finalBookings,
  })

  revalidatePath("/dashboard")
  revalidatePath("/")

  return { success: true }
}
