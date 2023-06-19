import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { UserPrismaService } from 'src/services/user-prisma/user-prisma.service'
import { LoginDto } from './dto/login.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
	constructor(
		private readonly jwt: JwtService,
		private readonly userPrisma: UserPrismaService
	) {}

	/* Register Method */

	async register(dto: RegisterDto) {
		await this.userPrisma.validateUserRegister(dto.phone)

		const user = await this.userPrisma.createNewUser(dto)

		return this.returnNewTokensWithUserFields(user)
	}

	/* Login Method */

	async login(dto: LoginDto) {
		const user = await this.userPrisma.validateUserLogin(dto)

		return this.returnNewTokensWithUserFields(user)
	}

	/* getNewTokens Method */

	async getNewTokens(dto: RefreshTokenDto) {
		const result = await this.jwt.verifyAsync(dto.refreshToken).catch(() => {
			throw new UnauthorizedException('Недійсний токен оновлення')
		})

		const user = await this.userPrisma.getUniqueUserById(result.id)

		return this.returnNewTokensWithUserFields(user)
	}

	/* returnNewTokensWithUserFields Private Method */

	private async returnNewTokensWithUserFields(user: User) {
		const tokens = await this.issueTokens(user.id)

		return {
			user: this.returnUserFields(user),
			...tokens
		}
	}

	private async issueTokens(userId: number) {
		const payload = { id: userId }

		const accessToken = this.jwt.sign(payload, {
			expiresIn: '1h'
		})

		const refreshToken = this.jwt.sign(payload, {
			expiresIn: '7d'
		})

		return { accessToken, refreshToken }
	}

	private returnUserFields(user: User) {
		return {
			id: user.id,
			phone: user.phone,
			role: user.role
		}
	}
}
