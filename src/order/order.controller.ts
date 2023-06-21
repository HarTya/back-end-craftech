import {
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { OrderDto } from './dto/order.dto'
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

	/* placeOrder */

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Post()
	async placeOrder(@CurrentUser('id') userId: number, @Body() dto: OrderDto) {
		return this.orderService.placeOrder(userId, dto)
	}
}
