"use client"
import { useState } from 'react'

import newsImg1 from "@/assets/img/news-img-1.jpg"
import newsImg2 from "@/assets/img/news-img-2.jpg"
import newsImg3 from "@/assets/img/news-img-3.jpg"
import Banner from '@/components/Banner/Banner'
import ContainerDefault from '@/components/Containers/ContainerDefault'
import NewsCard from '@/components/News/NewsCard'
import SmallNewsCard from '@/components/News/SmallNewsCard'
import Pagination from '@/components/Pagination/Pagination'
import Link from 'next/link'

const newsData = [
  {
    id: 1,
    title: "Осуществит ли Молдавия захват Приднестровья?",
    views: 12122,
    comments: 22,
    date: "21.12.2024",
    image: newsImg1
  },
  {
    id: 2,
    title: "Осуществит ли Молдавия захват Приднестровья?",
    views: 12122,
    comments: 22,
    date: "21.12.2024",
    image: newsImg2
  },
  {
    id: 3,
    title: "Осуществит ли Молдавия захват Приднестровья?",
    views: 12122,
    comments: 22,
    date: "21.12.2024",
    image: newsImg3
  },
]

const smallNewsData = [
  {
    id: 4,
    title: "2024: было непросто, но мы справились",
    views: 12122,
    comments: 22,
    date: "21.12.2024",
    image: newsImg1
  },
  {
    id: 5,
    title: "Нужен ВКС, как воздух!",
    views: 12122,
    comments: 22,
    date: "21.12.2024",
    image: newsImg2
  },
  {
    id: 6,
    title: "Украинский БПЛА «Довбуш» T-10 стал носителем FPV-коптеров",
    views: 12122,
    comments: 22,
    date: "21.12.2024",
    image: newsImg3
  },
  {
    id: 7,
    title: "Украинский БПЛА «Довбуш» T-10 стал носителем FPV-коптеров",
    views: 12122,
    comments: 22,
    date: "21.12.2024",
    image: newsImg1
  }
]

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <main className="pb-[100px] max-[425px]:pb-[80px]">
      <Banner title="Новости СВО" description="Последние новости СВО за 2025 год" />
      <ContainerDefault>
        <div className="mb-[40px] max-[425px]:mb-[60px]">
          <div className="flex items-center gap-2 text-white mb-[20px] max-[425px]:hidden">
            <Link href="/" className="hover:text-yellow-500">Главная</Link>
            <span>/</span>
            <Link href="/news" className="hover:text-yellow-500">Новости</Link>
            <span>/</span>
            <span className='text-white'>Статья</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-[40px] md:mb-[60px] max-[425px]:gap-[20px] max-[425px]:mb-[20px]">
          {newsData.map(news => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 max-[425px]:grid-cols-1 max-[425px]:gap-[20px]">
          {smallNewsData.map(news => (
            <SmallNewsCard key={news.id} news={news} />
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={254}
          onPageChange={handlePageChange}
        />
      </ContainerDefault>
    </main>
  )
}
