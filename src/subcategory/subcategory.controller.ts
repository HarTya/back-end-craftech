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
import { SubcategoryDto } from './dto/subcategory.dto'
import { SubcategoryService } from './subcategory.service'

@Controller('subcategories')
export class SubcategoryController {
	constructor(private readonly subcategoryService: SubcategoryService) {}

	/* getAllSubcategories */

	@Get()
	async getAllSubcategories() {
		return this.subcategoryService.getAllSubcategories()
	}

	/* getSubcategoryBySlug */

	@Get('by-slug/:slug')
	async getSubcategoryBySlug(@Param('slug') slug: string) {
		return this.subcategoryService.getUniqueSubcategory(slug)
	}

	/* getSubcategoryById */

	@Auth('ADMIN')
	@Get(':id')
	async getSubcategoryById(@Param('id') id: string) {
		return this.subcategoryService.getUniqueSubcategory(+id)
	}

	/* createSubcategory */

	@HttpCode(200)
	@Auth('ADMIN')
	@Post('add/:categoryId')
	async createSubcategory(
		@CurrentUser('id') adminId: number,
		@Param('categoryId') categoryId: string
	) {
		return this.subcategoryService.createSubcategory(adminId, +categoryId)
	}

	/* updateSubcategory */

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth('ADMIN')
	@Put(':id')
	async updateSubcategory(
		@Param('id') id: string,
		@Body() dto: SubcategoryDto
	) {
		return this.subcategoryService.updateSubcategory(+id, dto)
	}

	/* deleteSubcategory */

	@HttpCode(200)
	@Auth('ADMIN')
	@Delete(':id')
	async deleteSubcategory(@Param('id') id: string) {
		return this.subcategoryService.deleteSubcategory(+id)
	}
}
