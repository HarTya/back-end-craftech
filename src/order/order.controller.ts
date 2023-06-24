import {
	Body,
	Controller,
	HttpCode,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { OrderUnauthorizedDto } from './dto/order-unauthorized.dto'
import { OrderDto } from './dto/order.dto'
import { OrderService } from './order.service'

@Controller('orders')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	/* placeOrder */

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Post()
	async placeOrder(@CurrentUser('id') userId: number, @Body() dto: OrderDto) {
		return this.orderService.placeOrder(userId, dto)
	}

	/* placeOrderUnauthorized */

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('unauthorized')
	async placeOrderUnauthorized(@Body() dto: OrderUnauthorizedDto) {
		return this.orderService.placeOrderUnauthorized(dto)
	}
}
