import ContainerDefault from '@/components/Containers/ContainerDefault'
import Image from 'next/image'
import Link from 'next/link'

// Import Img
import BlogImage from '@/assets/img/blog-inner-img.jpg'
import QuoteIcon from '@/assets/svg/quote-icon.svg'

// Import components
import CategoryTitle from '@/components/Category/CategoryTitle'
import Comments from '@/components/Comments/Comments'
import PhotoSlider from '@/components/Slider/PhotoSlider'

// Import Video Icon

// Import Video Image
import VideoImage from '@/assets/svg/video-play-box.svg'

// Mock photos data
const photos = [
    'https://images.unsplash.com/photo-1544552866-d3ed42536cfd',
    'https://images.unsplash.com/photo-1580424917967-a8867a6e676e',
    'https://images.unsplash.com/photo-1542451542907-6cf80ff362d6',
    'https://images.unsplash.com/photo-1542451542907-6cf80ff362d6',
    'https://images.unsplash.com/photo-1542451542907-6cf80ff362d6',
    'https://images.unsplash.com/photo-1563900905574-8674edd8d156',
]

// Mock comments data
const comments = [
    {
        id: 1,
        author: 'Пользователь',
        date: '21.12.2024',
        text: 'Первое. Для того, чтобы сокращать количество трудовых мигрантов, нужно повышать производительность труда. И не нужно будет привлекать большое количество мигрантов. Второе. Если это неизбежно, то нужно вместе с нашими партнерами в некоторых странах, прежде всего, конечно, речь идет о странах Центральной Азии, работать над тем, чтобы людей к этому готовить.',
        replies: [
            {
                id: 4,
                author: 'Никнейм',
                date: '21.12.2024',
                text: 'То есть развивать там сеть русских школ, изучения русского языка, знакомить людей, которые собираются приехать к нам работать с традициями, с культурой, с требованиями российского закона.',
                replyTo: 'Пользователь'
            }
        ]
    },
    {
        id: 2,
        author: 'Гость',
        date: '21.12.2024',
        text: 'То есть развивать там сеть русских школ, изучения русского языка, знакомить людей, которые собираются приехать к нам работать с традициями, с культурой, с требованиями российского закона.'
    },
    {
        id: 3,
        author: 'Странник',
        date: '21.12.2024',
        text: 'Главный в какой сказке живет? Даже у пьянчуги пришло новогоднее озарение кратковременное, чтобы понять, что творит'
    }
]

