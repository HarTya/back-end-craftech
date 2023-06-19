import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { SubcategoryDto } from 'src/subcategory/dto/subcategory.dto'
import {
	subcategoryObject,
	subcategoryObjectCategory
} from 'src/subcategory/objects/subcategory.object'
import { generateSlug } from 'src/utils/generateSlug'
import { translator } from 'src/utils/translate'
import { CategoryPrismaService } from '../category-prisma/category-prisma.service'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class SubcategoryPrismaService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly categoryPrisma: CategoryPrismaService
	) {}

	async getAllSubcategories() {
		return this.prisma.subcategory.findMany({
			where: {
				NOT: {
					slug: {
						equals: ''
					}
				}
			},
			select: subcategoryObject
		})
	}

	async getUniqueSubcategoryByIdOrSlug(subcategoryIdOrSlug: number | string) {
		if (!subcategoryIdOrSlug)
			throw new BadRequestException('Недійсний унікальний ключ')

		const field = typeof subcategoryIdOrSlug === 'number' ? 'id' : 'slug'

		const subcategory = await this.prisma.subcategory.findUnique({
			where: {
				[field]:
					typeof subcategoryIdOrSlug === 'string'
						? subcategoryIdOrSlug.trim()
						: subcategoryIdOrSlug
			},
			select: subcategoryObjectCategory
		})

		if (!subcategory || (field === 'slug' && !subcategory.slug))
			throw new NotFoundException('Підкатегорію не знайдено')

		return subcategory
	}

	async createNewSubcategory(adminId: number, categoryId: number) {
		await this.categoryPrisma.getUniqueCategoryByIdOrSlug(categoryId)

		const oldNewSubcategory = await this.prisma.subcategory.findUnique({
			where: {
				slug: ''
			},
			select: {
				category: {
					select: {
						id: true,
						name: true
					}
				}
			}
		})

		if (oldNewSubcategory)
			throw new BadRequestException(
				`Нова підкатегорія вже існує${
					oldNewSubcategory.category.id !== categoryId
						? ` у ${
								oldNewSubcategory.category.name
									? `категорії ${oldNewSubcategory.category.name}`
									: 'новій категорії'
						  }`
						: ''
				}`
			)

		const newSubcategory = await this.prisma.subcategory.create({
			data: {
				name: '',
				slug: '',
				category: {
					connect: {
						id: categoryId
					}
				},
				admin: {
					connect: {
						id: adminId
					}
				}
			}
		})

		return newSubcategory.id
	}

	private async validateUpdateExistSubcategory(
		subcategoryId: number,
		subcategorySlug: string
	) {
		const { category } = await this.getUniqueSubcategoryByIdOrSlug(
			subcategoryId
		)

		if (!subcategorySlug)
			throw new BadRequestException(
				'Назву підкатегорії не вдалося перекласти англійською мовою'
			)

		const subcategorySlugWithCategorySlug = generateSlug(
			category.slug + '-' + subcategorySlug
		)

		const oldSubcategoryWithSameSlug = await this.prisma.subcategory.findUnique(
			{
				where: {
					slug: subcategorySlugWithCategorySlug
				}
			}
		)

		if (
			oldSubcategoryWithSameSlug &&
			oldSubcategoryWithSameSlug.id !== subcategoryId
		)
			throw new BadRequestException(
				'Підкатегорія з такою назвою на англійській мові вже існує'
			)

		return { slug: subcategorySlugWithCategorySlug }
	}

	async updateExistSubcategory(subcategoryId: number, dto: SubcategoryDto) {
		const { translation } = await translator(dto.name.trim()).catch(() => {
			throw new BadRequestException(
				'Під час перекладу назви підкатегорії англійською мовою виникла помилка'
			)
		})

		const { slug } = await this.validateUpdateExistSubcategory(
			subcategoryId,
			generateSlug(translation)
		)

		return this.prisma.subcategory.update({
			where: {
				id: subcategoryId
			},
			data: {
				name: dto.name.trim(),
				slug: generateSlug(slug)
			}
		})
	}

	async deleteExistSubcategory(subcategoryId: number) {
		await this.getUniqueSubcategoryByIdOrSlug(subcategoryId)

		return this.prisma.subcategory.delete({
			where: {
				id: subcategoryId
			}
		})
	}
}
