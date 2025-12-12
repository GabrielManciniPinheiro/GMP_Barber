"use client"

import Image from "next/image"

interface PromoBannerProps {
  src: string
  alt: string
}

const PromoBanner = ({ src, alt }: PromoBannerProps) => {
  const handleScrollToBottom = () => {
    // Rola suavemente até o final da página (scrollHeight)
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    })
  }

  return (
    // Adicionei 'cursor-pointer' para indicar que é clicável
    <div onClick={handleScrollToBottom} className="w-full cursor-pointer">
      {/* CONTAINER DA IMAGEM:
         - relative w-full: Para a imagem preencher a largura
         - h-[150px]: Altura fixa no celular
         - md:h-[250px]: Altura maior em tablets/telas médias
         - lg:h-[350px]: Altura maior em telas grandes
         Isso impede que o banner fique gigante na vertical.
      */}
      <div className="relative h-[150px] w-full md:h-[300px] lg:h-[600px]">
        <Image
          src={src}
          alt={alt}
          fill // Ocupa 100% do container pai
          className="rounded-xl object-cover shadow-lg" // object-cover evita distorção (corta excessos)
          quality={100} // Garante qualidade máxima
        />
        {/* Efeito de brilho/sombra opcional para dar profundidade */}
        <div className="absolute inset-0 rounded-xl bg-black/20 transition-all duration-300 hover:bg-transparent" />
      </div>
    </div>
  )
}

export default PromoBanner
