import { Injectable } from '@nestjs/common'
import { CategoryPrismaService } from 'src/services/category-prisma/category-prisma.service'
import { CategoryDto } from './dto/category.dto'

@Injectable()
export class CategoryService {
	constructor(private readonly categoryPrisma: CategoryPrismaService) {}

	/* getAllCategories Method */

	async getAllCategories() {
		return this.categoryPrisma.getAllCategories()
	}

	/* getAllCategoriesIncludeNew Method */

	async getAllCategoriesIncludeNew() {
		return this.categoryPrisma.getAllCategoriesIncludeNewCategory()
	}

	/* getUniqueCategory Method */

	async getUniqueCategory(categoryIdOrSlug: number | string) {
		return this.categoryPrisma.getUniqueCategoryByIdOrSlug(categoryIdOrSlug)
	}

	/* createCategory Method */

	async createCategory(adminId: number) {
		return this.categoryPrisma.createNewCategory(adminId)
	}

	/* updateCategory Method */

	async updateCategory(categoryId: number, dto: CategoryDto) {
		return this.categoryPrisma.updateExistCategory(categoryId, dto)
	}

	/* deleteCategory Method */

	async deleteCategory(categoryId: number) {
		return this.categoryPrisma.deleteExistCategory(categoryId)
	}
}
