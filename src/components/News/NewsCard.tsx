import { INews } from '@/types/news.types'
import Image from 'next/image'
import Link from 'next/link'
import { FiEye, FiMessageCircle, FiClock, FiArrowRight, FiCalendar } from 'react-icons/fi'

interface NewsCardProps {
    news: INews
    variant?: 'default' | 'featured' | 'compact'
    showStats?: boolean
}

export default function NewsCard({ news, variant = 'default', showStats = true }: NewsCardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
        
        if (diffInHours < 1) return 'Только что'
        if (diffInHours < 24) return `${diffInHours} ч назад`
        if (diffInHours < 48) return 'Вчера'
        return formatDate(dateString)
    }

    const cardClasses = {
        default: 'card hover:shadow-xl transition-all duration-300 group',
        featured: 'card-military hover:shadow-2xl transition-all duration-300 group col-span-1 md:col-span-2',
        compact: 'card hover:shadow-lg transition-all duration-300 group flex gap-4'
    }

    const imageClasses = {
        default: 'relative h-48 md:h-64 overflow-hidden rounded-t-xl',
        featured: 'relative h-64 md:h-80 overflow-hidden rounded-t-xl',
        compact: 'relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg'
    }

    const contentClasses = {
        default: 'p-6',
        featured: 'p-8',
        compact: 'flex-1 py-2'
    }

    return (
        <Link href={news.article_link} className="block h-full">
            <article className={`${cardClasses[variant]} h-full`}>
                {/* Image */}
                <div className={imageClasses[variant]}>
                    <Image
                        src={news.article_image || '/assets/banner.jpg'}
                        alt={`Фото: ${news.article_title} - новости СВО 2025`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes={variant === 'featured' ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'}
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Featured Badge */}
                    {variant === 'featured' && (
                        <div className="absolute top-4 left-4">
                            <span className="badge-military px-3 py-1 text-xs font-semibold">
                                Главная новость
                            </span>
                        </div>
                    )}
                    
                    {/* Read More Arrow */}
                    <div className="absolute bottom-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <FiArrowRight className="w-4 h-4 text-white" />
                    </div>
                </div>

                {/* Content */}
                <div className={contentClasses[variant]}>
                    {/* Title */}
                    <h3 className={`text-white font-medium group-hover:text-yellow-300 transition-colors duration-200 mb-3 ${
                        variant === 'featured' ? 'text-xl md:text-2xl' : 
                        variant === 'compact' ? 'text-sm' : 'text-lg'
                    } line-clamp-2`}>
                        {news.article_title}
                    </h3>

                    {/* Meta Information */}
                    <div className="flex items-center justify-between text-gray-400 text-sm">
                        <div className="flex items-center gap-4">
                            {/* Date */}
                            <div className="flex items-center gap-1">
                                <FiCalendar className="w-3 h-3" />
                                <span>{getTimeAgo(news.date)}</span>
                            </div>
                            
                            {/* Time */}
                            <div className="flex items-center gap-1">
                                <FiClock className="w-3 h-3" />
                                <span>5 мин чтения</span>
                            </div>
                        </div>

                        {/* Stats */}
                        {showStats && (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                    <FiEye className="w-3 h-3" />
                                    <span>{Math.floor(Math.random() * 1000) + 100}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <FiMessageCircle className="w-3 h-3" />
                                    <span>{Math.floor(Math.random() * 50) + 5}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Featured Description */}
                    {variant === 'featured' && (
                        <p className="text-gray-300 text-sm mt-4 line-clamp-3">
                            Подробный анализ событий специальной военной операции. 
                            Эксклюзивные материалы от непосредственных участников событий.
                        </p>
                    )}

                    {/* Compact Additional Info */}
                    {variant === 'compact' && (
                        <div className="mt-2">
                            <span className="badge-primary text-xs">СВО</span>
                        </div>
                    )}
                </div>
            </article>
        </Link>
    )
}