import { Injectable, NotFoundException } from '@nestjs/common'
import { OrderDto } from 'src/order/dto/order.dto'
import { productObject } from 'src/product/objects/product.object'
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

	async getAllOrdersByUserId(userId: number) {
		await this.userPrisma.getUniqueUserById(userId)

		return this.prisma.order.findMany({
			where: {
				userId
			},
			orderBy: {
				createdAt: 'desc'
			},
			include: {
				items: {
					include: {
						product: {
							select: productObject
						}
					}
				}
			}
		})
	}

	async placeOrder(userId: number, dto: OrderDto) {
		await this.userPrisma.getUniqueUserById(userId)

		const invalidProductIds = []

		for (const [index, item] of dto.items.entries()) {
			try {
				await this.productPrisma.getUniqueProductByIdOrSlug(item.productId)
			} catch (error) {
				invalidProductIds.push(
					`у позиції замовлення #${index + 1}: ${item.productId}`
				)
			}
		}

		if (invalidProductIds.length > 0) {
			throw new NotFoundException(
				`Помилковий ідентифікатор товару ${invalidProductIds.join(', ')}`
			)
		}

		return this.prisma.order.create({
			data: {
				status: dto.status,
				items: {
					create: dto.items
				},
				total: dto.total,
				user: {
					connect: {
						id: userId
					}
				}
			}
		})
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
