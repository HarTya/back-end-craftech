import { IsOptional, IsString } from 'class-validator'

export class PaginationDto {
	@IsOptional()
	@IsString({
		message: 'Сторінка повинна бути рядком'
	})
	page?: string

	@IsOptional()
	@IsString({
		message: 'Кількість товарів повинна бути рядком'
	})
	perPage?: string
}
