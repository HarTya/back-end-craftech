import { Injectable } from '@nestjs/common'
import { OrderPrismaService } from 'src/services/order-prisma/order-prisma.service'
import { OrderDto } from './dto/order.dto'

@Injectable()
export class OrderService {
	constructor(private readonly orderPrisma: OrderPrismaService) {}

	/* getAllOrdersByUserId Method */

	async getAllOrdersByUserId(userId: number) {
		return this.orderPrisma.getAllOrdersByUserId(userId)
	}

	/* placeOrder Method */

	async placeOrder(userId: number, dto: OrderDto) {
		return this.orderPrisma.placeOrder(userId, dto)
	}
}
