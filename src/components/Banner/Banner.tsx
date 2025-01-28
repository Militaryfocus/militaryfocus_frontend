"use client"
import BannerBlogMobile from '@/assets/img/blog-banner-mobile.jpg'
import BannerBlog from '@/assets/img/blog-banner.png'
import { useEffect, useState } from 'react'
import ContainerDefault from '../Containers/ContainerDefault'

interface BannerProps {
    title: string
    description: string
}

const Banner = ({ title, description }: BannerProps) => {
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
            className='w-full py-[90px] relative overflow-hidden bg-cover bg-center max-[425px]:py-[40px] max-[425px]:pb-[60px] mb-[50px] max-[425px]:mb-[40px] rounded-b-[10px]'
            style={{ backgroundImage: `url(${isMobile ? BannerBlogMobile.src : BannerBlog.src})` }}
        >
            <ContainerDefault>
                <div className='max-w-[770px]'>
                    <h1 className='text-[32px] md:text-[64px] max-[425px]:text-[32px] font-russo-one text-white mb-[10px] md:mb-[0px] max-[425px]:mb-[0px]'>
                        {title}
                    </h1>
                    <p className='text-white text-[16px] md:text-[24px] max-[425px]:text-[14px] font-semibold font-open-sans max-w-[770px]'>
                        {description}
                    </p>
                </div>
            </ContainerDefault>
        </div>
    )
}

export default Banner

