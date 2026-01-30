"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"
import { set } from "date-fns"
// 1. Importação da função de email (Resend)
import { sendBookingConfirmation } from "../_lib/resend"

interface CreateBookingParams {
  serviceId: string
  date: Date
}

export const createBooking = async ({
  serviceId,
  date,
}: CreateBookingParams) => {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    throw new Error("Usuário não autenticado")
  }

  // Limpa a data (segundos/ms)
  const dateWithTime = set(date, {
    seconds: 0,
    milliseconds: 0,
  })

  // 2. Busca o serviço E a barbearia (Necessário para o email)
  const service = await db.barbershopService.findUnique({
    where: { id: serviceId },
    include: {
      barbershop: true, // <--- Adicionado para pegar o nome da barbearia
    },
  })

  if (!service) {
    throw new Error("Serviço não encontrado")
  }

  // 3. TRAVA GLOBAL DO BARBEIRO 🛡️
  const conflict = await db.booking.findFirst({
    where: {
      date: dateWithTime,
      barbershopService: {
        barbershopId: service.barbershopId,
      },
    },
  })

  if (conflict) {
    throw new Error("Horário indisponível para este barbeiro.")
  }

  // 4. Salva o agendamento
  await db.booking.create({
    data: {
      date: dateWithTime,
      barbershopServiceId: serviceId,
      userId: (session.user as any).id,
    },
  })

  // 5. ENVIA O EMAIL DE CONFIRMAÇÃO 📧
  // Verifica se o usuário tem email cadastrado antes de enviar
  if (session.user.email && session.user.name) {
    try {
      await sendBookingConfirmation({
        userEmail: session.user.email,
        userName: session.user.name,
        serviceName: service.name,
        barbershopName: service.barbershop.name,
        date: dateWithTime,
      })
    } catch (error) {
      // Apenas loga o erro, mas não trava o agendamento se o email falhar
      console.error("Erro ao enviar email:", error)
    }
  }

  revalidatePath("/bookings")
  revalidatePath("/")
}
