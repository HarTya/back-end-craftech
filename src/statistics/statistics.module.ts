import { Module } from '@nestjs/common'
import { PaginationService } from 'src/pagination/pagination.service'
import { CategoryPrismaService } from 'src/services/category-prisma/category-prisma.service'
import { OrderPrismaService } from 'src/services/order-prisma/order-prisma.service'
import { PrismaService } from 'src/services/prisma/prisma.service'
import { ProductPrismaService } from 'src/services/product-prisma/product-prisma.service'
import { ReviewPrismaService } from 'src/services/review-prisma/review-prisma.service'
import { SubcategoryPrismaService } from 'src/services/subcategory-prisma/subcategory-prisma.service'
import { UserPrismaService } from 'src/services/user-prisma/user-prisma.service'
import { StatisticsController } from './statistics.controller'
import { StatisticsService } from './statistics.service'

@Module({
	controllers: [StatisticsController],
	providers: [
		StatisticsService,
		PrismaService,
		OrderPrismaService,
		ReviewPrismaService,
		UserPrismaService,
		ProductPrismaService,
		PaginationService,
		CategoryPrismaService,
		SubcategoryPrismaService
	]
})
export class StatisticsModule {}
