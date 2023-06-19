import { Injectable } from '@nestjs/common'
import { CharacteristicPrismaService } from 'src/services/characteristic-prisma/characteristic-prisma.service'
import { CharacteristicDto } from './dto/characteristic.dto'

@Injectable()
export class CharacteristicService {
	constructor(
		private readonly characteristicPrisma: CharacteristicPrismaService
	) {}

	/* createCharacteristic Method */

	async createCharacteristic(
		adminId: number,
		dto: CharacteristicDto,
		productId: number
	) {
		return this.characteristicPrisma.createNewCharacteristic(
			adminId,
			dto,
			productId
		)
	}

	/* deleteCharacteristic Method */

	async deleteCharacteristic(characteristicId: number) {
		return this.characteristicPrisma.deleteExistCharacteristic(characteristicId)
	}
}
