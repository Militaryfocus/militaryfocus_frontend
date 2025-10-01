import { StaticImageData } from 'next/image'

export interface INews {
	id: number
	article_title: string
	article_image: string 
	article_link: string 
	date: string
	image: string | StaticImageData
}

// Интерфейс для ответа API
export interface IApiResponse {
	articles: INews[]
	totalPages?: number
	currentPage?: number
}

// Интерфейс для создания/обновления статьи
export interface IArticleData {
	title: string
	content: string
}
