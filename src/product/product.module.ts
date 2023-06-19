import { Module } from '@nestjs/common'
import { PaginationService } from 'src/pagination/pagination.service'
import { CategoryPrismaService } from 'src/services/category-prisma/category-prisma.service'
import { PrismaService } from 'src/services/prisma/prisma.service'
import { ProductPrismaService } from 'src/services/product-prisma/product-prisma.service'
import { SubcategoryPrismaService } from 'src/services/subcategory-prisma/subcategory-prisma.service'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'

@Module({
	controllers: [ProductController],
	providers: [
		ProductService,
		PrismaService,
		ProductPrismaService,
		PaginationService,
		CategoryPrismaService,
		SubcategoryPrismaService
	]
})
export class ProductModule {}
