import { Prisma } from '@prisma/client'
import { subcategoryObject } from 'src/subcategory/objects/subcategory.object'

export const categoryObject: Prisma.CategorySelect = {
	id: true,
	name: true,
	slug: true,
	subcategories: {
		select: subcategoryObject
	}
}
