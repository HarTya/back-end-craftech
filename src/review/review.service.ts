import { Injectable } from '@nestjs/common'
import { ReviewPrismaService } from 'src/services/review-prisma/review-prisma.service'
import { ReviewDto } from './dto/review.dto'

@Injectable()
export class ReviewService {
	constructor(private readonly reviewPrisma: ReviewPrismaService) {}

	/* getAllReviews Method */

	async getAllReviews() {
		return this.reviewPrisma.getAllReviews()
	}

	/* getReviewsByProduct Method */

	async getReviewsByProduct(productSlug: string) {
		return this.reviewPrisma.getReviewsByProductSlug(productSlug)
	}

	/* leaveReview Method */

	async leaveReview(userId: number, dto: ReviewDto, productId: number) {
		return this.reviewPrisma.createNewReview(userId, dto, productId)
	}

	/* deleteReviewUser Method */

	async deleteReviewUser(userId: number, reviewId: number) {
		return this.reviewPrisma.deleteExistReviewUser(userId, reviewId)
	}

	/* deleteReview Method */

	async deleteReview(reviewId: number) {
		return this.reviewPrisma.deleteExistReview(reviewId)
	}
}
