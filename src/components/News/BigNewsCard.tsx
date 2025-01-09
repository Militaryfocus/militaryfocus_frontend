import { INews } from '@/types/news.types'
import Image from 'next/image'
import Link from 'next/link'

// Import Icons
import Comment from '@/assets/icons/comment-icon.svg'
import Eye from '@/assets/icons/eye-icon.svg'

interface BigNewsCardProps {
    news: INews
}

export default function BigNewsCard({ news }: BigNewsCardProps) {
    return (
        <Link href={`/news/${news.id}`}>
            <div className="relative w-full h-[339px] max-[1024px]:h-[400px] max-[425px]:h-[300px] group">
                {/* Background Image */}
                <Image
                    src={news.image}
                    alt={news.title}
                    fill
                    className="object-cover rounded-[4px]"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-[40px] max-[425px]:p-[20px]">
                    <h1 className="text-white text-[24px] leading-tight mb-[20px] max-[1024px]:text-[32px] max-[425px]:text-[24px] max-[425px]:mb-[10px] group-hover:text-yellow-500 transition-colors">
                        {news.title}
                    </h1>

                    <div className="flex items-center gap-[30px] text-white">
                        <span className="text-[16px] font-normal">{news.date}</span>
                        <div className="flex items-center gap-[8px]">
                            <Image src={Eye} alt="views" width={24} height={24} />
                            <span className="text-[16px] font-normal">{news.views}</span>
                        </div>
                        <div className="flex items-center gap-[8px]">
                            <Image src={Comment} alt="comments" width={24} height={24} />
                            <span className="text-[16px] font-normal">{news.comments}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
} 