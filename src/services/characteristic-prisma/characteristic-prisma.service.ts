import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { Characteristic } from '@prisma/client'
import { CharacteristicDto } from 'src/characteristic/dto/characteristic.dto'
import { PrismaService } from '../prisma/prisma.service'
import { ProductPrismaService } from '../product-prisma/product-prisma.service'

@Injectable()
export class CharacteristicPrismaService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly productPrisma: ProductPrismaService
	) {}

	private async validateCreateNewCharacteristic(
		productCharacteristics: Characteristic[],
		title: string
	) {
		const isCharacteristicExists = productCharacteristics.some(
			characteristic =>
				characteristic.title.toLowerCase() === title.toLowerCase().trim()
		)

		if (isCharacteristicExists)
			throw new BadRequestException('Характеристика з такою назвою вже існує')
	}

	async createNewCharacteristic(
		adminId: number,
		dto: CharacteristicDto,
		productId: number
	) {
		const { title, description } = dto

		const { characteristics } =
			await this.productPrisma.getUniqueProductByIdOrSlug(productId)

		await this.validateCreateNewCharacteristic(characteristics, title)

		return this.prisma.characteristic.create({
			data: {
				title: title.trim(),
				description: description.trim(),
				product: {
					connect: {
						id: productId
					}
				},
				admin: {
					connect: {
						id: adminId
					}
				}
			}
		})
	}

	private async validateDeleteExistCharacteristic(characteristicId: number) {
		const characteristic = await this.prisma.characteristic.findUnique({
			where: {
				id: characteristicId
			}
		})

		if (!characteristic)
			throw new NotFoundException('Характеристику не знайдено')
	}

	async deleteExistCharacteristic(characteristicId: number) {
		await this.validateDeleteExistCharacteristic(characteristicId)

		return this.prisma.characteristic.delete({
			where: {
				id: characteristicId
			}
		})
	}
}
