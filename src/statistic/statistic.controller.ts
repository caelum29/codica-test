import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { QueryStatisticDto } from 'src/statistic/dto/query-statistic.dto';
import { StatisticService } from './statistic.service';

@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @ApiTags('Statistic')
  @ApiImplicitQuery({
    name: 'limit',
    description: 'The maximum number of transactions to return',
    required: false,
    type: Number,
  })
  @Get()
  findAll(@Query() query: QueryStatisticDto) {
    return this.statisticService.findAll(query);
  }
}
