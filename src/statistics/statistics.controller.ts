import { Controller, Get } from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { StatisticsService } from './statistics.service'

@Controller('statistics')
export class StatisticsController {
	constructor(private readonly statisticsService: StatisticsService) {}

	/* getMainStatistics */

	@Auth('ADMIN')
	@Get()
	getMainStatistics() {
		return this.statisticsService.getMainStatistics()
	}
}
