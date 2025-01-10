import { INews } from '@/types/news.types'
import Image from 'next/image'
import Link from 'next/link'

// Import Img
import Comment from '@/assets/icons/comment-icon.svg'
import Eye from '@/assets/icons/eye-icon.svg'

interface NewsCardProps {
    news: INews
}

export default function NewsCard({ news }: NewsCardProps) {
    return (
        <Link href={`/news/${news.id}`} className="block">
            <div className="group cursor-pointer">
                <div className="relative h-[180px] md:h-[300px] max-[425px]:h-[220px] max-[425px]:w-full max-[425px]:mx-auto overflow-hidden rounded-[4px] ">
                    <Image
                        src={news.image}
                        alt={`Фото: ${news.title} - новости СВО 2025`}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                    />
                </div>
                <div className="mt-3 md:mt-4 max-[425px]:w-full max-[425px]:mx-auto">
                    <h3 className="text-white text-[16px] md:text-[24px] max-[425px]:text-[16px] leading-tight mb-2 md:mb-[16px] group-hover:text-yellow-500 transition-colors line-clamp-2">
                        {news.title}
                    </h3>
                    <div className="flex justify-between items-center text-white text-[14px] md:text-[16px] max-[425px]:text-[12px] font-normal max-[425px]:justify-normal max-[425px]:gap-[20px]">
                        <span>{news.date}</span>
                        <div className="flex items-center gap-1">
                            <Image src={Eye} alt="eye" width={24} height={24} className='w-[16px] h-[16px] md:w-[24px] md:h-[24px]' />
                            <span>{news.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Image src={Comment} alt="comment" width={24} height={24} className='w-[16px] h-[16px] md:w-[24px] md:h-[24px]' />
                            <span>{news.comments}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
} 