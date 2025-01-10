"use client"
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

// Import Icons
import ArrowLeft from '@/assets/icons/left-arrow-icon.svg'
import ArrowRight from '@/assets/icons/right-arrow-icon.svg'

interface PhotoSliderProps {
    photos: string[]
}

export default function PhotoSlider({ photos }: PhotoSliderProps) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [indicatorPosition, setIndicatorPosition] = useState(0)
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const containerWidth = 260 // indicator container width
    const indicatorWidth = 50 // indicator width
    const maxScroll = containerWidth - indicatorWidth

    // Scroll pozitsiyasini kuzatish
    useEffect(() => {
        const handleScroll = () => {
            if (scrollRef.current && !isDragging) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
                const maxScrollWidth = scrollWidth - clientWidth
                const position = (scrollLeft / maxScrollWidth) * maxScroll
                setIndicatorPosition(Math.min(Math.max(position, 0), maxScroll))
            }
        }

        const scrollElement = scrollRef.current
        if (scrollElement) {
            scrollElement.addEventListener('scroll', handleScroll)
            return () => scrollElement.removeEventListener('scroll', handleScroll)
        }
    }, [isDragging, maxScroll])

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true)
        setStartX(e.clientX - indicatorPosition)
    }

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging) return

        e.preventDefault()
        const x = e.clientX - startX
        const walk = Math.min(Math.max(x, 0), maxScroll)
        setIndicatorPosition(walk)

        if (scrollRef.current) {
            const { scrollWidth, clientWidth } = scrollRef.current
            const maxScrollWidth = scrollWidth - clientWidth
            const scrollTo = (walk / maxScroll) * maxScrollWidth
            scrollRef.current.scrollLeft = scrollTo
        }
    }, [isDragging, maxScroll, startX])

    const handleMouseUp = useCallback(() => {
        setIsDragging(false)
    }, [])

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [handleMouseMove, handleMouseUp])

    const scroll = useCallback((direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft } = scrollRef.current
            const scrollAmount = 400 // card width
            const newScrollLeft = scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)

            scrollRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            })
        }
    }, [])

    return (
        <section className="relative mb-[80px]">
            {/* Slider Container */}
            <div className="relative">
                <div
                    ref={scrollRef}
                    className="flex gap-5 overflow-hidden mx-auto max-[550px]:overflow-x-scroll"
                    style={{
                        width: '100vw',
                        paddingLeft: 'calc((100vw - 1440px) / 2 + 16px)',
                        paddingRight: '120px',
                        WebkitOverflowScrolling: 'touch',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                    }}
                >
                    <style jsx>{`
                        div::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>
                    {photos.map((photo, index) => (
                        <div
                            key={index}
                            className="relative flex-shrink-0 w-[400px] h-[300px] max-[425px]:w-[275px] max-[425px]:h-[240px] rounded-[4px] overflow-hidden"
                        >
                            <Image
                                src={photo}
                                alt={`Photo ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ))}
                </div>

                {/* Left Gradient Overlay */}
                <div
                    className="absolute left-[-10px] top-0 bottom-0 w-[120px] max-[425px]:w-[60px] pointer-events-none"
                    style={{
                        background: 'linear-gradient(90deg, #191B13 30%, rgba(25, 27, 19, 0) 100%)'
                    }}
                />

                {/* Right Gradient Overlay */}
                <div
                    className="absolute right-[-10%] top-0 bottom-0 w-[120px] max-[425px]:w-[60px] pointer-events-none"
                    style={{
                        background: 'linear-gradient(270deg, #191B13 30%, rgba(25, 27, 19, 0) 100%)'
                    }}
                />

                {/* Navigation Buttons - Desktop */}
                <div className="absolute bottom-[-18%] left-[50%] translate-x-[-50%] gap-[12px] z-20 md:flex hidden">
                    <button
                        onClick={() => scroll('left')}
                        className="w-[108px] h-[29px] bg-[#ED9215] text-white text-[14px] font-semibold rounded-full flex items-center justify-center hover:bg-[#c67b13] transition-colors"
                    >
                        <Image src={ArrowLeft} alt="Previous" width={18} height={18} className="mr-[8px]" />
                        Назад
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="w-[108px] h-[29px] bg-[#ED9215] text-white text-[14px] font-semibold rounded-full flex items-center justify-center hover:bg-[#c67b13] transition-colors"
                    >
                        Далее
                        <Image src={ArrowRight} alt="Next" width={18} height={18} className="ml-[8px]" />
                    </button>
                </div>

                {/* Slider Indicator - Mobile */}
                <div className="md:hidden absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 w-[260px] h-[8px] bg-[#262F0D] rounded-full">
                    <div
                        className="absolute top-0 left-0 w-[50px] h-full bg-[#ED9215] rounded-full transition-all duration-300 cursor-pointer"
                        style={{ transform: `translateX(${indicatorPosition}px)` }}
                        onMouseDown={handleMouseDown}
                    />
                </div>
            </div>
        </section>
    )
} 