import { Prisma } from '@prisma/client'
import { Transform, TransformFnParams } from 'class-transformer'
import { IsString, MaxLength, MinLength } from 'class-validator'

export class CategoryDto implements Prisma.CategoryUpdateInput {
	@IsString({
		message: 'Назва категорії повинна бути рядком'
	})
	@Transform(({ value }: TransformFnParams) =>
		typeof value === 'string' ? value.trim() : null
	)
	@MinLength(3, {
		message: 'Назва категорії має бути не коротшою за 3 символи'
	})
	@MaxLength(20, {
		message: 'Назва категорії має бути не довшою за 20 символів'
	})
	name: string
}
