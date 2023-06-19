import { Module } from '@nestjs/common'
import { PaginationService } from 'src/pagination/pagination.service'
import { CategoryPrismaService } from 'src/services/category-prisma/category-prisma.service'
import { CharacteristicPrismaService } from 'src/services/characteristic-prisma/characteristic-prisma.service'
import { PrismaService } from 'src/services/prisma/prisma.service'
import { ProductPrismaService } from 'src/services/product-prisma/product-prisma.service'
import { SubcategoryPrismaService } from 'src/services/subcategory-prisma/subcategory-prisma.service'
import { CharacteristicController } from './characteristic.controller'
import { CharacteristicService } from './characteristic.service'

@Module({
	controllers: [CharacteristicController],
	providers: [
		CharacteristicService,
		PrismaService,
		CharacteristicPrismaService,
		ProductPrismaService,
		PaginationService,
		CategoryPrismaService,
		SubcategoryPrismaService
	]
})
export class CharacteristicModule {}
