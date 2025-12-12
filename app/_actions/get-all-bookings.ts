"use server"

import { db } from "@/app/_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/_lib/auth"

export const getDashboardBookings = async () => {
  const session = await getServerSession(authOptions)

  if ((session?.user as any).role !== "ADMIN") {
    return []
  }

  return await db.booking.findMany({
    orderBy: {
      date: "desc",
    },
    include: {
      // MUDANÇA AQUI: Incluímos a barbershop dentro do serviço
      barbershopService: {
        include: {
          barbershop: true,
        },
      },
      user: true,
    },
  })
}
