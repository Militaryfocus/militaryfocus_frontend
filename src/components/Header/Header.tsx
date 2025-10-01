'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { FiSearch, FiMenu, FiX, FiLogIn, FiUserPlus, FiBell, FiSettings, FiUser } from 'react-icons/fi'
import ContainerDefault from '../Containers/ContainerDefault'
import ThemeToggle from '../Theme/ThemeToggle'
import { NavContent } from './Nav'
import { useAuth } from '@/hooks/useApi'
import AuthModal from '../Auth/AuthModal'
import UserProfile from '../Auth/UserProfile'

// Img
import Logo from '@/assets/svg/logo.svg'

interface NavBarProps {
    isOpen: boolean
    setIsOpen: (value: boolean) => void
    isAuthenticated: boolean
    onAuthClick: (mode: 'login' | 'register') => void
    onProfileOpen: () => void
}

const NavBar = ({ isOpen, setIsOpen, isAuthenticated, onAuthClick, onProfileOpen }: NavBarProps) => {
    return (
        <>
            {/* Desktop Navigation */}
            <div className='hidden lg:block'>
                <div className='bg-gradient-military backdrop-blur-md border-t border-white/10'>
                    <ContainerDefault>
                        <nav className='flex items-center justify-center py-4'>
                            <ul className='flex items-center gap-8'>
                                {NavContent.map((item, index) => (
                                    <li key={index}>
                                        <Link 
                                            href={item.href} 
                                            className='text-white font-medium text-sm hover:text-yellow-300 transition-colors duration-200 relative group'
                                        >
                                            {item.title}
                                            <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-300 transition-all duration-200 group-hover:w-full'></span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </ContainerDefault>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${
                isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}>
                {/* Backdrop */}
                <div 
                    className='absolute inset-0 bg-black/80 backdrop-blur-sm'
                    onClick={() => setIsOpen(false)}
                />
                
                {/* Menu Panel */}
                <div className={`absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-gradient-to-b from-gray-900/95 to-gray-800/95 backdrop-blur-xl border-l border-white/10 transform transition-transform duration-300 ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                    <div className='p-6'>
                        {/* Header */}
                        <div className='flex items-center justify-between mb-8'>
                            <Link href="/" onClick={() => setIsOpen(false)}>
                                <Image
                                    className='w-24 h-10'
                                    src={Logo}
                                    alt="Military Focus"
                                    width={96}
                                    height={40}
                                />
                            </Link>
                            <button
                                onClick={() => setIsOpen(false)}
                                className='w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200'
                            >
                                <FiX className='w-5 h-5 text-white' />
                            </button>
                        </div>

                        {/* Mobile Search */}
                        <div className='relative mb-8'>
                            <div className='relative'>
                                <FiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                                <input
                                    type="text"
                                    placeholder="Поиск новостей..."
                                    className='w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                                />
                            </div>
                        </div>

                        {/* Mobile Nav Links */}
                        <nav className='mb-8'>
                            <ul className='space-y-4'>
                                {NavContent.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            href={item.href}
                                            className='block text-white font-medium text-lg hover:text-yellow-300 transition-colors duration-200 py-2'
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {item.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* Mobile Auth Links */}
                        <div className='space-y-4 border-t border-white/10 pt-6'>
                            {isAuthenticated ? (
                                <>
                                    <button
                                        onClick={() => {
                                            onProfileOpen()
                                            setIsOpen(false)
                                        }}
                                        className='flex items-center gap-3 text-white font-medium hover:text-yellow-300 transition-colors duration-200 w-full text-left'
                                    >
                                        <FiUser className='w-5 h-5' />
                                        Профиль
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => {
                                            onAuthClick('login')
                                            setIsOpen(false)
                                        }}
                                        className='flex items-center gap-3 text-white font-medium hover:text-yellow-300 transition-colors duration-200 w-full text-left'
                                    >
                                        <FiLogIn className='w-5 h-5' />
                                        Войти
                                    </button>
                                    <button
                                        onClick={() => {
                                            onAuthClick('register')
                                            setIsOpen(false)
                                        }}
                                        className='flex items-center gap-3 text-white font-medium hover:text-yellow-300 transition-colors duration-200 w-full text-left'
                                    >
                                        <FiUserPlus className='w-5 h-5' />
                                        Регистрация
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const Header = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [authModalOpen, setAuthModalOpen] = useState(false)
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
    const [profileOpen, setProfileOpen] = useState(false)

    const { user, isAuthenticated } = useAuth()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleAuthClick = (mode: 'login' | 'register') => {
        setAuthMode(mode)
        setAuthModalOpen(true)
    }

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
                isScrolled 
                    ? 'bg-black/80 backdrop-blur-md border-b border-white/10' 
                    : 'bg-transparent'
            }`}>
                <ContainerDefault>
                    <div className='flex items-center justify-between py-4'>
                        {/* Header Left */}
                        <div className='flex items-center gap-6'>
                            <Link href="/" className='flex-shrink-0'>
                                <Image
                                    className='w-28 h-12 hover:scale-105 transition-transform duration-200'
                                    src={Logo}
                                    alt="Military Focus"
                                    width={112}
                                    height={48}
                                />
                            </Link>
                            
                            {/* Desktop Search */}
                            <div className='hidden lg:block relative'>
                                <div className='relative group'>
                                    <FiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-200' />
                                    <input
                                        type="text"
                                        placeholder="Поиск новостей СВО..."
                                        className='w-80 pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-white/15'
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Header Right */}
                        <div className='flex items-center gap-4'>
                            {/* Desktop Actions */}
                            <div className='hidden lg:flex items-center gap-4'>
                                {/* Notifications */}
                                <button className='relative p-2 text-white hover:text-yellow-300 transition-colors duration-200'>
                                    <FiBell className='w-5 h-5' />
                                    <span className='absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full'></span>
                                </button>

                                {/* Settings */}
                                <button className='p-2 text-white hover:text-yellow-300 transition-colors duration-200'>
                                    <FiSettings className='w-5 h-5' />
                                </button>

                                {/* Theme Toggle */}
                                <ThemeToggle />

                                {/* Auth Buttons */}
                                {isAuthenticated ? (
                                    <div className='flex items-center gap-2'>
                                        <button
                                            onClick={() => setProfileOpen(true)}
                                            className='flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200'
                                        >
                                            <div className='w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-green-900 text-xs font-bold'>
                                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <span className='text-white text-sm font-medium'>
                                                {user?.name || 'Пользователь'}
                                            </span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className='flex items-center gap-2'>
                                        <button
                                            onClick={() => handleAuthClick('login')}
                                            className='flex items-center gap-2 px-3 py-2 text-white hover:text-yellow-300 transition-colors duration-200'
                                        >
                                            <FiLogIn className='w-4 h-4' />
                                            <span className='text-sm font-medium'>Войти</span>
                                        </button>
                                        <button
                                            onClick={() => handleAuthClick('register')}
                                            className='flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-green-900 rounded-lg transition-all duration-200'
                                        >
                                            <FiUserPlus className='w-4 h-4' />
                                            <span className='text-sm font-medium'>Регистрация</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className='lg:hidden p-2 text-white hover:text-yellow-300 transition-colors duration-200'
                            >
                                {isOpen ? <FiX className='w-6 h-6' /> : <FiMenu className='w-6 h-6' />}
                            </button>
                        </div>
                    </div>
                </ContainerDefault>
            </header>

            {/* Navigation */}
            <NavBar 
                isOpen={isOpen} 
                setIsOpen={setIsOpen}
                isAuthenticated={isAuthenticated}
                onAuthClick={handleAuthClick}
                onProfileOpen={() => setProfileOpen(true)}
            />

            {/* Auth Modal */}
            <AuthModal
                isOpen={authModalOpen}
                onClose={() => setAuthModalOpen(false)}
                mode={authMode}
                onModeChange={setAuthMode}
            />

            {/* User Profile Modal */}
            <UserProfile
                isOpen={profileOpen}
                onClose={() => setProfileOpen(false)}
            />
        </>
    )
}

export default Header