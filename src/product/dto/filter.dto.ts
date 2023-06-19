import { IsEnum, IsOptional, IsString } from 'class-validator'
import { PaginationDto } from 'src/pagination/dto/pagination.dto'

export enum EnumProductsSort {
	HIGH_PRICE = 'high-price',
	LOW_PRICE = 'low-price',
	NEWEST = 'newest',
	OLDEST = 'oldest'
}

export class FilterDto extends PaginationDto {
	@IsOptional()
	@IsEnum(EnumProductsSort, {
		message:
			'Сортування повинно бути лише за високою ціною, низькою ціною, найновішими та найдавнішими товарами'
	})
	sort?: EnumProductsSort

	@IsOptional()
	@IsString({
		message: 'Пошуковий запит повинен бути рядком'
	})
	searchTerm?: string
}
