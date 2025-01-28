import Image from 'next/image'
import Link from 'next/link'

// Import Img
import Logo from '@/assets/svg/logo.svg'
import { NavContent } from '../Header/Nav'

const MobileFooter = () => {
    return (
        <div className="flex flex-col gap-[40px]">

            <div className='flex justify-between'>
                {/* Navigation Links */}
                <div className="flex flex-col gap-[20px] max-[425px]:gap-[30px]">
                    {NavContent.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className='text-[#fff] text-[16px] font-normal leading-[21px] max-[425px]:text-[14px] max-[425px]:font-bold'
                        >
                            {item.title}
                        </Link>
                    ))}
                </div>

                {/* Logo and Info */}
                <div className="flex flex-col justify-between gap-[20px] max-[425px]:w-[150px]">
                    <div className="flex flex-col gap-[20px]">
                        <Link href="/" className='text-[#fff] text-[16px] font-normal leading-[21px] max-[425px]:text-[14px]'>
                            Пользовательское соглашение
                        </Link>
                        <Link href="/" className='text-[#fff] text-[16px] font-normal leading-[21px] max-[425px]:text-[14px]'>
                            Политика конфиденциальности
                        </Link>
                    </div>

                    <Link href="/">
                        <Image src={Logo} className='object-cover' alt="logo" width={110} height={40} />
                    </Link>
                </div>
            </div>



            {/* Legal Links */}


            <p className='text-[#fff] text-[16px] font-normal leading-[21px] max-[425px]:text-[12px]'>
                Регистрационный номер СМИ ЭЛ № ФС??-?????, выдано ??.??.20?? г. Федеральной службой по надзору в сфере связи, информационных технологий и массовых коммуникаций (Роскомнадзор)
            </p>
        </div>
    )
}

export default MobileFooter 