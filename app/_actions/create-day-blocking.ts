"use server"

import { db } from "@/app/_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/_lib/auth"
import { revalidatePath } from "next/cache"
import { set, addHours } from "date-fns" // <--- IMPORTANTE: addHours

// Lista de horários da barbearia
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

  // 1. Gera os horários com CORREÇÃO DE FUSO
  const bookingsToCreate = TIME_LIST.map((time) => {
    const [hour, minute] = time.split(":").map(Number)

    // Cria a data base com o horário da lista
    let bookingDate = set(date, {
      hours: hour,
      minutes: minute,
      seconds: 0,
      milliseconds: 0,
    })

    // --- A MÁGICA DO FUSO HORÁRIO ---
    // O servidor da Vercel roda em UTC (offset 0). O Brasil é -3 (offset 180).
    // Se o offset for 0, somamos 3 horas.
    // Resultado: Salvamos 12:00 UTC -> No Brasil aparece 09:00.
    const serverOffset = new Date().getTimezoneOffset()
    if (serverOffset === 0) {
      bookingDate = addHours(bookingDate, 3)
    }
    // --------------------------------

    return {
      date: bookingDate,
      barbershopServiceId: serviceId,
      userId: adminUserId,
    }
  })

  // 2. Verifica conflitos (opcional, mas seguro)
  const existingBookings = await db.booking.findMany({
    where: {
      date: {
        gte: set(date, { hours: 0, minutes: 0 }),
        lte: set(date, { hours: 23, minutes: 59 }),
      },
      barbershopService: {
        barbershopId: barbershopId,
      },
    },
  })

  // 3. Filtra apenas os livres
  const finalBookings = bookingsToCreate.filter((newBooking) => {
    // Compara ignorando milissegundos
    return !existingBookings.some(
      (existing) =>
        Math.abs(existing.date.getTime() - newBooking.date.getTime()) <
        5 * 60 * 1000,
    )
  })

  if (finalBookings.length === 0) {
    return { success: false }
  }

  // 4. Salva no banco
  await db.booking.createMany({
    data: finalBookings,
  })

  revalidatePath("/dashboard")
  revalidatePath("/")

  return { success: true }
}
