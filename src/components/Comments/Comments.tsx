"use client"
import Image from 'next/image'
import { useState } from 'react'

// Import Icons
import ArrowDown from '@/assets/icons/arrow-down-icon.svg'
import UserIcon from '@/assets/icons/comment-user-img.svg'

interface Comment {
    id: number
    author: string
    date: string
    text: string
    replies?: Comment[]
    replyTo?: string
}

interface CommentsProps {
    comments: Comment[]
}

interface CommentActionsProps {
    hasReplies: boolean
    isReply: boolean
    isExpanded: boolean
    comment: Comment
    toggleReplies: (commentId: number) => void
}

export default function Comments({ comments }: CommentsProps) {
    const [commentText, setCommentText] = useState('')
    const [showReplies, setShowReplies] = useState<number[]>([])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setCommentText('')
    }

    const toggleReplies = (commentId: number) => {
        setShowReplies(prev =>
            prev.includes(commentId)
                ? prev.filter(id => id !== commentId)
                : [...prev, commentId]
        )
    }

    const CommentItem = ({ comment, isReply = false }: { comment: Comment, isReply?: boolean }) => {
        const hasReplies = Boolean(comment.replies && comment.replies.length > 0)
        const isExpanded = showReplies.includes(comment.id)

        return (
            <div className="relative">
                <div className={`${isReply ? 'pl-[24px] max-[425px]:pl-[0px]' : ''}`}>
                    {/* Desktop Layout */}
                    <div className="hidden md:flex gap-[12px]">
                        <div className="flex-shrink-0 w-[94px] h-[94px] bg-[#262F0D] rounded-full flex items-center justify-center">
                            <Image
                                src={UserIcon}
                                alt="User"
                                width={94}
                                height={94}
                            />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-[12px] mb-[8px]">
                                <span className="text-white text-[16px] font-semibold">
                                    {comment.author}
                                </span>
                                <span className="text-white text-[14px]">
                                    {comment.date}
                                </span>
                            </div>
                            <p className={`text-white text-[16px] leading-[24px] mb-[12px] ${isReply ? 'border-l-2 border-[#DA3D3D] pl-[5px]' : ''}`}>
                                {comment.text}
                            </p>
                            <CommentActions hasReplies={hasReplies} isReply={isReply} isExpanded={isExpanded} comment={comment} toggleReplies={toggleReplies} />
                        </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className={`flex flex-col md:hidden ${isReply ? 'max-[425px]:border-l-2 max-[425px]:border-[#DA3D3D] max-[425px]:pl-[5px]' : ''}`}>
                        <div className={`flex items-center gap-[12px] mb-[12px]`}>
                            <div className="flex-shrink-0 w-[48px] h-[48px] bg-[#262F0D] rounded-full flex items-center justify-center">
                                <Image
                                    src={UserIcon}
                                    alt="User"
                                    width={48}
                                    height={48}
                                />
                            </div>
                            <div>
                                <span className="block text-white text-[16px] font-semibold">
                                    {comment.author}
                                </span>
                                <span className="block text-white text-[14px]">
                                    {comment.date}
                                </span>
                            </div>
                        </div>
                        <div>
                            <p className={`text-white text-[16px] leading-[24px] mb-[12px] ${isReply ? 'border-l-2 border-[#DA3D3D] pl-[5px] max-[425px]:pl-[0px] max-[425px]:border-l-0' : ''}`}>
                                {comment.text}
                            </p>
                            <CommentActions hasReplies={hasReplies} isReply={isReply} isExpanded={isExpanded} comment={comment} toggleReplies={toggleReplies} />
                        </div>
                    </div>
                </div>

                {/* Replies */}
                {hasReplies && !isReply && isExpanded && (
                    <div className="mt-[24px] space-y-[24px]">
                        {comment.replies?.map((reply) => (
                            <CommentItem key={reply.id} comment={reply} isReply={true} />
                        ))}
                    </div>
                )}
            </div>
        )
    }

    const CommentActions = ({ hasReplies, isReply, isExpanded, comment, toggleReplies }: CommentActionsProps) => (
        <div className="flex items-center gap-[16px] max-[425px]:flex-row-reverse max-[425px]:justify-between">
            <button className="text-white text-[14px] font-semibold hover:text-[#ec6a0ec9] max-[425px]:text-[#EC6A0E]">
                Ответить
            </button>
            {hasReplies && !isReply && (
                <button
                    onClick={() => toggleReplies(comment.id)}
                    className="flex items-center gap-[8px] text-[#EC6A0E] text-[14px] font-semibold hover:text-[#ec6a0ec9] transition-colors"
                >
                    <span>{isExpanded ? 'Скрыть' : `Ответы (${comment.replies?.length})`}</span>
                    <Image
                        src={ArrowDown}
                        alt="arrow"
                        width={12}
                        height={12}
                        className={`transition-transform text-[#EC6A0E] ${isExpanded ? 'rotate-180' : ''}`}
                    />
                </button>
            )}
        </div>
    )

    return (
        <div className="mb-[60px]">
            {/* Comments Count */}
            <div className="flex items-center gap-[8px] mb-[20px]">
                <h2 className="text-white text-[24px] max-[425px]:text-[20px] font-bold">
                    {comments.length}
                </h2>
                <span className="text-white text-[24px] max-[425px]:text-[20px] font-bold">комментариев</span>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="mb-[40px] relative h-[160px]">
                <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Комментировать"
                    className="w-full min-h-[160px] bg-[#262F0D] text-white text-[16px] p-[16px] rounded-[4px] resize-none outline-none placeholder:text-[#8B8B8B] mb-[16px] border border-transparent focus:border-[#ED9215] transition-colors"
                />
                <div className="flex justify-end absolute right-[20px] bottom-[20px]">
                    <button
                        type="submit"
                        className="bg-[#EC6A0E] text-white text-[14px] font-semibold h-[29px] px-[24px] rounded-[8px] hover:bg-[#c67b13] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!commentText.trim()}
                    >
                        Отправить
                    </button>
                </div>
            </form>

            {/* Comments List */}
            <div className="space-y-[24px]">
                {comments.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                ))}
            </div>
        </div>
    )
} 