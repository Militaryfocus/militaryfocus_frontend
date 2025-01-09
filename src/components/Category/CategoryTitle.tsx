
interface CategoryTitleProps {
    title: string
}

export default function CategoryTitle({ title }: CategoryTitleProps) {
    return (
        <div className="flex justify-between items-center mb-[20px]">
            <h2 className="text-white text-[32px] font-russo-one">{title}</h2>
        </div>
    )
} 