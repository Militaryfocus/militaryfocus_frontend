interface ContainerProps {
    children: React.ReactNode
    className?: string
}

export default function ContainerDefault({ children, className = "" }: ContainerProps) {
    return (
        <div className={`mx-auto max-w-[1280px] px-4 ${className}`}>
            {children}
        </div>
    )
} 