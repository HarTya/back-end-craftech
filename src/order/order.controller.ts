import { Controller, Get } from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { OrderService } from './order.service'

@Controller('orders')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	/* getAllOrdersByUserId */

	@Auth()
	@Get()
	async getAllOrdersByUserId(@CurrentUser('id') userId: number) {
		return this.orderService.getAllOrdersByUserId(userId)
	}
}
