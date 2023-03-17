import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { StatisticService } from './statistic.service';
import { StatisticController } from './statistic.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  controllers: [StatisticController],
  providers: [StatisticService],
})
export class StatisticModule {}
