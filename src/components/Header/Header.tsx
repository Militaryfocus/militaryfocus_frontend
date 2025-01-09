'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import ContainerDefault from '../Containers/ContainerDefault'

// Img
import Logo from '@/assets/svg/logo.svg'

// Import Icons
import BurgerIcon from '@/assets/icons/burger-icon.svg'
import LoginIcon from '@/assets/icons/login-icon.svg'
import RegisterIcon from '@/assets/icons/register-icon.svg'
import SearchIcon from '@/assets/icons/search-icon.svg'
import { NavContent } from './Nav'

interface NavBarProps {
    isOpen: boolean
    setIsOpen: (value: boolean) => void
}

const NavBar = ({ isOpen, setIsOpen }: NavBarProps) => {
    return (
        <>
            {/* Desktop Navigation */}
            <div className='hidden lg:flex items-center gap-[40px] bg-[#C67B13]'>
                <ul className='flex max-w-[780px] mx-auto justify-center items-center gap-[40px] py-[20px]'>
                    {NavContent.map((item, index) => (
                        <li key={index}>
                            <Link href={item.href} className='text-white font-bold text-[16px]'>{item.title}</Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Mobile Menu */}
            <div className={`lg:hidden fixed inset-0 bg-[#080B0B] z-40 transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <ContainerDefault>
                    <div className='flex justify-between items-center py-[20px] max-[425px]:py-[13px]'>
                        <Link href="/" onClick={() => setIsOpen(false)}>
                            <Image
                                className='max-[425px]:w-[85px] max-[425px]:h-[34px] w-[110px] h-[46px]'
                                src={Logo}
                                alt="logo"
                                width={110}
                                height={46}
                            />
                        </Link>
                        <button
                            onClick={() => setIsOpen(false)}
                            className='w-[40px] h-[40px] rounded-full bg-[#C67B13] flex items-center justify-center'
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </ContainerDefault>

                <div className='pt-[40px] px-[20px]'>
                    {/* Mobile Search */}
                    <div className='relative mb-[30px]'>
                        <input
                            type="text"
                            placeholder="Поиск"
                            className='w-full bg-white border border-[#C67B13] rounded-[4px] px-[16px] pr-[40px] py-[8px] outline-none text-black font-semibold text-[14px]'
                        />
                        <Image
                            className='absolute right-[10px] top-[50%] translate-y-[-50%]'
                            src={SearchIcon}
                            alt="Search"
                            width={19}
                            height={18}
                        />
                    </div>

                    {/* Mobile Nav Links */}
                    <ul className='flex flex-col gap-[20px] mb-[30px]'>
                        {NavContent.map((item, index) => (
                            <li key={index}>
                                <Link
                                    href={item.href}
                                    className='text-white font-bold text-[18px]'
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.title}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Mobile Auth Links */}
                    <div className='flex flex-col gap-[20px]'>
                        <Link href="/" className='flex items-center gap-[8px] text-white font-semibold text-[16px]'>
                            <Image src={LoginIcon} alt="Login" width={24} height={24} />
                            Войти
                        </Link>
                        <Link href="/" className='flex items-center gap-[8px] text-white font-semibold text-[16px]'>
                            <Image src={RegisterIcon} alt="Register" width={24} height={24} />
                            Регистрация
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

const Header = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <header className='max-[1024px]:bg-[#080B0B]'>
            <ContainerDefault>
                <div className='flex justify-between items-center py-[20px] max-[425px]:py-[13px]'>
                    {/* Header Left */}
                    <div className='flex items-center gap-[20px] lg:gap-[40px]'>
                        <Link href="/">
                            <Image
                                className='max-[425px]:w-[85px] max-[425px]:h-[34px] w-[110px] h-[46px]'
                                src={Logo}
                                alt="logo"
                                width={110}
                                height={46}
                            />
                        </Link>
                        <div className='relative hidden lg:block'>
                            <input
                                type="text"
                                placeholder="Поиск"
                                className='bg-white border border-[#C67B13] rounded-[4px] w-[308px] px-[16px] pr-[40px] py-[8px] outline-none text-black font-semibold text-[14px]'
                            />
                            <Image
                                className='absolute right-[10px] top-[50%] translate-y-[-50%]'
                                src={SearchIcon}
                                alt="Search"
                                width={19}
                                height={18}
                            />
                        </div>
                    </div>

                    {/* Header Right */}
                    <div className='flex items-center gap-[38px]'>
                        {/* Desktop Auth Links */}
                        <div className='hidden lg:flex items-center gap-[38px]'>
                            <Link href="/" className='flex items-center gap-[8px] text-white font-semibold text-[14px]'>
                                <Image src={LoginIcon} alt="Login" width={24} height={24} />
                                Войти
                            </Link>
                            <Link href="/" className='flex items-center gap-[8px] text-white font-semibold text-[14px]'>
                                <Image src={RegisterIcon} alt="Register" width={24} height={24} />
                                Регистрация
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className='lg:hidden w-[40px] h-[40px] rounded-full bg-[#C67B13] flex items-center justify-center'
                        >
                            <Image src={BurgerIcon} alt="menu" width={16} height={8} />
                        </button>
                    </div>
                </div>
            </ContainerDefault>
            <NavBar isOpen={isOpen} setIsOpen={setIsOpen} />
        </header>
    )
}

export default Header
