"use client"
import BannerBlogMobile from '@/assets/img/blog-banner-mobile.jpg'
import BannerBlog from '@/assets/img/blog-banner.png'
import { useEffect, useState } from 'react'
import { FiArrowRight, FiPlay, FiTrendingUp, FiUsers } from 'react-icons/fi'
import ContainerDefault from '../Containers/ContainerDefault'

interface BannerProps {
    title: string
    description: string
    showStats?: boolean
    variant?: 'default' | 'hero' | 'minimal'
}

const Banner = ({ title, description, showStats = true, variant = 'default' }: BannerProps) => {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 425)
        }

        handleResize() // Initial check
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const stats = [
        { icon: FiUsers, label: 'Активных читателей', value: '125K+' },
        { icon: FiTrendingUp, label: 'Новостей в день', value: '50+' },
        { icon: FiPlay, label: 'Видео материалов', value: '200+' },
    ]

    const bannerClasses = {
        default: 'w-full py-20 md:py-32 relative overflow-hidden bg-cover bg-center mb-16 rounded-b-3xl',
        hero: 'w-full py-24 md:py-40 relative overflow-hidden bg-cover bg-center mb-20 rounded-b-3xl',
        minimal: 'w-full py-16 md:py-24 relative overflow-hidden bg-cover bg-center mb-12 rounded-b-2xl'
    }

    return (
        <div
            className={`${bannerClasses[variant]} animate-fade-in`}
            style={{ 
                backgroundImage: `url(${isMobile ? BannerBlogMobile.src : BannerBlog.src})`,
                backgroundAttachment: 'fixed'
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
            
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/20 rounded-full animate-float"></div>
                <div className="absolute top-32 right-20 w-16 h-16 bg-yellow-500/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-500/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            <ContainerDefault>
                <div className="relative z-10">
                    <div className="max-w-4xl">
                        {/* Title */}
                        <h1 className={`text-white font-russo mb-6 leading-tight ${
                            variant === 'hero' ? 'text-4xl md:text-7xl' :
                            variant === 'minimal' ? 'text-3xl md:text-5xl' :
                            'text-3xl md:text-6xl'
                        } animate-slide-up`}>
                            <span className="text-gradient-military">{title}</span>
                        </h1>
                        
                        {/* Description */}
                        <p className={`text-white/90 font-sans mb-8 leading-relaxed animate-slide-up ${
                            variant === 'hero' ? 'text-lg md:text-2xl' :
                            variant === 'minimal' ? 'text-base md:text-lg' :
                            'text-base md:text-xl'
                        }`} style={{ animationDelay: '0.2s' }}>
                            {description}
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                            <button className="btn-military px-8 py-4 text-lg font-medium group">
                                Читать новости
                                <FiArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                            </button>
                            <button className="btn-ghost px-8 py-4 text-lg font-medium border border-white/30 hover:border-white/50">
                                Смотреть видео
                                <FiPlay className="w-5 h-5 ml-2" />
                            </button>
                        </div>

                        {/* Stats */}
                        {showStats && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                                {stats.map((stat, index) => (
                                    <div key={index} className="glass-effect rounded-xl p-4 text-center group hover:scale-105 transition-transform duration-300">
                                        <div className="flex items-center justify-center mb-2">
                                            <stat.icon className="w-6 h-6 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-200" />
                                        </div>
                                        <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                                        <div className="text-sm text-gray-300">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Scroll Indicator */}
                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
                            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                                <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </ContainerDefault>
        </div>
    )
}

export default Banner