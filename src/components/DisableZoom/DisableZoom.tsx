"use client"
import { useEffect } from 'react'

export default function DisableZoom() {
    useEffect(() => {
        // Zoom ni bloklash uchun funksiya
        function disableZoom() {
            // Meta tegni o'zgartirish
            const meta = document.querySelector('meta[name="viewport"]')
            if (meta) {
                meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0')
            }

            // Ctrl + Wheel
            const handleWheel = (e: WheelEvent) => {
                if (e.ctrlKey) {
                    e.preventDefault()
                }
            }

            // Keyboard shortcuts
            const handleKeyDown = (e: KeyboardEvent) => {
                if (
                    e.ctrlKey &&
                    (e.key === '+' ||
                        e.key === '-' ||
                        e.key === '0' ||
                        e.key === '=' ||
                        e.key === '_' ||
                        e.code === 'NumpadAdd' ||
                        e.code === 'NumpadSubtract' ||
                        e.code === 'Numpad0')
                ) {
                    e.preventDefault()
                    return false
                }
            }

            // Touch events
            const handleTouchStart = (e: TouchEvent) => {
                if (e.touches.length > 1) {
                    e.preventDefault()
                }
            }

            // Event listeners
            document.addEventListener('wheel', handleWheel, { passive: false })
            document.addEventListener('keydown', handleKeyDown, { passive: false })
            document.addEventListener('touchstart', handleTouchStart, { passive: false })
            document.addEventListener('gesturestart', (e) => e.preventDefault())
            document.addEventListener('gesturechange', (e) => e.preventDefault())
            document.addEventListener('gestureend', (e) => e.preventDefault())

            // CSS ni qo'shish
            document.body.style.touchAction = 'none'

            return () => {
                document.removeEventListener('wheel', handleWheel)
                document.removeEventListener('keydown', handleKeyDown)
                document.removeEventListener('touchstart', handleTouchStart)
            }
        }

        disableZoom()
    }, [])

    return null
} 