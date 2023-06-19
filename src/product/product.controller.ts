import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { FilterDto } from './dto/filter.dto'
import { ProductDto } from './dto/product.dto'
import { ProductService } from './product.service'

@Controller('products')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	/* getAllProducts */

	@UsePipes(new ValidationPipe())
	@Get()
	async getAllProducts(@Query() queryDto: FilterDto) {
		return this.productService.getAllProducts(queryDto)
	}

	/* getAllProductsIncludeNew */

	@Auth('ADMIN')
	@Get('include-new')
	async getAllProductsIncludeNew() {
		return this.productService.getAllProductsIncludeNew()
	}

	/* getProductBySlug */

	@Get('by-slug/:slug')
	async getProductBySlug(@Param('slug') slug: string) {
		return this.productService.getUniqueProduct(slug)
	}

	/* getProductById */

	@Auth('ADMIN')
	@Get(':id')
	async getProductById(@Param('id') id: string) {
		return this.productService.getUniqueProduct(+id)
	}

	/* getProductsByCategory */

	@Get('by-category/:categorySlug')
	async getProductsByCategory(@Param('categorySlug') categorySlug: string) {
		return this.productService.getProductsByCategory(categorySlug)
	}

	/* getProductsBySubcategory */

	@Get('by-subcategory/:subcategorySlug')
	async getProductsBySubcategory(
		@Param('subcategorySlug') subcategorySlug: string
	) {
		return this.productService.getProductsBySubcategory(subcategorySlug)
	}

	/* createProduct */

	@HttpCode(200)
	@Auth('ADMIN')
	@Post()
	async createProduct(@CurrentUser('id') adminId: number) {
		return this.productService.createProduct(adminId)
	}

	/* updateProduct */

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth('ADMIN')
	@Put(':id')
	async updateProduct(@Param('id') id: string, @Body() dto: ProductDto) {
		return this.productService.updateProduct(+id, dto)
	}

	/* deleteProduct */

	@HttpCode(200)
	@Auth('ADMIN')
	@Delete(':id')
	async deleteProduct(@Param('id') id: string) {
		return this.productService.deleteProduct(+id)
	}
}
