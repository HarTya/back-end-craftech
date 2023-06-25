import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PaginationService } from 'src/pagination/pagination.service'
import { EnumProductsSort, FilterDto } from 'src/product/dto/filter.dto'
import { ProductDto } from 'src/product/dto/product.dto'
import {
	productObject,
	productObjectFullset
} from 'src/product/objects/product.object'
import { generateSlug } from 'src/utils/generateSlug'
import { translator } from 'src/utils/translate'
import { CategoryPrismaService } from '../category-prisma/category-prisma.service'
import { PrismaService } from '../prisma/prisma.service'
import { SubcategoryPrismaService } from '../subcategory-prisma/subcategory-prisma.service'

@Injectable()
export class ProductPrismaService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly paginationService: PaginationService,
		private readonly categoryPrisma: CategoryPrismaService,
		private readonly subcategoryPrisma: SubcategoryPrismaService
	) {}

	async getAllProducts(dto: FilterDto = {}) {
		const { sort, searchTerm } = dto

		const prismaSort: Prisma.ProductOrderByWithRelationInput[] = []

		switch (sort) {
			case EnumProductsSort.NEWEST:
				prismaSort.push({ createdAt: 'desc' })
				break
			case EnumProductsSort.LOW_PRICE:
				prismaSort.push({ price: 'asc' })
				break
			case EnumProductsSort.HIGH_PRICE:
				prismaSort.push({ price: 'desc' })
				break
			case EnumProductsSort.OLDEST:
				prismaSort.push({ createdAt: 'asc' })
				break
		}

		const prismaSearchTermFilter: Prisma.ProductWhereInput = searchTerm
			? {
					OR: [
						{
							category: {
								name: {
									contains: searchTerm.trim(),
									mode: 'insensitive'
								}
							}
						},
						{
							name: {
								contains: searchTerm.trim(),
								mode: 'insensitive'
							}
						},
						{
							description: {
								contains: searchTerm.trim(),
								mode: 'insensitive'
							}
						}
					]
			  }
			: {}

		const { perPage, skip } = this.paginationService.getPagination(dto)

		const products = await this.prisma.product.findMany({
			where: {
				...prismaSearchTermFilter,
				NOT: {
					slug: {
						equals: ''
					}
				}
			},
			orderBy: prismaSort,
			skip,
			take: perPage,
			select: productObject
		})

		return {
			products,
			length: await this.prisma.product.count({
				where: {
					...prismaSearchTermFilter,
					NOT: {
						slug: {
							equals: ''
						}
					}
				}
			})
		}
	}

	async getAllProductsIncludeNewProduct() {
		return this.prisma.product.findMany({
			select: productObject
		})
	}

	async getUniqueProductByIdOrSlug(productIdOrSlug: number | string) {
		if (!productIdOrSlug)
			throw new BadRequestException('Недійсний унікальний ключ')

		const field = typeof productIdOrSlug === 'number' ? 'id' : 'slug'

		const product = await this.prisma.product.findUnique({
			where: {
				[field]:
					typeof productIdOrSlug === 'string'
						? productIdOrSlug.trim()
						: productIdOrSlug
			},
			select: productObjectFullset
		})

		if (!product || (field === 'slug' && !product.slug))
			throw new NotFoundException('Товар не знайдено')

		return product
	}

	async getProductsByCategorySlug(categorySlug: string) {
		const category = await this.categoryPrisma.getUniqueCategoryByIdOrSlug(
			categorySlug
		)

		const products = await this.prisma.product.findMany({
			where: {
				category: {
					slug: category.slug
				}
			},
			select: productObject
		})

		return products
	}

	async getProductsBySubcategorySlug(subcategorySlug: string) {
		const subcategory =
			await this.subcategoryPrisma.getUniqueSubcategoryByIdOrSlug(
				subcategorySlug
			)

		const products = await this.prisma.product.findMany({
			where: {
				category: {
					slug: subcategory.category.slug
				},
				subcategory: {
					slug: subcategory.slug
				}
			},
			select: productObject
		})

		return products
	}

	private async getUniqueProductByName(productName: string) {
		return this.prisma.product.findUnique({
			where: {
				name: productName.trim()
			}
		})
	}

	async createNewProduct(adminId: number) {
		const oldNewProduct = await this.getUniqueProductByName('')

		if (oldNewProduct) throw new BadRequestException('Новий товар вже існує')

		const newProduct = await this.prisma.product.create({
			data: {
				name: '',
				slug: '',
				description: '',
				price: 0,
				admin: {
					connect: {
						id: adminId
					}
				}
			}
		})

		return newProduct.id
	}

	private async validateUpdateExistProduct(
		productId: number,
		productName: string,
		productSlug: string,
		categoryId: number,
		subcategoryId: number
	) {
		await this.getUniqueProductByIdOrSlug(productId)

		if (!productSlug)
			throw new BadRequestException(
				'Назву товару не вдалося перекласти англійською мовою'
			)

		const oldProduct = await this.getUniqueProductByName(productName)

		if (oldProduct && oldProduct.id !== productId)
			throw new BadRequestException('Товар з такою назвою вже існує')

		const oldProductWithSameSlug = await this.prisma.product.findUnique({
			where: {
				slug: productSlug
			}
		})

		if (oldProductWithSameSlug && oldProductWithSameSlug.id !== productId)
			throw new BadRequestException(
				'Товар з такою назвою на англійській мові вже існує'
			)

		await this.categoryPrisma.getUniqueCategoryByIdOrSlug(categoryId)
		await this.subcategoryPrisma.getUniqueSubcategoryByIdOrSlug(subcategoryId)
	}

	async updateExistProduct(productId: number, dto: ProductDto) {
		const {
			name,
			description,
			price,
			status,
			images,
			sizes,
			categoryId,
			subcategoryId
		} = dto

		const { translation } = await translator(name.trim()).catch(() => {
			throw new BadRequestException(
				'Під час перекладу назви товару англійською мовою виникла помилка'
			)
		})

		await this.validateUpdateExistProduct(
			productId,
			name,
			generateSlug(translation),
			categoryId,
			subcategoryId
		)

		return this.prisma.product.update({
			where: {
				id: productId
			},
			data: {
				name: name.trim(),
				slug: generateSlug(translation),
				description: description.trim(),
				price,
				status: status.trim(),
				images,
				sizes: sizes.trim(),
				category: {
					connect: {
						id: categoryId
					}
				},
				subcategory: {
					connect: {
						id: subcategoryId
					}
				}
			}
		})
	}

	async deleteExistProduct(productId: number) {
		await this.getUniqueProductByIdOrSlug(productId)

		await this.prisma.review.deleteMany({
			where: {
				productId
			}
		})

		await this.prisma.characteristic.deleteMany({
			where: {
				productId
			}
		})

		return this.prisma.product.delete({
			where: {
				id: productId
			}
		})
	}
}
