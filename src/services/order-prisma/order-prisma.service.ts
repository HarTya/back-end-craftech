import { Injectable, NotFoundException } from '@nestjs/common'
import { User } from '@prisma/client'
import { OrderUnauthorizedDto } from 'src/order/dto/order-unauthorized.dto'
import {
	EnumOrderPickupType,
	OrderDto,
	OrderItemDto
} from 'src/order/dto/order.dto'
import { orderObject } from 'src/order/objects/order.object'
import { PrismaService } from '../prisma/prisma.service'
import { ProductPrismaService } from '../product-prisma/product-prisma.service'
import { UserPrismaService } from '../user-prisma/user-prisma.service'

@Injectable()
export class OrderPrismaService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly userPrisma: UserPrismaService,
		private readonly productPrisma: ProductPrismaService
	) {}

	private async validatePlaceOrder(items: OrderItemDto[]) {
		const invalidProductIds = []

		for (const [index, item] of items.entries()) {
			try {
				await this.productPrisma.getUniqueProductByIdOrSlug(item.productId)
			} catch (error) {
				invalidProductIds.push(`позиції замовлення #${index + 1}`)
			}
		}

		if (invalidProductIds.length > 0) {
			throw new NotFoundException(
				`Помилковий ідентифікатор товару у ${invalidProductIds.join(', ')}`
			)
		}
	}

	async createNewOrder(dto: OrderDto | OrderUnauthorizedDto, user?: User) {
		return this.prisma.order.create({
			data: {
				pickupType:
					dto.pickupType === EnumOrderPickupType.STORE
						? EnumOrderPickupType.STORE
						: EnumOrderPickupType.POST_OFFICE,
				day: dto.pickupType === EnumOrderPickupType.STORE ? dto.day : '',
				time: dto.pickupType === EnumOrderPickupType.STORE ? dto.time : '',
				city:
					dto.pickupType === EnumOrderPickupType.POST_OFFICE
						? dto.city.trim()
						: '',
				postOfficeNumber:
					dto.pickupType === EnumOrderPickupType.POST_OFFICE
						? dto.postOfficeNumber
						: 0,
				items: {
					create: dto.items
				},
				total: dto.total,
				phone: user ? user.phone : 'phone' in dto && dto.phone,
				lastName: user ? user.lastName : 'lastName' in dto && dto.lastName,
				firstName: user ? user.firstName : 'firstName' in dto && dto.firstName,
				user: user ? { connect: { id: user.id } } : undefined
			},
			select: orderObject
		})
	}

	async placeOrder(userId: number, dto: OrderDto) {
		const user = await this.userPrisma.getUniqueUserById(userId)

		await this.validatePlaceOrder(dto.items)

		return this.createNewOrder(dto, user)
	}

	async placeOrderUnauthorized(dto: OrderUnauthorizedDto) {
		await this.validatePlaceOrder(dto.items)

		return this.createNewOrder(dto)
	}

	async getOrdersCount() {
		return this.prisma.order.count()
	}

	async getTotalAmount() {
		const totalAmount = await this.prisma.order.aggregate({
			_sum: { total: true }
		})

		return +totalAmount._sum.total
	}
}
