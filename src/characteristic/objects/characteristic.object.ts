import { Prisma } from '@prisma/client'

export const characteristicObject: Prisma.CharacteristicSelect = {
	id: true,
	title: true,
	description: true
}
