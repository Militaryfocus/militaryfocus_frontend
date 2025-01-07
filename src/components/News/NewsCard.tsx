import { INews } from '@/types/news.types'
import Image from 'next/image'
import { BsEye } from 'react-icons/bs'
import { FaRegComments } from 'react-icons/fa'

interface NewsCardProps {
    news: INews
}

export default function NewsCard({ news }: NewsCardProps) {
    return (
        <div className="group cursor-pointer">
            <div className="relative h-[300px] overflow-hidden">
                <Image
                    src={news.image}
                    alt={news.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105 mb-[10px]"
                />
            </div>
            <div className="mt-4">
                <h3 className="font-russo-one text-white text-[24px] mb-[16px] group-hover:text-yellow-500 transition-colors">
                    {news.title}
                </h3>
                <div className="flex max-w-[334px] justify-between items-center gap-4 text-white text-[16px] font-normal">
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