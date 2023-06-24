import { Prisma } from '@prisma/client'
import { IsString, Matches, MaxLength, MinLength } from 'class-validator'

export class LoginDto implements Prisma.UserUpdateInput {
	@IsString({
		message: 'Номер телефону повинен бути рядком'
	})
	@Matches(/^0\d{9}$/, {
		message: 'Недійсний номер телефону'
	})
	phone: string

	@IsString({
		message: 'Пароль повинен бути рядком'
	})
	@Matches(/^[^\s]+(\s+[^\s]+)*$/, {
		message: 'Пароль не повинен починатися або закінчуватися пробілом'
	})
	@MinLength(8, {
		message: 'Пароль має бути не коротшим за 8 символів'
	})
	@MaxLength(16, {
		message: 'Пароль має бути не довшим за 16 символів'
	})
	password: string
}
