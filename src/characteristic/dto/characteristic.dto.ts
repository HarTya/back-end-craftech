import { Prisma } from '@prisma/client'
import { Transform, TransformFnParams } from 'class-transformer'
import { IsString, Matches, MaxLength, MinLength } from 'class-validator'

export class CharacteristicDto implements Prisma.CharacteristicUpdateInput {
	@IsString({
		message: 'Назва характеристики повинна бути рядком'
	})
	@Matches(/^\S+(?: \S+)*$/, {
		message: 'Назва характеристики не повинна містити понад 2-х пробілів підряд'
	})
	@Transform(({ value }: TransformFnParams) =>
		typeof value === 'string' ? value.trim() : null
	)
	@MinLength(4, {
		message: 'Назва характеристики має бути не коротшою за 4 символи'
	})
	@MaxLength(24, {
		message: 'Назва характеристики має бути не довшою за 24 символи'
	})
	title: string

	@IsString({
		message: 'Опис характеристики повинен бути рядком'
	})
	@Matches(/^\S+(?: \S+)*$/, {
		message: 'Опис характеристики не повинен містити понад 2-х пробілів підряд'
	})
	@Transform(({ value }: TransformFnParams) =>
		typeof value === 'string' ? value.trim() : null
	)
	@MinLength(3, {
		message: 'Опис характеристики має бути не коротшим за 3 символи'
	})
	@MaxLength(30, {
		message: 'Опис характеристики має бути не довшим за 30 символів'
	})
	description: string
}