export default function BlogInner() {
    return (
        <main className="pt-[33px] pb-[100px] max-[425px]:pt-[20px] max-[425px]:pb-[40px]">
            <ContainerDefault>
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-white mb-[20px] max-[425px]:hidden">
                    <Link href="/" className="hover:text-yellow-500">Главная</Link>
                    <span>/</span>
                    <Link href="/news" className="hover:text-yellow-500">Новости</Link>
                    <span>/</span>
                    <span className='text-white'>Статья</span>
                </div>

                {/* Article Header */}
                <div className="mb-[40px] max-[425px]:mb-[20px]">
                    <h1 className="text-[48px] leading-[56px] font-russo-one text-white mb-[16px] max-[425px]:text-[20px] max-[425px]:leading-[24px] max-[425px]:mb-[12px]">
                        Заголовок новости заголовок новости заголовок новости заголовок новости
                    </h1>
                    <div className="flex items-center gap-[30px] text-white max-[425px]:gap-[16px]">
                        <span className="text-[16px] font-normal max-[425px]:text-[14px]">21.12.2024</span>
                        <div className="flex items-center gap-[8px]">
                            <span className="text-[16px] font-normal max-[425px]:text-[14px]">25 комментариев</span>
                        </div>
                    </div>
                </div>

                {/* Article Image */}
                <div className="relative w-full h-[400px] mb-[40px] max-[425px]:h-[208px] max-[425px]:mb-[20px]">
                    <Image
                        src={BlogImage}
                        alt="Article image"
                        fill
                        className="object-cover rounded-[4px]"
                    />
                </div>

                <h4 className='text-white text-[24px] leading-[32px] mb-[32px] font-bold max-[425px]:text-[16px] max-[425px]:leading-[24px] max-[425px]:mb-[20px]'>
                    Еще не вступив официально в должность американского президента, экспрессивный Дональд Трамп успел отметиться рядом громких, даже скандальных, заявлений. Он пообещал сделать Мексику и Канаду штатами США, если власти этих стран не решат проблемы с незаконной миграцией и наркотрафиком.
                </h4>

                {/* Article Content */}
                <div className="text-white text-[16px] md:text-[18px] leading-[1.6] space-y-[32px] mb-[60px] max-[425px]:text-[14px] max-[425px]:space-y-[20px] max-[425px]:mb-[40px]">
                    <p>
                        Затем Трамп добрался и до Европы, предложив Дании купить и включить в состав США самый большой остров в мире — Гренландию, входящую в состав королевства на правах автономии. За остров в Арктике Трамп предложил более миллиарда долларов.
                    </p>
                    <p>
                        К предложению Трампа, которое он уже озвучивал в свой первый президентский срок в 2019 году, отрицательно отнеслись как в руководстве Дании, так и Гренландии. При этом премьер-министр островной автономии, где проживает всего около 60 000 человек, Мутэ Эгеде заявил, что Гренландия должна стать независимым суверенным государством.
                    </p>
                    <p>
                        Между тем, планы Трампа по покупке Гренландии грозят катастрофическими последствиями для НАТО, считает автор статьи в американской газете The Hill колумнист Грегори Хадсон. По его мнению, присоединяя страна альянса прямо посягает на территориальную целостность союзного по военному блоку государства.
                    </p>

                    {/* Quote Block */}
                    <div className="relative flex items-start gap-[20px] bg-[#262F0D] p-[40px] mb-[32px] rounded-[4px] max-[425px]:p-[16px] max-[425px]:mb-[20px] max-[425px]:gap-[12px]">
                        <div className="absolute left-0 top-0 w-[8px] h-full bg-[#DA3D3D]" />
                        <Image
                            src={QuoteIcon}
                            alt="quote"
                            width={32}
                            height={24}
                            className="mb-[24px] max-[425px]:w-[24px] max-[425px]:h-[18px] max-[425px]:mb-[16px]"
                        />
                        <div>
                            <p className="text-white text-[20px] leading-[32px] font-semibold mb-[16px] italic max-[425px]:text-[16px] max-[425px]:leading-[24px] max-[425px]:mb-[12px]">
                                Избранный президент США Дональд Трамп запятнал репутацию американской знати, потребовав Гренландию — самоуправляемую, покрытую льдом датскую территорию, которая в три раза больше Техаса
                            </p>
                            <p className="text-white text-[20px] font-semibold italic max-[425px]:text-[16px]">
                                подчеркнул Уоллес
                            </p>
                        </div>
                    </div>

                    <p>
                        Похоже, Трамп настолько сильно хочет заполучить Гренландию, что, как бы безумно это ни звучало, он может начать экономическую войну или что-то похуже, чтобы получить её, считает автор статьи.
                    </p>

                    <p>
                        Такая война, даже экономическая, нарушила бы обязательства, которые США (и десятки других стран, включая Данию и Советский Союз) взяли на себя в Хельсинкских соглашениях 1975 года, которые установили границы Европы после Второй мировой войны. Это соглашение обязывает подписавшие его стороны воздерживаться от «любого требования или действия, направленного на захват или узурпацию части или всей территории любого из государств-участников».
                    </p>

                    <p>
                        Кроме того, «покупка» Гренландии Соединенными Штатами будет означать новый передел мира, что очень устраивает президента России Владимира Путина, который «намерен вернуть контроль над Восточной Европой», отмечает колумнист. Как говорят в таких случаях, не мы первые начали менять правила миропорядка.
                    </p>

                    <p>
                        Случись такое, Китай мог бы использовать захват Гренландии в качестве дополнительного оправдания для вторжения на Тайвань, указав на то, что США имеют такие же права на Гренландию, как и на собор Парижской Богоматери, а Тайвань когда-то был частью Китайской империи. В современную эпоху единственной страной, нарушившей суверенитет Дании, была гитлеровская Германия, а это не то государство, с которым Америка хотела бы ассоциироваться, предостерегает Трампа автор.
                    </p>
                </div>

                {/* Photo Section */}
                <div className="mb-[60px] max-[425px]:mb-[40px]">
                    <CategoryTitle title="Фото" />
                    <PhotoSlider photos={photos} />
                    <div className="text-white text-[16px] md:text-[18px] leading-[1.6] mt-[32px] max-[425px]:text-[14px] max-[425px]:mt-[20px]">
                        {/* Photo Slider */}

                        <div className="text-white text-[16px] md:text-[18px] leading-[1.6] space-y-[32px] mb-[60px]">
                            <p>
                                Описание к фотографиям  описание к фотографиям описание к фотографиям описание к фотографиям описание к фотографиям описание к фотографиям описание к фотографиям описание к фотографиям описание к фотографиям описание к фотографиям описание к фотографиям описание к фотографиям описание к фотографиям описание к фотографиям описание к фотографиям описание к фотографиям описание к фотографиям описание к фотографиям описание к фотографиям описание к фотографиям
                            </p>
                        </div>

                        {/* Video Section */}
                        <div className="mb-[60px] max-[425px]:mb-[40px]">
                            <CategoryTitle title="Видео" />
                            <div className="mb-[20px]">
                                <h3 className="text-white text-[24px] font-bold leading-[32px] max-[425px]:text-[20px]">
                                    Название видео
                                </h3>
                            </div>
                            <div className="relative w-[848px] h-[477px] max-[1024px]:w-full max-[425px]:h-[208px] bg-[#262F0D] rounded-[4px] overflow-hidden group cursor-pointer mb-[20px]">
                                <Image
                                    src={VideoImage}
                                    alt="Video thumbnail"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />

                            </div>
                            <div className="text-white text-[16px] md:text-[18px] leading-[1.6] space-y-[32px] mb-[60px]">
                                <p>
                                    Описание к фотографиям  описание к фотографиям описание к фотографиям описание к фотографиям описание к фотографиям описание к фотографиям описание к фотографиям описание к фотографиям описание к фотографиям описание к фотографиям описание к фотографиям описание к фотографиям описание к фотографиям описание к фотографиям описание к фотографиям описание к фотографиям описание к фотографиям описание к фотографиям описание к фотографиям описание к фотографиям
                                </p>
                            </div>
                            <span className='block text-white text-[16px] font-normal'>Автор</span>
                            <span className='block text-white text-[16px] font-semibold'>Арсений Петров</span>
                        </div>

                        {/* Comments Section */}
                        <Comments comments={comments} />
                    </div>
                </div>
            </ContainerDefault>
        </main>
    )
}

export const metadata = {
    title: 'Новости СВО | Статья',
    description: 'Актуальные новости СВО, хроника событий, аналитика и экспертные мнения. Следите за развитием специальной военной операции.',
    openGraph: {
        title: 'Новости СВО | Статья',
        description: 'Актуальные новости СВО, хроника событий, аналитика и экспертные мнения.',
        images: ['/banner.jpg'],
    }
}
