import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { ReviewDto } from './dto/review.dto'
import { ReviewService } from './review.service'

@Controller('reviews')
export class ReviewController {
	constructor(private readonly reviewService: ReviewService) {}

	/* getAllReviews */

	@Auth('ADMIN')
	@Get()
	async getAllReviews() {
		return this.reviewService.getAllReviews()
	}

	/* getReviewsByProduct */

	@Get('by-product/:productSlug')
	async getReviewsByProduct(@Param('productSlug') productSlug: string) {
		return this.reviewService.getReviewsByProduct(productSlug)
	}

	/* leaveReview */

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Post('leave/:productId')
	async leaveReview(
		@CurrentUser('id') userId: number,
		@Body() dto: ReviewDto,
		@Param('productId') productId: string
	) {
		return this.reviewService.leaveReview(userId, dto, +productId)
	}

	/* deleteReviewUser */

	@HttpCode(200)
	@Auth()
	@Delete(':id')
	async deleteReviewUser(
		@CurrentUser('id') userId: number,
		@Param('id') id: string
	) {
		return this.reviewService.deleteReviewUser(userId, +id)
	}

	/* deleteReview */

	@HttpCode(200)
	@Auth('ADMIN')
	@Delete('admin/:id')
	async deleteReview(@Param('id') id: string) {
		return this.reviewService.deleteReview(+id)
	}
}
