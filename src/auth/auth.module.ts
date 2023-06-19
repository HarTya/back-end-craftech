import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { getJwtConfig } from 'src/config/jwt.config'
import { PaginationService } from 'src/pagination/pagination.service'
import { CategoryPrismaService } from 'src/services/category-prisma/category-prisma.service'
import { PrismaService } from 'src/services/prisma/prisma.service'
import { ProductPrismaService } from 'src/services/product-prisma/product-prisma.service'
import { SubcategoryPrismaService } from 'src/services/subcategory-prisma/subcategory-prisma.service'
import { UserPrismaService } from 'src/services/user-prisma/user-prisma.service'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './jwt.strategy'

@Module({
	imports: [
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJwtConfig
		})
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		JwtStrategy,
		PrismaService,
		UserPrismaService,
		ProductPrismaService,
		PaginationService,
		CategoryPrismaService,
		SubcategoryPrismaService
	]
})
export class AuthModule {}
