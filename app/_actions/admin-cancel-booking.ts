"use server"

import { db } from "@/app/_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/_lib/auth"
import { revalidatePath } from "next/cache"

export const adminCancelBooking = async (bookingId: string) => {
  const session = await getServerSession(authOptions)

  // Segurança: Só ADMIN passa daqui
  if ((session?.user as any).role !== "ADMIN") {
    throw new Error("Acesso negado.")
  }

  // Deleta sem perguntar de quem é
  await db.booking.delete({
    where: {
      id: bookingId,
    },
  })

  // Atualiza as telas
  revalidatePath("/dashboard")
  revalidatePath("/")
}
