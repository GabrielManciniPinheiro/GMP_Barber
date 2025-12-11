import Header from "../_components/header"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"
import { db } from "../_lib/prisma"
import BookingItem from "../_components/booking-item"
import { notFound } from "next/navigation"

const Bookings = async () => {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    //TODO: Mostrar um pop-up de login
    return notFound()
  }
  const confirmedBookings = await db.booking.findMany({
    where: {
      userId: (session.user as any).id,
      date: {
        gte: new Date(),
      },
    },
    include: {
      barbershopService: {
        include: {
          barbershop: true,
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  })
  const concludedBookings = await db.booking.findMany({
    where: {
      userId: (session.user as any).id,
      date: {
        lt: new Date(),
      },
    },
    include: {
      barbershopService: {
        include: {
          barbershop: true,
        },
      },
    },
  })
  return (
    <>
      <Header />
      <div className="space-y-4 p-7">
        <h1 className="text-2xl font-bold">Meus Agendamentos</h1>
        {confirmedBookings.length > 0 && (
          <>
            <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
              Confirmados
            </h2>
            {confirmedBookings.map((booking) => (
              <BookingItem key={booking.id} booking={booking} />
            ))}
          </>
        )}
        {concludedBookings.length > 0 && (
          <>
            <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
              Finalizados
            </h2>
            {concludedBookings.map((booking) => (
              <BookingItem key={booking.id} booking={booking} />
            ))}
          </>
        )}
      </div>
    </>
  )
}

export default Bookings
