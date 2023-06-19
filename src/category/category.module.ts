import { Module } from '@nestjs/common'
import { CategoryPrismaService } from 'src/services/category-prisma/category-prisma.service'
import { PrismaService } from 'src/services/prisma/prisma.service'
import { CategoryController } from './category.controller'
import { CategoryService } from './category.service'

@Module({
	controllers: [CategoryController],
	providers: [CategoryService, PrismaService, CategoryPrismaService]
})
export class CategoryModule {}
