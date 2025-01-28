
interface CategoryTitleProps {
    title: string
}

export default function CategoryTitle({ title }: CategoryTitleProps) {
    return (
        <div className="flex justify-between items-center mb-[38px] max-[425px]:mb-[28px]">
            <h2 className="text-white text-[40px] font-russo-one max-[425px]:text-[20px]">{title}</h2>
        </div>
    )
} 