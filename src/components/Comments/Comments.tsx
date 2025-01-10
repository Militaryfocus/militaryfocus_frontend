"use client"
import Image from 'next/image'
import { useState } from 'react'

// Import Icons
import ArrowDown from '@/assets/icons/arrow-down-icon.svg'
import UserIcon from '@/assets/icons/user-icon.svg'

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
        const hasReplies = comment.replies && comment.replies.length > 0
        const isExpanded = showReplies.includes(comment.id)

        return (
            <div className="relative">
                <div className={`flex gap-[12px] ${isReply ? 'border-l-2 border-[#ED9215] pl-[24px]' : ''}`}>
                    <div className="flex-shrink-0 w-[48px] h-[48px] bg-[#262F0D] rounded-full flex items-center justify-center">
                        <Image
                            src={UserIcon}
                            alt="User"
                            width={24}
                            height={24}
                            className="opacity-50"
                        />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-[12px] mb-[8px]">
                            <span className="text-white text-[16px] font-semibold">
                                {comment.author}
                            </span>
                            <span className="text-[#8B8B8B] text-[14px]">
                                {comment.date}
                            </span>
                            {comment.replyTo && (
                                <>
                                    <span className="text-[#8B8B8B] text-[14px]">
                                        в ответ
                                    </span>
                                    <span className="text-[#ED9215] text-[14px]">
                                        {comment.replyTo}
                                    </span>
                                </>
                            )}
                        </div>
                        <p className="text-white text-[16px] leading-[24px] mb-[12px]">
                            {comment.text}
                        </p>
                        <div className="flex items-center gap-[16px]">
                            <button className="text-[#ED9215] text-[14px] font-semibold hover:text-[#c67b13] transition-colors">
                                Ответить
                            </button>
                            {hasReplies && !isReply && (
                                <button
                                    onClick={() => toggleReplies(comment.id)}
                                    className="flex items-center gap-[8px] text-[#ED9215] text-[14px] font-semibold hover:text-[#c67b13] transition-colors"
                                >
                                    <span>{isExpanded ? 'Скрыть' : `Ответы (${comment.replies?.length})`}</span>
                                    <Image
                                        src={ArrowDown}
                                        alt="arrow"
                                        width={12}
                                        height={12}
                                        className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                    />
                                </button>
                            )}
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

    return (
        <div className="mb-[60px]">
            {/* Comments Count */}
            <div className="flex items-center gap-[8px] mb-[20px]">
                <h2 className="text-white text-[24px] font-bold">
                    {comments.length}
                </h2>
                <span className="text-white text-[24px] font-bold">комментариев</span>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="mb-[40px]">
                <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Комментировать"
                    className="w-full min-h-[120px] bg-[#262F0D] text-white text-[16px] p-[16px] rounded-[4px] resize-none outline-none placeholder:text-[#8B8B8B] mb-[16px] border border-transparent focus:border-[#ED9215] transition-colors"
                />
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-[#ED9215] text-white text-[14px] font-semibold h-[29px] px-[24px] rounded-full hover:bg-[#c67b13] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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