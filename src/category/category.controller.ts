import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { CategoryService } from './category.service'
import { CategoryDto } from './dto/category.dto'

@Controller('categories')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	/* getAllCategories */

	@Get()
	async getAllCategories() {
		return this.categoryService.getAllCategories()
	}

	/* getAllCategoriesIncludeNew */

	@Auth('ADMIN')
	@Get('include-new')
	async getAllCategoriesIncludeNew() {
		return this.categoryService.getAllCategoriesIncludeNew()
	}

	/* getCategoryBySlug */

	@Get('by-slug/:slug')
	async getCategoryBySlug(@Param('slug') slug: string) {
		return this.categoryService.getUniqueCategory(slug)
	}

	/* getCategoryById */

	@Auth('ADMIN')
	@Get(':id')
	async getCategoryById(@Param('id') id: string) {
		return this.categoryService.getUniqueCategory(+id)
	}

	/* createCategory */

	@HttpCode(200)
	@Auth('ADMIN')
	@Post()
	async createCategory(@CurrentUser('id') adminId: number) {
		return this.categoryService.createCategory(adminId)
	}

	/* updateCategory */

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth('ADMIN')
	@Put(':id')
	async updateCategory(@Param('id') id: string, @Body() dto: CategoryDto) {
		return this.categoryService.updateCategory(+id, dto)
	}

	/* deleteCategory */

	@HttpCode(200)
	@Auth('ADMIN')
	@Delete(':id')
	async deleteCategory(@Param('id') id: string) {
		return this.categoryService.deleteCategory(+id)
	}
}
