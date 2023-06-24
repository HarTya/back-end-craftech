import { Injectable } from '@nestjs/common'
import { OrderPrismaService } from 'src/services/order-prisma/order-prisma.service'
import { OrderUnauthorizedDto } from './dto/order-unauthorized.dto'
import { OrderDto } from './dto/order.dto'

@Injectable()
export class OrderService {
	constructor(private readonly orderPrisma: OrderPrismaService) {}

	/* placeOrder Method */

	async placeOrder(userId: number, dto: OrderDto) {
		return this.orderPrisma.placeOrder(userId, dto)
	}

	/* placeOrderUnauthorized Method */

	async placeOrderUnauthorized(dto: OrderUnauthorizedDto) {
		return this.orderPrisma.placeOrderUnauthorized(dto)
	}
}
