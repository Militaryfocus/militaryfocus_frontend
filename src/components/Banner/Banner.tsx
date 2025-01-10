"use client"
import BannerBlogMobile from '@/assets/img/blog-banner-mobile.jpg'
import BannerBlog from '@/assets/img/blog-banner.png'
import { useEffect, useState } from 'react'
import ContainerDefault from '../Containers/ContainerDefault'

const Banner = () => {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 425)
        }

        handleResize() // Initial check
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <div
            className='w-full py-[90px] relative overflow-hidden bg-cover bg-center max-[425px]:py-[40px] max-[425px]:pb-[60px] mb-[74px] max-[425px]:mb-[40px] rounded-b-[10px]'
            style={{ backgroundImage: `url(${isMobile ? BannerBlogMobile.src : BannerBlog.src})` }}
        >
            <ContainerDefault>
                <div className='max-w-[770px]'>
                    <h1 className='text-[32px] md:text-[64px] max-[425px]:text-[32px] font-russo-one text-white mb-[16px] md:mb-[20px] max-[425px]:mb-[0px]'>
                        Военный блог
                    </h1>
                    <p className='text-white text-[16px] md:text-[24px] max-[425px]:text-[14px] font-semibold font-open-sans max-w-[770px]'>
                        Узнайте о последних разработках, вооружении и операциях, влияющих на мировую безопасность
                    </p>
                </div>
            </ContainerDefault>
        </div>
    )
}

export default Banner

