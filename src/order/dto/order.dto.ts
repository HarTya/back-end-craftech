import { EnumOrderStatus, Prisma } from '@prisma/client'
import { Type } from 'class-transformer'
import {
	ArrayMinSize,
	IsArray,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested
} from 'class-validator'

export class OrderDto {
	@IsOptional()
	@IsEnum(EnumOrderStatus, {
		message: 'Помилковий статус замовлення'
	})
	status: EnumOrderStatus

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

	@IsNumber({}, { message: 'Ціна позиції замовлення повинна бути числом' })
	price: number

	@IsNumber(
		{},
		{ message: 'Ідентифікатор товару позиції замовлення повинен бути числом' }
	)
	productId: number
}
