import { Injectable } from '@nestjs/common'
import { OrderPrismaService } from 'src/services/order-prisma/order-prisma.service'
import { ReviewPrismaService } from 'src/services/review-prisma/review-prisma.service'
import { UserPrismaService } from 'src/services/user-prisma/user-prisma.service'

@Injectable()
export class StatisticsService {
	constructor(
		private readonly orderPrisma: OrderPrismaService,
		private readonly reviewPrisma: ReviewPrismaService,
		private readonly userPrisma: UserPrismaService
	) {}

	/* getMainStatistics Method */

	async getMainStatistics() {
		const ordersCount = await this.orderPrisma.getOrdersCount()
		const reviewsCount = await this.reviewPrisma.getReviewsCount()
		const usersCount = await this.userPrisma.getUsersCount()

		const totalAmount = await this.orderPrisma.getTotalAmount()

		return [
			{
				name: 'Кількість замовлень',
				value: ordersCount
			},
			{
				name: 'Кількість відгуків',
				value: reviewsCount
			},
			{
				name: 'Кількість користувачів',
				value: usersCount
			},
			{
				name: 'Загальний грошовий обіг',
				value: totalAmount
			}
		]
	}
}
