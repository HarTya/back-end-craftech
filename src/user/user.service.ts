import { Injectable } from '@nestjs/common'
import { UserPrismaService } from 'src/services/user-prisma/user-prisma.service'
import { PasswordDto } from './dto/password.dto'
import { ProfileDto } from './dto/profile.dto'

@Injectable()
export class UserService {
	constructor(private readonly userPrisma: UserPrismaService) {}

	/* getProfile Method */

	async getProfile(userId: number) {
		return this.userPrisma.getProfileByUserId(userId)
	}

	/* updateProfile Method */

	async updateProfile(userId: number, dto: ProfileDto) {
		return this.userPrisma.updateExistUser(userId, dto)
	}

	/* changePassword Method */

	async changePassword(userId: number, dto: PasswordDto) {
		return this.userPrisma.changeUserPassword(userId, dto)
	}

	/* toggleFavorite Method */

	async toggleFavorite(userId: number, productSlug: string) {
		return this.userPrisma.toggleUserFavoriteProduct(userId, productSlug)
	}
}
