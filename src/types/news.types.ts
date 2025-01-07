import { StaticImageData } from 'next/image'

export interface INews {
	id: number
	title: string
	views: number
	comments: number
	date: string
	image: string | StaticImageData
}
