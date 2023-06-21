import { Prisma } from '@prisma/client'
import {
	IsString,
	IsStrongPassword,
	Matches,
	MaxLength,
	MinLength,
	Validate
} from 'class-validator'
import { CustomMatchPasswords } from 'src/auth/dto/confirmPassword'

export class PasswordDto implements Prisma.UserUpdateInput {
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

	@IsString({
		message: 'Новий пароль повинен бути рядком'
	})
	@Matches(/^[^\s]+(\s+[^\s]+)*$/, {
		message: 'Новий пароль не повинен починатися або закінчуватися пробілом'
	})
	@IsStrongPassword(
		{
			minLowercase: 1,
			minUppercase: 0,
			minNumbers: 1,
			minSymbols: 0
		},
		{
			message:
				'Новий пароль недостатньо надійний (принаймні 1 мала літера англійського алфавіту та 1 цифра)'
		}
	)
	@MinLength(8, {
		message: 'Новий пароль має бути не коротшим за 8 символів'
	})
	@MaxLength(16, {
		message: 'Новий пароль має бути не довшим за 16 символів'
	})
	newPassword: string

	@IsString({
		message: 'Підтвердження нового паролю повинно бути рядком'
	})
	@Validate(CustomMatchPasswords, ['newPassword'])
	confirmNewPassword: string
}
