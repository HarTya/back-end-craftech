import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { CategoryDto } from 'src/category/dto/category.dto'
import { categoryObject } from 'src/category/objects/category.object'
import { generateSlug } from 'src/utils/generateSlug'
import { translator } from 'src/utils/translate'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class CategoryPrismaService {
	constructor(private readonly prisma: PrismaService) {}

	async getAllCategories() {
		return this.prisma.category.findMany({
			where: {
				NOT: {
					slug: {
						equals: ''
					}
				}
			},
			select: categoryObject
		})
	}

	async getAllCategoriesIncludeNewCategory() {
		return this.prisma.category.findMany({
			select: categoryObject
		})
	}

	async getUniqueCategoryByIdOrSlug(categoryIdOrSlug: number | string) {
		if (!categoryIdOrSlug)
			throw new BadRequestException('Недійсний унікальний ключ')

		const field = typeof categoryIdOrSlug === 'number' ? 'id' : 'slug'

		const category = await this.prisma.category.findUnique({
			where: {
				[field]:
					typeof categoryIdOrSlug === 'string'
						? categoryIdOrSlug.trim()
						: categoryIdOrSlug
			},
			select: categoryObject
		})

		if (!category || (field === 'slug' && !category.slug))
			throw new NotFoundException('Категорію не знайдено')

		return category
	}

	private async getUniqueCategoryByName(categoryName: string) {
		return this.prisma.category.findUnique({
			where: {
				name: categoryName.trim()
			}
		})
	}

	async createNewCategory(adminId: number) {
		const oldNewCategory = await this.getUniqueCategoryByName('')

		if (oldNewCategory)
			throw new BadRequestException('Нова категорія вже існує')

		const newCategory = await this.prisma.category.create({
			data: {
				name: '',
				slug: '',
				admin: {
					connect: {
						id: adminId
					}
				}
			}
		})

		return newCategory.id
	}

	private async validateUpdateExistCategory(
		categoryId: number,
		categoryName: string,
		categorySlug: string
	) {
		await this.getUniqueCategoryByIdOrSlug(categoryId)

		if (!categorySlug)
			throw new BadRequestException(
				'Назву категорії не вдалося перекласти англійською мовою'
			)

		const oldCategory = await this.getUniqueCategoryByName(categoryName)

		if (oldCategory && oldCategory.id !== categoryId)
			throw new BadRequestException('Категорія з такою назвою вже існує')

		const oldCategoryWithSameSlug = await this.prisma.category.findUnique({
			where: {
				slug: categorySlug
			}
		})

		if (oldCategoryWithSameSlug && oldCategoryWithSameSlug.id !== categoryId)
			throw new BadRequestException(
				'Категорія з такою назвою на англійській мові вже існує'
			)
	}

	async updateExistCategory(categoryId: number, dto: CategoryDto) {
		const { translation } = await translator(dto.name.trim()).catch(() => {
			throw new BadRequestException(
				'Під час перекладу назви категорії англійською мовою виникла помилка'
			)
		})

		await this.validateUpdateExistCategory(
			categoryId,
			dto.name,
			generateSlug(translation)
		)

		return this.prisma.category.update({
			where: {
				id: categoryId
			},
			data: {
				name: dto.name.trim(),
				slug: generateSlug(translation)
			}
		})
	}

	async deleteExistCategory(categoryId: number) {
		await this.getUniqueCategoryByIdOrSlug(categoryId)

		await this.prisma.subcategory.deleteMany({
			where: {
				categoryId
			}
		})

		return this.prisma.category.delete({
			where: {
				id: categoryId
			}
		})
	}
}
