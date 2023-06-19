import { Module } from '@nestjs/common'
import { PaginationService } from 'src/pagination/pagination.service'
import { CategoryPrismaService } from 'src/services/category-prisma/category-prisma.service'
import { PrismaService } from 'src/services/prisma/prisma.service'
import { ProductPrismaService } from 'src/services/product-prisma/product-prisma.service'
import { SubcategoryPrismaService } from 'src/services/subcategory-prisma/subcategory-prisma.service'
import { UserPrismaService } from 'src/services/user-prisma/user-prisma.service'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
	controllers: [UserController],
	providers: [
		UserService,
		PrismaService,
		UserPrismaService,
		ProductPrismaService,
		PaginationService,
		CategoryPrismaService,
		SubcategoryPrismaService
	]
})
export class UserModule {}
