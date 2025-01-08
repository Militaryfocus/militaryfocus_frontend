import ArrowLeft from '@/assets/icons/left-arrow-icon.svg'
import ArrowRight from '@/assets/icons/right-arrow-icon.svg'
import Image from 'next/image'

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const visiblePages = Array.from({ length: 10 }, (_, i) => i + 1)

    return (
        <div className="flex items-center justify-center gap-[8px] mt-[60px] bg-[#262F0D] py-[16px]">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-[40px] h-[40px] flex items-center justify-center text-white hover:text-[#C67B13] disabled:opacity-50 disabled:hover:text-white transition-colors"
            >
                <Image src={ArrowLeft} alt="arrow-left" width={28} height={20} />
            </button>

            {visiblePages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-[40px] h-[40px] flex items-center justify-center text-[20px] transition-colors
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
                className={`w-[40px] h-[40px] flex items-center justify-center text-[20px]
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
                className="w-[40px] h-[40px] flex items-center justify-center text-white hover:text-[#C67B13] disabled:opacity-50 disabled:hover:text-white transition-colors"
            >
                <Image src={ArrowRight} alt="arrow-right" width={28} height={20} />
            </button>
        </div>
    )
} 