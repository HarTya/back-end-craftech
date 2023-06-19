import { Prisma } from '@prisma/client'
import { Transform, TransformFnParams } from 'class-transformer'
import {
	IsNumber,
	IsString,
	Max,
	MaxLength,
	Min,
	MinLength
} from 'class-validator'

export class ReviewDto implements Prisma.ReviewUpdateInput {
	@IsNumber(
		{},
		{
			message: 'Оцінка відгуку повинна бути числом'
		}
	)
	@Min(1, {
		message: 'Оцінка відгуку повинна бути щонайменше 1 зіркою'
	})
	@Max(5, {
		message: 'Оцінка відгуку не повинна перевищувати 5 зірок'
	})
	rating: number

	@IsString({
		message: 'Текст відгуку повинен бути рядком'
	})
	@Transform(({ value }: TransformFnParams) =>
		typeof value === 'string' ? value.trim() : null
	)
	@MinLength(20, {
		message: 'Текст відгуку має бути не коротшим за 20 символів'
	})
	@MaxLength(200, {
		message: 'Текст відгуку має бути не довшим за 200 символів'
	})
	text: string
}
