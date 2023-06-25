import { Prisma } from '@prisma/client'
import { Transform, TransformFnParams, Type } from 'class-transformer'
import {
	ArrayMinSize,
	IsArray,
	IsEnum,
	IsNumber,
	IsString,
	Matches,
	Max,
	MaxLength,
	Min,
	MinLength,
	ValidateIf,
	ValidateNested
} from 'class-validator'

export enum EnumOrderPickupType {
	STORE = 'STORE',
	POST_OFFICE = 'POST_OFFICE'
}

export class OrderDto {
	@IsEnum(EnumOrderPickupType, {
		message: 'Помилковий тип отримання замовлення'
	})
	pickupType: EnumOrderPickupType

	@ValidateIf(dto => dto.pickupType === EnumOrderPickupType.STORE)
	@IsString({ message: 'День отримання замовлення повинен бути рядком' })
	@Transform(({ value }: TransformFnParams) =>
		typeof value === 'string' ? value.trim() : null
	)
	@Matches(/^[А-ЩЬЮЯҐЄІЇ][а-щьюяґєії']*$/, {
		message:
			'День отримання замовлення повинен починатися з великої літери, містити лише українські символи та бути без пробілів'
	})
	@MinLength(2, {
		message: 'День отримання замовлення має бути не коротшим за 2 символи'
	})
	@MaxLength(30, {
		message: 'День отримання замовлення має бути не довшим за 30 символів'
	})
	day: string

	@ValidateIf(dto => dto.pickupType === EnumOrderPickupType.STORE)
	@IsString({ message: 'Час отримання замовлення повинен бути рядком' })
	@Matches(/^[1][2-8]:[0-5][0-9]$/, {
		message: 'Неможливий час отримання замовлення'
	})
	time: string

	@ValidateIf(dto => dto.pickupType === EnumOrderPickupType.POST_OFFICE)
	@IsString({ message: 'Назва міста повинна бути рядком' })
	@Transform(({ value }: TransformFnParams) =>
		typeof value === 'string' ? value.trim() : null
	)
	@Matches(/^[А-ЩЬЮЯҐЄІЇ][а-щьюяґєії' А-ЩЬЮЯҐЄІЇ]*$/, {
		message:
			'Назва міста повинна починатися з великої літери та містити лише українські символи'
	})
	@MinLength(2, {
		message: 'Назва міста має бути не коротшою за 2 символи'
	})
	@MaxLength(30, {
		message: 'Назва міста має бути не довшою за 30 символів'
	})
	city: string

	@ValidateIf(dto => dto.pickupType === EnumOrderPickupType.POST_OFFICE)
	@IsNumber(
		{},
		{ message: 'Номер відділення "Нової пошти" повинен бути числом' }
	)
	@Min(1, {
		message: 'Нумерація відділень "Нової пошти" починається з 1'
	})
	@Max(50000, {
		message: 'Номер відділення "Нової пошти" не повинен перевищувати 50000'
	})
	postOfficeNumber: number

	@IsArray({ message: 'Позиції замовлення повинні бути масивом' })
	@ArrayMinSize(1, {
		message: 'Замовлення повинно мати хоча б 1 позицію'
	})
	@ValidateNested({
		each: true,
		message: "Кожна позиція замовлення повинна бути об'єктом"
	})
	@Type(() => OrderItemDto)
	items: OrderItemDto[]

	@IsNumber({}, { message: 'Загальна вартість замовлення повинна бути числом' })
	total: number
}

export class OrderItemDto implements Prisma.OrderItemUpdateInput {
	@IsString({ message: 'Розмір позиції замовлення повинен бути рядком' })
	size: string

	@IsNumber(
		{},
		{ message: 'Кількість одиниць позиції замовлення повинна бути числом' }
	)
	quantity: number

	@IsNumber({}, { message: 'Вартість позиції замовлення повинна бути числом' })
	price: number

	@IsNumber(
		{},
		{ message: 'Ідентифікатор товару позиції замовлення повинен бути числом' }
	)
	productId: number
}
