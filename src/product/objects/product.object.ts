import { Prisma } from '@prisma/client'
import { categoryObject } from 'src/category/objects/category.object'
import { characteristicObject } from 'src/characteristic/objects/characteristic.object'
import { reviewObjectUser } from 'src/review/objects/review.object'
import { subcategoryObject } from 'src/subcategory/objects/subcategory.object'

export const productObject: Prisma.ProductSelect = {
	id: true,
	name: true,
	slug: true,
	description: true,
	price: true,
	status: true,
	images: true,
	sizes: true,
	category: {
		select: categoryObject
	},
	subcategory: {
		select: subcategoryObject
	},
	reviews: {
		select: reviewObjectUser
	}
}

export const productObjectFullset: Prisma.ProductSelect = {
	...productObject,
	characteristics: {
		select: characteristicObject
	}
}
