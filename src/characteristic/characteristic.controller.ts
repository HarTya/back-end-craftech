import {
	Body,
	Controller,
	Delete,
	HttpCode,
	Param,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { CharacteristicService } from './characteristic.service'
import { CharacteristicDto } from './dto/characteristic.dto'

@Controller('characteristics')
export class CharacteristicController {
	constructor(private readonly characteristicService: CharacteristicService) {}

	/* createCharacteristic */

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth('ADMIN')
	@Post('add/:productId')
	async createCharacteristic(
		@CurrentUser('id') adminId: number,
		@Body() dto: CharacteristicDto,
		@Param('productId') productId: string
	) {
		return this.characteristicService.createCharacteristic(
			adminId,
			dto,
			+productId
		)
	}

	/* deleteCharacteristic */

	@HttpCode(200)
	@Auth('ADMIN')
	@Delete(':id')
	async deleteCharacteristic(@Param('id') id: string) {
		return this.characteristicService.deleteCharacteristic(+id)
	}
}
