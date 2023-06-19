import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable
} from '@nestjs/common'
import { EnumUserRole, User } from '@prisma/client'

@Injectable()
export class OnlyAdminGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest<{ user: User }>()
		const user = request.user

		if (user.role !== EnumUserRole.ADMIN)
			throw new ForbiddenException('Недостатньо прав для виконання цієї дії')

		return true
	}
}
