import ArrowRight from '@/assets/icons/link-card-icon.svg'
import Image from 'next/image'
import Link from 'next/link'

interface LinkCardProps {
    title: string
}

const LinkCard = ({ title }: LinkCardProps) => {
    return (
        <Link href="/blogs" className="flex flex-col items-center justify-center w-full h-[220px] bg-[#ED9215] rounded-[4px] text-black text-[20px] font-russo-one hover:bg-[#c67b13] transition-colors max-[425px]:w-full max-[425px]:h-auto max-[425px]:flex-row max-[425px]:items-center max-[425px]:p-[20px] max-[425px]:gap-[8px]">
            <span className='mb-[16px] text-[24px] font-russo-one max-[425px]:mb-0 max-[425px]:text-[20px]'>{title}</span>
            <Image src={ArrowRight} alt={'icon'} width={24} height={24} />
        </Link>
    )
}

export default LinkCard