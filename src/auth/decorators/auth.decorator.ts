import { UseGuards, applyDecorators } from '@nestjs/common'
import { EnumUserRole } from '@prisma/client'
import { OnlyAdminGuard } from '../guards/admin.guard'
import { JwtAuthGuard } from '../guards/jwt.guard'

export const Auth = (role: EnumUserRole = EnumUserRole.USER) =>
	applyDecorators(
		role === 'ADMIN'
			? UseGuards(JwtAuthGuard, OnlyAdminGuard)
			: UseGuards(JwtAuthGuard)
	)
