import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { hash, verify } from 'argon2'
import { LoginDto } from 'src/auth/dto/login.dto'
import { RegisterDto } from 'src/auth/dto/register.dto'
import { orderObject } from 'src/order/objects/order.object'
import { productObject } from 'src/product/objects/product.object'
import { reviewObject } from 'src/review/objects/review.object'
import { PasswordDto } from 'src/user/dto/password.dto'
import { ProfileDto } from 'src/user/dto/profile.dto'
import { userObject } from 'src/user/objects/user.object'
import { PrismaService } from '../prisma/prisma.service'
import { ProductPrismaService } from '../product-prisma/product-prisma.service'

@Injectable()
export class UserPrismaService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly productPrisma: ProductPrismaService
	) {}

	private async getUniqueUserByPhone(userPhone: string) {
		return this.prisma.user.findUnique({
			where: {
				phone: userPhone
			}
		})
	}

	async getUniqueUserById(userId: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId
			}
		})

		if (!user) throw new NotFoundException('Користувача не знайдено')

		return user
	}

	async getUniqueUserByIdWithFavoritesAndOther(
		userId: number,
		selectObject: Prisma.UserSelect = {}
	) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId
			},
			select: {
				...userObject,
				favorites: {
					select: productObject
				},
				...selectObject
			}
		})

		if (!user) throw new NotFoundException('Користувача не знайдено')

		return user
	}

	async createNewUser(dto: RegisterDto) {
		return this.prisma.user.create({
			data: {
				phone: dto.phone,
				password: await hash(dto.password),
				lastName: dto.lastName,
				firstName: dto.firstName
			}
		})
	}

	async validateUserRegister(userPhone: string) {
		const user = await this.getUniqueUserByPhone(userPhone)

		if (user)
			throw new BadRequestException('Номер телефону вже використовується')
	}

	async validateUserLogin(dto: LoginDto) {
		const user = await this.getUniqueUserByPhone(dto.phone)

		if (!user) throw new BadRequestException('Невірні облікові дані')

		const isPasswordValid = await verify(user.password, dto.password).catch(
			() => user.password === dto.password
		)

		if (!isPasswordValid) throw new BadRequestException('Невірні облікові дані')

		return user
	}

	async getProfileByUserId(userId: number) {
		const user = await this.getUniqueUserByIdWithFavoritesAndOther(userId, {
			phone: true,
			lastName: true,
			orders: {
				orderBy: {
					createdAt: 'desc'
				},
				select: orderObject
			},
			reviews: {
				select: reviewObject
			}
		})

		return user
	}

	async updateExistUser(userId: number, dto: ProfileDto) {
		const isSameUser = await this.getUniqueUserByPhone(dto.phone)

		if (isSameUser && userId !== isSameUser.id)
			throw new BadRequestException('Номер телефону вже використовується')

		return this.prisma.user.update({
			where: {
				id: userId
			},
			data: {
				phone: dto.phone,
				lastName: dto.lastName,
				firstName: dto.firstName,
				avatarPath: dto.avatarPath
			}
		})
	}

	async changeUserPassword(userId: number, dto: PasswordDto) {
		const user = await this.getUniqueUserById(userId)

		const isPasswordValid = await verify(user.password, dto.password).catch(
			() => user.password === dto.password
		)

		if (!isPasswordValid) throw new BadRequestException('Недійсний пароль')

		if (dto.password === dto.newPassword)
			throw new BadRequestException(
				'Новий пароль повинен відрізнятися від поточного'
			)

		return this.prisma.user.update({
			where: {
				id: userId
			},
			data: {
				password: await hash(dto.newPassword)
			}
		})
	}

	async toggleUserFavoriteProduct(userId: number, productSlug: string) {
		const user = await this.getUniqueUserByIdWithFavoritesAndOther(userId)

		const product = await this.productPrisma.getUniqueProductByIdOrSlug(
			productSlug
		)

		const isExists = user.favorites.some(
			favorite => favorite.slug === product.slug
		)

		await this.prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				favorites: {
					[isExists ? 'disconnect' : 'connect']: {
						id: product.id
					}
				}
			}
		})

		return { message: 'Операція пройшла успішно' }
	}

	async getUsersCount() {
		return this.prisma.user.count()
	}
}
