import Image from 'next/image'
import Link from 'next/link'
import ContainerDefault from '../Containers/ContainerDefault'

// Import Img
import Logo from '@/assets/svg/logo.svg'
import { NavContent } from '../Header/Nav'

const Footer = () => {
    return (
        <footer className="bg-[#0F100B] pt-[40px] pb-[48px]">
            <ContainerDefault>
                <div className="flex justify-between items-start">
                    <Link href="/">
                        <Image src={Logo} className='object-cover' alt="logo" width={110} height={40} />
                    </Link>

                    <ul className="flex flex-col gap-[20px]">
                        {
                            NavContent.map((item, index) => (
                                <li key={index}>
                                    <Link href={item.href} className='text-[#fff] text-[16px] font-normal leading-[21px]'>{item.title}</Link>
                                </li>
                            ))
                        }
                    </ul>

                    <div className="flex flex-col gap-[20px]">
                        <Link href="/" className='text-[#fff] text-[16px] font-normal leading-[21px]'>Пользовательское соглашение </Link>
                        <Link href="/" className='text-[#fff] text-[16px] font-normal leading-[21px]'>Политика конфиденциальности</Link>
                    </div>

                    <div className="flex flex-col gap-[20px]">
                        <p className='max-w-[310px] text-[#fff] text-[16px] font-normal leading-[21px]'>
                            Регистрационный номер СМИ ЭЛ № ФС??-?????, выдано ??.??.20?? г. Федеральной службой по надзору в сфере связи, информационных технологий и массовых коммуникаций (Роскомнадзор)
                        </p>
                    </div>
                </div>
            </ContainerDefault>
        </footer>
    )
}

export default Footer
