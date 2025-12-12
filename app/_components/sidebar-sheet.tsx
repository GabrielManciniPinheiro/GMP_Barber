"use client"

import Image from "next/image"
import { Button } from "./ui/button"
import {
  CalendarIcon,
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  LayoutDashboard,
} from "lucide-react" // Adicionei LayoutDashboard
import { SheetClose, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet"
import { quickSearchOptions } from "../_constants/search"
import { Avatar, AvatarImage } from "./ui/avatar"
import Link from "next/link"
import { Dialog, DialogTrigger, DialogContent } from "./ui/dialog"
import { useSession, signOut } from "next-auth/react"
import SignInDialog from "./sign-in-dialog"
import { useState } from "react" // Importei useState

const SidebarSheet = () => {
  const { data } = useSession()
  // Estado para controlar se o Dialog de Login está aberto (usado no botão Agendamentos)
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)

  const handleLogoutClick = () => signOut()

  // Função auxiliar para verificar se é Admin
  // (Precisamos fazer um cast 'as any' pq o TypeScript padrão do NextAuth não conhece o campo 'role')
  const isAdmin = (data?.user as any)?.role === "ADMIN"

  return (
    <SheetContent className="overflow-y-auto">
      <SheetHeader>
        <SheetTitle className="text-left">Menu</SheetTitle>
      </SheetHeader>

      {/* CABEÇALHO DO USUÁRIO */}
      <div className="flex items-center justify-between gap-3 border-b border-solid py-5">
        {data?.user ? (
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={data?.user?.image ?? ""} />
            </Avatar>
            <div>
              <p className="font-bold">{data.user.name}</p>
              <p className="text-xs text-gray-500">{data.user.email}</p>
            </div>
          </div>
        ) : (
          <>
            <h2 className="font-bold">Olá, faça seu login!</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="icon">
                  <LogInIcon />
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90%]">
                <SignInDialog />
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>

      {/* LINKS DE NAVEGAÇÃO */}
      <div className="flex flex-col gap-2 border-b border-solid py-5">
        {/* INÍCIO */}
        <SheetClose asChild>
          <Button className="justify-start gap-2" variant="ghost" asChild>
            <Link href="/">
              <HomeIcon size={18} />
              Início
            </Link>
          </Button>
        </SheetClose>

        {/* AGENDAMENTOS (Com Lógica Inteligente) */}
        {data?.user ? (
          // SE ESTIVER LOGADO: Link normal para a página
          <SheetClose asChild>
            <Button className="justify-start gap-2" variant="ghost" asChild>
              <Link href="/bookings">
                <CalendarIcon size={18} />
                Agendamentos
              </Link>
            </Button>
          </SheetClose>
        ) : (
          // SE NÃO ESTIVER LOGADO: Botão que abre o Dialog de Login
          // Usamos um Dialog controlado aqui dentro
          <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
            <DialogTrigger asChild>
              <Button className="justify-start gap-2" variant="ghost">
                <CalendarIcon size={18} />
                Agendamentos
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[90%]">
              <SignInDialog />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* ÁREA ADMIN (Só aparece se for ADMIN) */}
      {isAdmin && (
        <div className="flex flex-col gap-2 border-b border-solid py-5">
          <SheetClose asChild>
            <Button
              className="justify-start gap-2 text-primary hover:text-primary"
              variant="ghost"
              asChild
            >
              <Link href="/dashboard">
                <LayoutDashboard size={18} />
                Gestão (Admin)
              </Link>
            </Button>
          </SheetClose>
        </div>
      )}

      {/* SERVIÇOS RÁPIDOS */}
      <div className="flex flex-col gap-2 border-b border-solid py-5">
        {quickSearchOptions.map((option) => (
          <SheetClose asChild key={option.title}>
            <Button
              key={option.title}
              className="justify-start gap-2"
              variant="ghost"
              asChild
            >
              <Link href={`/barbershops?service=${option.title}`}>
                <Image
                  alt={option.title}
                  src={option.imageURL}
                  height={18}
                  width={18}
                />
                {option.title}
              </Link>
            </Button>
          </SheetClose>
        ))}
      </div>

      {/* LOGOUT */}
      {data?.user && (
        <div className="flex flex-col gap-2 py-5">
          <Button
            variant="ghost"
            className="justify-start gap-2"
            onClick={handleLogoutClick}
          >
            <LogOutIcon size={18} />
            Sair da Conta
          </Button>
        </div>
      )}
    </SheetContent>
  )
}

export default SidebarSheet
