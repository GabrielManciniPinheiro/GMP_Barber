"use client"

import { useRef, useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface HorizontalScrollProps {
  children: React.ReactNode
  showArrowsOnMobile?: boolean // Mantivemos aqui pro TypeScript não reclamar no outro arquivo, mas não usamos mais.
}

const HorizontalScroll = ({ children }: HorizontalScrollProps) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5)
    }
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener("resize", checkScroll)
    return () => window.removeEventListener("resize", checkScroll)
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef
      const scrollAmount = direction === "left" ? -300 : 300

      current.scrollBy({ left: scrollAmount, behavior: "smooth" })
      setTimeout(checkScroll, 500)
    }
  }

  // Base da seta: Sempre visível (opacity-100) e fixa
  const arrowBaseClass =
    "absolute top-0 bottom-0 z-20 w-12 flex items-center justify-center transition-all duration-300 opacity-100"

  return (
    <div className="group relative w-full">
      {/* FAIXA ESQUERDA */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className={`${arrowBaseClass} left-0 rounded-l-lg bg-gradient-to-r from-black/70 to-transparent`}
        >
          <ChevronLeft
            className="h-8 w-8 text-white drop-shadow-md"
            strokeWidth={1.5}
          />
        </button>
      )}

      {/* ÁREA DE CONTEÚDO */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto scroll-smooth px-1 pb-2 [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      {/* FAIXA DIREITA */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className={`${arrowBaseClass} right-0 rounded-r-lg bg-gradient-to-l from-black/70 to-transparent`}
        >
          <ChevronRight
            className="h-8 w-8 text-white drop-shadow-md"
            strokeWidth={1.5}
          />
        </button>
      )}
    </div>
  )
}

export default HorizontalScroll
