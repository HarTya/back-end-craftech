import { Prisma } from '@prisma/client'
import { userObject } from 'src/user/objects/user.object'

export const reviewObject: Prisma.ReviewSelect = {
	id: true,
	createdAt: true,
	rating: true,
	text: true
}

export const reviewObjectUser: Prisma.ReviewSelect = {
	...reviewObject,
	user: {
		select: userObject
	}
}
