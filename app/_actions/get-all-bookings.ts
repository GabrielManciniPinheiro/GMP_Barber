"use server"

import { db } from "@/app/_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/_lib/auth"
import { startOfDay } from "date-fns" // <--- Importante para pegar o começo do dia

export const getDashboardBookings = async () => {
  const session = await getServerSession(authOptions)

  // Se não for admin, retorna vazio
  if ((session?.user as any).role !== "ADMIN") {
    return []
  }

  return await db.booking.findMany({
    where: {
      // Filtra: Data deve ser MAIOR ou IGUAL a hoje (ignora passado)
      date: {
        gte: startOfDay(new Date()),
      },
    },
    orderBy: {
      // Ordena: Do mais PERTO (hoje) para o mais longe (futuro)
      date: "asc",
    },
    include: {
      barbershopService: {
        include: {
          barbershop: true,
        },
      },
      user: true,
    },
  })
}
