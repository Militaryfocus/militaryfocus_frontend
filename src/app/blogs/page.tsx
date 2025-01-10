"use client"
import Banner from '@/components/Banner/Banner'
import CategoryTitle from '@/components/Category/CategoryTitle'
import ContainerDefault from '@/components/Containers/ContainerDefault'
import NewsCard from '@/components/News/NewsCard'
import SmallNewsCard from '@/components/News/SmallNewsCard'

// Import data
import LinkCard from '@/components/LinkCard/LinkCard'
import BigNewsCard from '@/components/News/BigNewsCard'
import { analyticsData, historyData, newsData, technologiesData, weaponsData } from '@/data/news.data'

export default function Blogs() {
    return (
        <main className="pt-[0px] pb-[100px] max-[425px]:pb-[80px]">
            <Banner
                title="Последние новости СВО"
                description="Актуальные новости и аналитика о событиях специальной военной операции"
            />
            <ContainerDefault>
                {/* Последние новости СВО */}
                <section className="mb-[60px]">
                    <CategoryTitle title="Последние новости СВО" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-[40px] md:mb-[60px] max-[425px]:gap-[20px] max-[425px]:mb-[20px]">
                        {newsData.slice(0, 3).map(news => (
                            <NewsCard key={news.id} news={news} />
                        ))}
                    </div>

                    <div className="grid grid-cols-4 gap-5 max-[1024px]:grid-cols-2 max-[425px]:grid-cols-1 max-[425px]:gap-[20px]">
                        {newsData.slice(3, 7).map(news => (
                            <SmallNewsCard key={news.id} news={news} />
                        ))}
                        <LinkCard title="Новости" />
                    </div>
                </section>

                {/* Хроника событий СВО */}
                <section className="mb-[60px]">
                    <CategoryTitle title="Хроника событий СВО" />
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 max-[425px]:grid-cols-1 max-[425px]:gap-[20px]">
                        {historyData.slice(0, 7).map(news => (
                            <SmallNewsCard key={news.id} news={news} />
                        ))}
                        <LinkCard title="История" />

                    </div>
                </section>

                {/* Аналитика СВО */}
                <section className="mb-[60px]">
                    <CategoryTitle title="Аналитика СВО" />
                    <div className="grid grid-cols-2 gap-5 mb-[20px] max-[1024px]:grid-cols-1 max-[425px]:grid-cols-1">
                        {/* Large Card - 50% */}
                        <div className="col-span-1">
                            <BigNewsCard news={analyticsData[0]} />
                        </div>

                        {/* Medium Cards - 50% */}
                        <div className="col-span-1 grid grid-cols-2 gap-5 max-[425px]:grid-cols-1">
                            {analyticsData.slice(1, 3).map(news => (
                                <SmallNewsCard key={news.id} news={news} />
                            ))}
                        </div>
                    </div>

                    {/* Small Cards */}
                    <div className="grid grid-cols-4 gap-5 max-[1024px]:grid-cols-2 max-[425px]:grid-cols-1">
                        {analyticsData.slice(3, 6).map(news => (
                            <SmallNewsCard key={news.id} news={news} />
                        ))}
                        <LinkCard title="Аналитика" />
                    </div>
                </section>

                {/* Карта зоны СВО */}
                <section className="mb-[60px]">
                    <CategoryTitle title="Карта зоны СВО" />
                    <div className="grid grid-cols-2 gap-5 mb-[20px] max-[1024px]:grid-cols-1 max-[425px]:grid-cols-1">
                        {/* Large Card - 50% */}
                        <div className="col-span-1">
                            <BigNewsCard news={weaponsData[0]} />
                        </div>

                        {/* Medium Cards - 50% */}
                        <div className="col-span-1 grid grid-cols-2 gap-5 max-[425px]:grid-cols-1">
                            {weaponsData.slice(1, 3).map(news => (
                                <SmallNewsCard key={news.id} news={news} />
                            ))}
                        </div>
                    </div>

                    {/* Small Cards */}
                    <div className="grid grid-cols-4 gap-5 max-[1024px]:grid-cols-2 max-[425px]:grid-cols-1">
                        {weaponsData.slice(3, 6).map(news => (
                            <SmallNewsCard key={news.id} news={news} />
                        ))}
                        <LinkCard title="Оружие" />
                    </div>
                </section>

                {/* Личный опыт участника СВО */}
                <section className="mb-[60px]">
                    <CategoryTitle title="Личный опыт участника СВО" />
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 max-[425px]:grid-cols-1 max-[425px]:gap-[20px]">
                        {technologiesData.slice(0, 7).map(news => (
                            <SmallNewsCard key={news.id} news={news} />
                        ))}
                        <LinkCard title="Личный опыт участника СВО" />
                    </div>
                </section>

                {/* Вопросы и ответы о СВО */}
                <section>
                    <CategoryTitle title="Вопросы и ответы о СВО" />
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 max-[425px]:grid-cols-1 max-[425px]:gap-[20px]">
                        {technologiesData.slice(0, 7).map(news => (
                            <SmallNewsCard key={news.id} news={news} />
                        ))}
                        <LinkCard title="Вопросы и ответы о СВО" />
                    </div>
                </section>
            </ContainerDefault>
        </main>
    )
}
