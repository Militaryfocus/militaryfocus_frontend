import Image from 'next/image'
import Link from 'next/link'
import ContainerDefault from '../Containers/ContainerDefault'

// Img
import Logo from '@/assets/svg/logo.svg'
// Import Icons
import LoginIcon from '@/assets/icons/login-icon.svg'
import RegisterIcon from '@/assets/icons/register-icon.svg'
import SearchIcon from '@/assets/icons/search-icon.svg'
import { NavContent } from './Nav'

const NavBar = () => {
    return (
        <div className='flex items-center gap-[40px] bg-[#C67B13]'>
            <ul className='flex max-w-[780px] mx-auto justify-center items-center gap-[40px] py-[20px]'>
                {
                    NavContent.map((item, index) => (
                        <li key={index}>
                            <Link href={item.href} className='text-white font-bold text-[16px]'>{item.title}</Link>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

const Header = () => {
    return (
        <header>
            <ContainerDefault>
                <div className='flex justify-between items-center py-[20px]'>
                    {/* Header Left */}
                    <div className='flex items-center gap-[40px]'>
                        <Link href="/">
                            <Image src={Logo} alt="logo" width={110} height={46} />
                        </Link>
                        <div className='relative'>
                            <input type="text" placeholder="Поиск" className='bg-white border border-[#C67B13] rounded-[4px] w-[308px] px-[16px] pr-[40px] py-[8px] outline-none text-black font-semibold text-[14px]' />
                            <Image className='absolute right-[10px] top-[50%] translate-y-[-50%]' src={SearchIcon} alt="Search" width={19} height={18} />
                        </div>
                    </div>

                    {/* Header Right */}
                    <div className='flex items-center gap-[38px]'>
                        <Link href="/" className='flex items-center gap-[8px] text-white font-semibold text-[14px]'>
                            <Image src={LoginIcon} alt="Login" width={24} height={24} />
                            Войти
                        </Link>
                        <Link href="/" className='flex items-center gap-[8px] text-white font-semibold text-[14px]'>
                            <Image src={RegisterIcon} alt="Register" width={24} height={24} />
                            Регистрация
                        </Link>
                    </div>
                </div>
            </ContainerDefault>
            <NavBar />
        </header>
    )
}

export default Header
