import Image from 'next/image'
import Link from 'next/link'
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiRss } from 'react-icons/fi'
import ContainerDefault from '../Containers/ContainerDefault'

// Import Img
import Logo from '@/assets/svg/logo.svg'
import { NavContent } from '../Header/Nav'

const Footer = () => {
    const currentYear = new Date().getFullYear()

    const socialLinks = [
        { icon: FiFacebook, href: '#', label: 'Facebook' },
        { icon: FiTwitter, href: '#', label: 'Twitter' },
        { icon: FiInstagram, href: '#', label: 'Instagram' },
        { icon: FiYoutube, href: '#', label: 'YouTube' },
        { icon: FiRss, href: '#', label: 'RSS' },
    ]

    const quickLinks = [
        { title: 'О нас', href: '/about' },
        { title: 'Контакты', href: '/contacts' },
        { title: 'Реклама', href: '/advertising' },
        { title: 'Вакансии', href: '/careers' },
    ]

    const legalLinks = [
        { title: 'Пользовательское соглашение', href: '/terms' },
        { title: 'Политика конфиденциальности', href: '/privacy' },
        { title: 'Правила использования', href: '/rules' },
        { title: 'Обратная связь', href: '/feedback' },
    ]

    return (
        <footer className="relative bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-xl border-t border-white/10">
            {/* Background Pattern */}
            <div className="absolute inset-0 military-pattern opacity-20"></div>
            
            <ContainerDefault>
                <div className="relative z-10">
                    {/* Main Footer Content */}
                    <div className="py-16">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                            {/* Brand Section */}
                            <div className="lg:col-span-1">
                                <Link href="/" className="inline-block mb-6">
                                    <Image 
                                        src={Logo} 
                                        className="w-32 h-14 hover:scale-105 transition-transform duration-200" 
                                        alt="Military Focus" 
                                        width={128} 
                                        height={56} 
                                    />
                                </Link>
                                
                                <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-sm">
                                    Следите за хроникой событий СВО от непосредственного участника! 
                                    Новости, аналитика и личный опыт — только проверенная информация из первых рук.
                                </p>

                                {/* Contact Info */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-gray-300 text-sm">
                                        <FiMail className="w-4 h-4 text-blue-400" />
                                        <span>info@militaryfocus.ru</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-300 text-sm">
                                        <FiPhone className="w-4 h-4 text-blue-400" />
                                        <span>+7 (800) 123-45-67</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-300 text-sm">
                                        <FiMapPin className="w-4 h-4 text-blue-400" />
                                        <span>Москва, Россия</span>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Links */}
                            <div>
                                <h3 className="text-white font-russo text-lg mb-6">Навигация</h3>
                                <ul className="space-y-3">
                                    {NavContent.map((item, index) => (
                                        <li key={index}>
                                            <Link 
                                                href={item.href} 
                                                className="text-gray-300 hover:text-yellow-300 transition-colors duration-200 text-sm"
                                            >
                                                {item.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Quick Links */}
                            <div>
                                <h3 className="text-white font-russo text-lg mb-6">Быстрые ссылки</h3>
                                <ul className="space-y-3">
                                    {quickLinks.map((item, index) => (
                                        <li key={index}>
                                            <Link 
                                                href={item.href} 
                                                className="text-gray-300 hover:text-yellow-300 transition-colors duration-200 text-sm"
                                            >
                                                {item.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>

                                {/* Newsletter Subscription */}
                                <div className="mt-8">
                                    <h4 className="text-white font-medium mb-3">Подписка на новости</h4>
                                    <div className="flex gap-2">
                                        <input
                                            type="email"
                                            placeholder="Ваш email"
                                            className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-medium">
                                            Подписаться
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Legal & Social */}
                            <div>
                                <h3 className="text-white font-russo text-lg mb-6">Правовая информация</h3>
                                <ul className="space-y-3 mb-8">
                                    {legalLinks.map((item, index) => (
                                        <li key={index}>
                                            <Link 
                                                href={item.href} 
                                                className="text-gray-300 hover:text-yellow-300 transition-colors duration-200 text-sm"
                                            >
                                                {item.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>

                                {/* Social Media */}
                                <div>
                                    <h4 className="text-white font-medium mb-4">Мы в соцсетях</h4>
                                    <div className="flex gap-3">
                                        {socialLinks.map((social, index) => (
                                            <Link
                                                key={index}
                                                href={social.href}
                                                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                                                aria-label={social.label}
                                            >
                                                <social.icon className="w-5 h-5 text-gray-300 hover:text-white" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-white/10 py-6">
                        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                            <div className="text-gray-400 text-sm text-center lg:text-left">
                                <p>
                                    © {currentYear} Military Focus. Все права защищены.
                                </p>
                                <p className="mt-1">
                                    Регистрационный номер СМИ ЭЛ № ФС77-12345, выдано 01.01.2024 г. 
                                    Федеральной службой по надзору в сфере связи, информационных технологий и массовых коммуникаций (Роскомнадзор)
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-6 text-gray-400 text-sm">
                                <span>Сделано с ❤️ для России</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span>Онлайн</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ContainerDefault>
        </footer>
    )
}

export default Footer