import { Prisma } from '@prisma/client'
import { Transform, TransformFnParams } from 'class-transformer'
import {
	ArrayMinSize,
	IsNumber,
	IsString,
	Matches,
	Max,
	MaxLength,
	Min,
	MinLength
} from 'class-validator'

export class ProductDto implements Prisma.ProductUpdateInput {
	@IsString({
		message: 'Назва товару повинна бути рядком'
	})
	@Transform(({ value }: TransformFnParams) =>
		typeof value === 'string' ? value.trim() : null
	)
	@MinLength(4, {
		message: 'Назва товару має бути не коротшою за 4 символи'
	})
	@MaxLength(100, {
		message: 'Назва товару має бути не довшою за 100 символів'
	})
	name: string

	@IsString({
		message: 'Опис товару повинен бути рядком'
	})
	@Transform(({ value }: TransformFnParams) =>
		typeof value === 'string' ? value.trim() : null
	)
	@MinLength(10, {
		message: 'Опис товару має бути не коротшим за 10 символів'
	})
	@MaxLength(1000, {
		message: 'Опис товару має бути не довшим за 1000 символів'
	})
	description: string

	@IsNumber(
		{},
		{
			message: 'Вартість товару повинна бути числом'
		}
	)
	@Min(1, {
		message: 'Вартість товару не повинна бути менше 1 гривні'
	})
	@Max(99999, {
		message: 'Вартість товару не повинна перевищувати 99999 гривень'
	})
	price: number

	@IsString({
		message: 'Статус товару повинен бути рядком'
	})
	@Transform(({ value }: TransformFnParams) =>
		typeof value === 'string' ? value.trim() : null
	)
	@MinLength(5, {
		message: 'Статус товару має бути не коротшим за 5 символів'
	})
	@MaxLength(15, {
		message: 'Статус товару має бути не довшим за 15 символів'
	})
	status: string

	@IsString({
		each: true,
		message: 'Кожен шлях до зображення товару повинен бути рядком'
	})
	@ArrayMinSize(1, {
		message: 'Товар повинен мати хоча б 1 зображення'
	})
	images: string[]

	@IsString({
		message: 'Перелік розмірів повинен бути рядком'
	})
	@Matches(/^\S+(?: \S+)*$/, {
		message: 'Перелік розмірів не повинен містити понад 2-х пробілів підряд'
	})
	@Transform(({ value }: TransformFnParams) =>
		typeof value === 'string' ? value.trim() : null
	)
	@MinLength(8, {
		message: 'Перелік розмірів має бути не коротшим за 8 символів'
	})
	sizes: string

	@IsNumber(
		{},
		{
			message: 'Ідентифікатор категорії повинен бути числом'
		}
	)
	categoryId: number

	@IsNumber(
		{},
		{
			message: 'Ідентифікатор підкатегорії повинен бути числом'
		}
	)
	subcategoryId: number
}
