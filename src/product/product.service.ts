import { Injectable } from '@nestjs/common'
import { ProductPrismaService } from 'src/services/product-prisma/product-prisma.service'
import { FilterDto } from './dto/filter.dto'
import { ProductDto } from './dto/product.dto'

@Injectable()
export class ProductService {
	constructor(private readonly productPrisma: ProductPrismaService) {}

	/* getAllProducts Method */

	async getAllProducts(dto: FilterDto) {
		return this.productPrisma.getAllProducts(dto)
	}

	/* getAllProductsIncludeNew Method */

	async getAllProductsIncludeNew() {
		return this.productPrisma.getAllProductsIncludeNewProduct()
	}

	/* getUniqueProduct Method */

	async getUniqueProduct(productIdOrSlug: number | string) {
		return this.productPrisma.getUniqueProductByIdOrSlug(productIdOrSlug)
	}

	/* getProductsByCategory Method */

	async getProductsByCategory(categorySlug: string) {
		return this.productPrisma.getProductsByCategorySlug(categorySlug)
	}

	/* getProductsBySubcategory Method */

	async getProductsBySubcategory(subcategorySlug: string) {
		return this.productPrisma.getProductsBySubcategorySlug(subcategorySlug)
	}

	/* createProduct Method */

	async createProduct(adminId: number) {
		return this.productPrisma.createNewProduct(adminId)
	}

	/* updateProduct Method */

	async updateProduct(productId: number, dto: ProductDto) {
		return this.productPrisma.updateExistProduct(productId, dto)
	}

	/* deleteProduct Method */

	async deleteProduct(productId: number) {
		return this.productPrisma.deleteExistProduct(productId)
	}
}
