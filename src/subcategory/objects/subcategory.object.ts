import { Prisma } from '@prisma/client'

export const subcategoryObject: Prisma.SubcategorySelect = {
	id: true,
	name: true,
	slug: true
}

export const subcategoryObjectCategory: Prisma.SubcategorySelect = {
	...subcategoryObject,
	category: {
		select: {
			id: true,
			name: true,
			slug: true
		}
	}
}
