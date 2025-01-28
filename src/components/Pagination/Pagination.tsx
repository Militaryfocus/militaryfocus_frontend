import ArrowLeft from '@/assets/icons/left-arrow-icon.svg'
import ArrowLeftMobile from '@/assets/icons/left-arrow-mobile-icon.svg'
import ArrowRight from '@/assets/icons/right-arrow-icon.svg'
import ArrowRightMobile from '@/assets/icons/right-arrow-mobile-icon.svg'
import Image from 'next/image'

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const visiblePages = Array.from({ length: 5 }, (_, i) => i + 1)

    return (
        <div className="flex items-center justify-center gap-[8px] mt-[60px] bg-[#262F0D] py-[16px] relative max-[550px]:px-[40px]">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-[40px] h-[40px] flex items-center justify-center text-white hover:text-[#C67B13] disabled:opacity-50 disabled:hover:text-white transition-colors max-[550px]:hidden"
            >
                <Image src={ArrowLeft} alt="arrow-left" width={28} height={20} />
            </button>

            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="absolute left-0 w-[40px] h-[40px] hidden items-center justify-center text-white hover:text-[#C67B13] disabled:opacity-50 disabled:hover:text-white transition-colors max-[550px]:flex max-[550px]:bg-[#ED9215] max-[550px]:h-[72px] max-[550px]:rounded-tl-[4px] max-[550px]:rounded-bl-[4px]"
            >
                <Image src={ArrowLeftMobile} alt="arrow-left" width={8} height={18} />
            </button>

            {visiblePages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-[40px] h-[40px] flex items-center justify-center text-[20px] transition-colors max-[550px]:text-[12px]
                        ${currentPage === page
                            ? 'text-[#C67B13]'
                            : 'text-white hover:text-[#C67B13]'
                        }`}
                >
                    {page}
                </button>
            ))}

            <span className="text-white text-[20px]">...</span>

            <button
                onClick={() => onPageChange(254)}
                className={`w-[40px] h-[40px] flex items-center justify-center text-[20px] max-[550px]:text-[12px]
                    ${currentPage === 254
                        ? 'text-[#C67B13]'
                        : 'text-white hover:text-[#C67B13]'
                    }`}
            >
                254
            </button>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-[40px] h-[40px] flex items-center justify-center text-white hover:text-[#C67B13] disabled:opacity-50 disabled:hover:text-white transition-colors max-[550px]:hidden"
            >
                <Image src={ArrowRight} alt="arrow-right" width={28} height={20} />
            </button>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="absolute right-0 w-[40px] h-[40px] hidden items-center justify-center text-white hover:text-white disabled:opacity-50 disabled:hover:text-white transition-colors max-[550px]:flex max-[550px]:bg-[#ED9215] max-[550px]:h-[72px] max-[550px]:rounded-tr-[4px] max-[550px]:rounded-br-[4px]"
            >
                <Image src={ArrowRightMobile} alt="arrow-right" width={8} height={18} />
            </button>
        </div>
    )
} 