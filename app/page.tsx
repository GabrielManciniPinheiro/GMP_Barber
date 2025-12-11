//"use client"
//import { useState } from "react"
import Header from "./_components/header"
import { Button } from "./_components/ui/button"
import Image from "next/image"
// eslint-disable-next-line no-unused-vars
import { db } from "./_lib/prisma"
import BarbershopItem from "./_components/barbershop-item"
import { quickSearchOptions } from "./_constants/search"
import BookingItem from "./_components/booking-item"
import Search from "./_components/search"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "./_lib/auth"

const Home = async () => {
  const session = await getServerSession(authOptions)
  // Chamar banco de dados
  const barbershops = await db.barbershop.findMany({})
  const popularBarbershops = await db.barbershop.findMany({
    orderBy: {
      name: "desc",
    },
  })
  const confirmedBookings = session?.user
    ? await db.booking.findMany({
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
    : []

  console.log(barbershops)
  return (
    <div>
      {/* <Header /> */}
      <Header />
      <div className="p-5">
        <h2 className="text-xl font-bold">Olá, Gabriel!</h2>
        <p>Quinta-Feira, 11 de Setembro.</p>

        {/* INPUT DE BUSCA */}
        <div className="mt-6">
          <Search />
        </div>

        {/* Busca rápida*/}
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
        <div className="relative mt-6 h-[150px] w-full">
          <Image
            src="/banner-01.png"
            alt="Agende seu atendimento no melhor: Vila Barbearia!"
            fill
            className="rounded-xl object-cover"
          />
        </div>

        <h2 className="mb-3 ml-2 mt-6 text-xs font-bold uppercase text-gray-400">
          Agendamentos
        </h2>
        {/* Agendamento */}
        <div className="mt-6 flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {confirmedBookings.map((booking) => (
            <div className="mr-4 min-w-[360px]" key={booking.id}>
              <BookingItem booking={booking} />
            </div>
          ))}
        </div>

        {/* Lista de barbearias */}
        <h2 className="mb-3 ml-2 mt-6 text-xs font-bold uppercase text-gray-400">
          Escolha o seu profissional :
        </h2>
        <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop) => (
            <BarbershopItem barbershop={barbershop} key={barbershop.id} />
          ))}
        </div>

        {/* Lista de barbearias populares */}
        <h2 className="mb-3 ml-2 mt-6 text-xs font-bold uppercase text-gray-400">
          Populares
        </h2>
        <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
          {popularBarbershops.map((barbershop) => (
            <BarbershopItem barbershop={barbershop} key={barbershop.id} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
