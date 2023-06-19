import { Injectable } from '@nestjs/common'
import { SubcategoryPrismaService } from 'src/services/subcategory-prisma/subcategory-prisma.service'
import { SubcategoryDto } from './dto/subcategory.dto'

@Injectable()
export class SubcategoryService {
	constructor(private readonly subcategoryPrisma: SubcategoryPrismaService) {}

	/* getAllSubcategories Method */

	async getAllSubcategories() {
		return this.subcategoryPrisma.getAllSubcategories()
	}

	/* getUniqueSubcategory Method */

	async getUniqueSubcategory(subcategoryIdOrSlug: number | string) {
		return this.subcategoryPrisma.getUniqueSubcategoryByIdOrSlug(
			subcategoryIdOrSlug
		)
	}

	/* createSubcategory Method */

	async createSubcategory(adminId: number, categoryId: number) {
		return this.subcategoryPrisma.createNewSubcategory(adminId, categoryId)
	}

	/* updateSubcategory Method */

	async updateSubcategory(subcategoryId: number, dto: SubcategoryDto) {
		return this.subcategoryPrisma.updateExistSubcategory(subcategoryId, dto)
	}

	/* deleteSubcategory Method */

	async deleteSubcategory(subcategoryId: number) {
		return this.subcategoryPrisma.deleteExistSubcategory(subcategoryId)
	}
}
