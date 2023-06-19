import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { PasswordDto } from './dto/password.dto'
import { ProfileDto } from './dto/profile.dto'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	/* getProfile */

	@Auth()
	@Get('profile')
	async getProfile(@CurrentUser('id') id: number) {
		return this.userService.getProfile(id)
	}

	/* updateProfile */

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Put('profile')
	async updateProfile(@CurrentUser('id') id: number, @Body() dto: ProfileDto) {
		return this.userService.updateProfile(id, dto)
	}

	/* changePassword */

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Post('profile/password')
	async changePassword(
		@CurrentUser('id') id: number,
		@Body() dto: PasswordDto
	) {
		return this.userService.changePassword(id, dto)
	}

	/* toggleFavorite */

	@HttpCode(200)
	@Auth()
	@Patch('profile/favorites/:productSlug')
	async toggleFavorite(
		@CurrentUser('id') id: number,
		@Param('productSlug') productSlug: string
	) {
		return this.userService.toggleFavorite(id, productSlug)
	}
}
