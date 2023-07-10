import { Prisma } from '@prisma/client'
import { productObject } from 'src/product/objects/product.object'

export const orderObject: Prisma.OrderSelect = {
	id: true,
	createdAt: true,
	pickupType: true,
	day: true,
	time: true,
	city: true,
	postOfficeNumber: true,
	items: {
		select: {
			id: true,
			size: true,
			quantity: true,
			price: true,
			product: {
				select: productObject
			}
		}
	},
	total: true,
	comment: true,
	phone: true,
	lastName: true,
	firstName: true,
	userId: true
}
