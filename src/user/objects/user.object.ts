import { Prisma } from '@prisma/client'

export const userObject: Prisma.UserSelect = {
	id: true,
	firstName: true,
	role: true,
	avatarPath: true
}
