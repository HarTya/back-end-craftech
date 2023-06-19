import { Module } from '@nestjs/common'
import { CategoryPrismaService } from 'src/services/category-prisma/category-prisma.service'
import { PrismaService } from 'src/services/prisma/prisma.service'
import { SubcategoryPrismaService } from 'src/services/subcategory-prisma/subcategory-prisma.service'
import { SubcategoryController } from './subcategory.controller'
import { SubcategoryService } from './subcategory.service'

@Module({
	controllers: [SubcategoryController],
	providers: [
		SubcategoryService,
		PrismaService,
		CategoryPrismaService,
		SubcategoryPrismaService
	]
})
export class SubcategoryModule {}
