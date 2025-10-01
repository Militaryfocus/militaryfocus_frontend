import { INews } from '@/types/news.types'
import Image from 'next/image'
import Link from 'next/link'

// Import Img
import Comment from '@/assets/icons/comment-icon.svg'
import Eye from '@/assets/icons/eye-icon.svg'

interface NewsCardProps {
    news: INews
}

export default function SmallNewsCard({ news }: NewsCardProps) {
    return (
        <Link href={`/news/${news.id}`} className="block">
            <div className="group cursor-pointer">
                <div className="relative h-[220px] max-[425px]:h-[220px] max-[425px]:w-full max-[425px]:mx-auto overflow-hidden rounded-[4px]">
                    <Image
                        src={news.article_image || '/assets/banner.jpg'}
                        alt={news.article_title}
                        fill
                        className="object-cover transition-transform  group-hover:scale-105"
                    />
                </div>
                <div className="mt-3">
                    <h3 className="text-white text-[16px] leading-tight mb-2 group-hover:text-yellow-500 transition-colors line-clamp-2">
                        {news.article_title}
                    </h3>
                    <div className="flex justify-between items-center text-white text-[14px] font-normal max-[425px]:text-[12px] max-[425px]:justify-normal max-[425px]:gap-[20px]">
                        <span>0</span>
                        <div className="flex items-center gap-1">
                            <Image src={Eye} alt="eye" width={24} height={24} className='w-[16px] h-[16px]' />
                            <span>0</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Image src={Comment} alt="comment" width={24} height={24} className='w-[16px] h-[16px]' />
                            <span>0</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
} 