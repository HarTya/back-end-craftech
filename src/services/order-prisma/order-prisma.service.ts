import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { UserPrismaService } from '../user-prisma/user-prisma.service'

@Injectable()
export class OrderPrismaService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly userPrisma: UserPrismaService
	) {}

	async getAllOrdersByUserId(userId: number) {
		await this.userPrisma.getUniqueUserById(userId)

		return this.prisma.order.findMany({
			where: {
				userId
			},
			orderBy: {
				createdAt: 'desc'
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
