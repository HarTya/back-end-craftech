import { IsString, Matches, MaxLength, MinLength } from 'class-validator'
import { OrderDto } from './order.dto'

export class OrderUnauthorizedDto extends OrderDto {
	@IsString({
		message: 'Номер телефону повинен бути рядком'
	})
	@Matches(/^0\d{9}$/, {
		message: 'Недійсний номер телефону'
	})
	phone: string

	@IsString({
		message: 'Прізвище повинно бути рядком'
	})
	@Matches(/^[А-ЩЬЮЯҐЄІЇ][а-щьюяґєії']*$/, {
		message:
			'Прізвище повинно починатися з великої літери, містити лише українські символи та бути без пробілів'
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
			"Ім'я повинно починатися з великої літери, містити лише українські символи та бути без пробілів"
	})
	@MinLength(2, {
		message: "Ім'я має бути не коротшим за 2 символи"
	})
	@MaxLength(12, {
		message: "Ім'я має бути не довшим за 12 символів"
	})
	firstName: string
}
