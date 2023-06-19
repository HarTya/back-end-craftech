import { Injectable } from '@nestjs/common'
import { OrderPrismaService } from 'src/services/order-prisma/order-prisma.service'

@Injectable()
export class OrderService {
	constructor(private readonly orderPrisma: OrderPrismaService) {}

	/* getAllOrdersByUserId Method */

	async getAllOrdersByUserId(userId: number) {
		return this.orderPrisma.getAllOrdersByUserId(userId)
	}
}
