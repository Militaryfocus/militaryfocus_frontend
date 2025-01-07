import { INews } from '@/types/news.types'
import Image from 'next/image'
import { BsEye } from 'react-icons/bs'
import { FaRegComments } from 'react-icons/fa'

interface NewsCardProps {
    news: INews
}

export default function SmallNewsCard({ news }: NewsCardProps) {
    return (
        <div className="group cursor-pointer">
            <div className="relative h-[180px] overflow-hidden">
                <Image
                    src={news.image}
                    alt={news.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                />
            </div>
            <div className="mt-3">
                <h3 className="font-russo-one text-white text-[16px] leading-tight mb-2 group-hover:text-yellow-500 transition-colors line-clamp-2">
                    {news.title}
                </h3>
                <div className="flex justify-between items-center text-white text-[14px] font-normal">
                    <span>{news.date}</span>
                    <div className="flex items-center gap-1">
                        <BsEye />
                        <span>{news.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <FaRegComments />
                        <span>{news.comments}</span>
                    </div>
                </div>
            </div>
        </div>
    )
} 