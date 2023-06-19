import { Prisma } from '@prisma/client'
import {
	IsString,
	IsStrongPassword,
	Matches,
	MaxLength,
	MinLength,
	Validate
} from 'class-validator'
import { CustomMatchPasswords } from './confirmPassword'

export class RegisterDto implements Prisma.UserUpdateInput {
	@IsString({
		message: 'Номер телефону повинен бути рядком'
	})
	@Matches(/^\+38(0\d{9})$/, {
		message: 'Недійсний номер телефону'
	})
	phone: string

	@IsString({
		message: 'Пароль повинен бути рядком'
	})
	@Matches(/^[^\s]+(\s+[^\s]+)*$/, {
		message: 'Пароль не повинен починатися або закінчуватися пробілом'
	})
	@IsStrongPassword(
		{
			minLowercase: 0,
			minUppercase: 1,
			minNumbers: 1,
			minSymbols: 0
		},
		{
			message:
				'Пароль недостатньо надійний (принаймні 1 велика літера англійського алфавіту та 1 цифра)'
		}
	)
	@MinLength(8, {
		message: 'Пароль має бути не коротшим за 8 символів'
	})
	@MaxLength(16, {
		message: 'Пароль має бути не довшим за 16 символів'
	})
	password: string

	@IsString({
		message: 'Підтвердження паролю повинно бути рядком'
	})
	@Validate(CustomMatchPasswords, ['password'])
	confirmPassword: string

	@IsString({
		message: 'Прізвище повинно бути рядком'
	})
	@Matches(/^[А-ЩЬЮЯҐЄІЇ][а-щьюяґєії']*$/, {
		message:
			'Прізвище повинно починатися з великої літери, містити лише українські літери та бути без пробілів'
	})
	@MinLength(3, {
		message: 'Прізвище має бути не коротшим за 3 символи'
	})
	@MaxLength(19, {
		message: 'Прізвище має бути не довшим за 19 символів'
	})
	lastName: string

	@IsString({
		message: "Ім'я повинно бути рядком"
	})
	@Matches(/^[А-ЩЬЮЯҐЄІЇ][а-щьюяґєії']*$/, {
		message:
			"Ім'я повинно починатися з великої літери, містити лише українські літери та бути без пробілів"
	})
	@MinLength(2, {
		message: "Ім'я має бути не коротшим за 2 символи"
	})
	@MaxLength(12, {
		message: "Ім'я має бути не довшим за 12 символів"
	})
	firstName: string
}
