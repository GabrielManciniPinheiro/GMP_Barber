import Header from "./_components/header"
import { Button } from "./_components/ui/button"
import Image from "next/image"
// eslint-disable-next-line no-unused-vars
import { db } from "./_lib/prisma"
import BarbershopItem from "./_components/barbershop-item"
import { quickSearchOptions } from "./_constants/search"
import BookingItem from "./_components/booking-item" // <--- Descomentei aqui
import Search from "./_components/search"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "./_lib/auth"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { getConfirmedBookings } from "./_data/get-confirmed-bookings"
import HorizontalScroll from "./_components/ui/horizontal-scroll"
import PromoBanner from "./_components/banner" // Verifique se o nome do arquivo é banner ou promo-banner

const Home = async () => {
  const session = await getServerSession(authOptions)

  // Chamar banco de dados
  const barbershops = await db.barbershop.findMany({
    orderBy: {
      name: "asc",
    },
  })
  // const popularBarbershops = await db.barbershop.findMany({
  //   orderBy: {
  //     name: "desc",
  //   },
  // })

  const confirmedBookings = await getConfirmedBookings()

  return (
    <div>
      <Header />

      <div className="p-5">
        {/* SAUDAÇÃO E DATA */}
        <h2 className="text-xl font-bold">
          Olá, {session?.user ? session.user.name : "Bem-vindo"}!
        </h2>
        <p className="text-sm capitalize text-gray-400">
          {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
        </p>

        {/* INPUT DE BUSCA */}
        <div className="mt-6">
          <Search />
        </div>

        {/* BUSCA RÁPIDA (ÍCONES) */}
        {/* Aqui mantemos o scroll nativo simples ou pode usar o HorizontalScroll também se quiser setas */}
        <div className="mt-6 flex gap-3 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
          {quickSearchOptions.map((option) => (
            <Button
              className="gap-2"
              variant="secondary"
              key={option.title}
              asChild
            >
              <Link href={`/barbershops?service=${option.title}`}>
                <Image
                  src={option.imageURL}
                  alt={option.title}
                  width={16}
                  height={16}
                />
                {option.title}
              </Link>
            </Button>
          ))}
        </div>

        {/* BANNER IMAGEM */}
        {/* Ajuste o src para a URL da imagem ou arquivo local correto */}
        <div className="mt-6">
          <PromoBanner
            src="/banner-01.png" // Exemplo, use a sua URL
            alt="Agende seu atendimento no melhor: Vila Barbearia!"
          />
        </div>

        {/* SEÇÃO DE AGENDAMENTOS */}
        {confirmedBookings.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-3 text-xs font-bold uppercase text-gray-400">
              Agendamentos
            </h2>
            <HorizontalScroll>
              {confirmedBookings.map((booking) => (
                // Importante: min-w para garantir que fiquem lado a lado
                <div
                  key={booking.id}
                  className="min-w-[300px] md:min-w-[360px]"
                >
                  <BookingItem booking={booking} />
                </div>
              ))}
            </HorizontalScroll>
          </div>
        )}

        {/* LISTA DE PROFISSIONAIS (BARBEARIAS) */}
        <div className="mt-6">
          <h2 className="mb-3 text-xs font-bold uppercase text-gray-400">
            Escolha o seu profissional
          </h2>
          {/* REMOVI a div externa de overflow que atrapalhava as setas */}
          <HorizontalScroll>
            {barbershops.map((barbershop) => (
              <div key={barbershop.id} className="min-w-[167px] max-w-[167px]">
                <BarbershopItem barbershop={barbershop} />
              </div>
            ))}
          </HorizontalScroll>
        </div>

        {/* LISTA DE POPULARES
        <div className="mb-1 mt-6">
          <h2 className="mb-3 text-xs font-bold uppercase text-gray-400">
            Populares
          </h2>
          <HorizontalScroll>
            {popularBarbershops.map((barbershop) => (
              <div key={barbershop.id} className="min-w-[167px] max-w-[167px]">
                <BarbershopItem barbershop={barbershop} />
              </div>
            ))}
          </HorizontalScroll>
        </div> */}
      </div>
    </div>
  )
}

export default Home
