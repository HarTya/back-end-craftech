import { IsString } from 'class-validator'

export class RefreshTokenDto {
	@IsString({
		message: 'Токен оновлення повинен бути рядком'
	})
	refreshToken: string
}
