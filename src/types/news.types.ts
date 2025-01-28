import { StaticImageData } from 'next/image'

export interface INews {
	id: number
	article_title: string
	article_image:string 
	article_link:string 
	date: string
	image: string | StaticImageData
}
