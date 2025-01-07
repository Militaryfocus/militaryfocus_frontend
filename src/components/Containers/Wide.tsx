interface ContainerProps {
    children: React.ReactNode
    className?: string
}

export default function Wide({ children, className = "" }: ContainerProps) {
    return (
        <div className={`mx-auto max-w-[1440px] bg-[#191B13] ${className}`}>
            {children}
        </div>
    )
} 