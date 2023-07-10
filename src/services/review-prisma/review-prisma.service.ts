import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { ReviewDto } from 'src/review/dto/review.dto'
import { reviewObjectUser } from 'src/review/objects/review.object'
import { PrismaService } from '../prisma/prisma.service'
import { ProductPrismaService } from '../product-prisma/product-prisma.service'
import { UserPrismaService } from '../user-prisma/user-prisma.service'

@Injectable()
export class ReviewPrismaService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly userPrisma: UserPrismaService,
		private readonly productPrisma: ProductPrismaService
	) {}

	async getAllReviews() {
		return this.prisma.review.findMany({
			select: reviewObjectUser
		})
	}

	async getReviewsByProductSlug(productSlug: string) {
		const product = await this.productPrisma.getUniqueProductByIdOrSlug(
			productSlug
		)

		const reviews = await this.prisma.review.findMany({
			where: {
				product: {
					slug: product.slug
				}
			},
			select: reviewObjectUser
		})

		return reviews
	}

	private async validateCreateNewReview(userId: number, productId: number) {
		const user = await this.userPrisma.getUniqueUserByIdWithFavoritesAndOther(
			userId,
			{
				reviews: true
			}
		)

		const isReviewExists = user.reviews.some(
			review => review.productId === productId
		)

		if (isReviewExists) throw new BadRequestException('Відгук вже існує')
	}

	async createNewReview(userId: number, dto: ReviewDto, productId: number) {
		await this.productPrisma.getUniqueProductByIdOrSlug(productId)

		await this.validateCreateNewReview(userId, productId)

		return this.prisma.review.create({
			data: {
				rating: +dto.rating.toFixed(0),
				text: dto.text.trim(),
				user: {
					connect: {
						id: userId
					}
				},
				product: {
					connect: {
						id: productId
					}
				}
			}
		})
	}

	private async validateDeleteExistReviewUser(
		userId: number,
		reviewId: number
	) {
		const user = await this.userPrisma.getUniqueUserByIdWithFavoritesAndOther(
			userId,
			{
				reviews: true
			}
		)

		const isReviewExists = user.reviews.some(review => review.id === reviewId)

		if (!isReviewExists) throw new NotFoundException('Відгук не знайдено')
	}

	async deleteExistReviewUser(userId: number, reviewId: number) {
		await this.validateDeleteExistReviewUser(userId, reviewId)

		return this.prisma.review.delete({
			where: {
				id: reviewId
			}
		})
	}

	async deleteExistReview(reviewId: number) {
		const review = await this.prisma.review.findUnique({
			where: {
				id: reviewId
			}
		})

		if (!review) throw new NotFoundException('Відгук не знайдено')

		return this.prisma.review.delete({
			where: {
				id: reviewId
			}
		})
	}

	async getReviewsCount() {
		return this.prisma.review.count()
	}
}
