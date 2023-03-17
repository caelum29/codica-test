import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';
import { BankModule } from './bank/bank.module';
import { TransactionModule } from './transaction/transaction.module';
import { CategoryModule } from './category/category.module';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticModule } from './statistic/statistic.module';

@Module({
  imports: [
    BankModule,
    TransactionModule,
    CategoryModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as never,
        host: configService.env.PG_HOST,
        port: configService.env.PG_PORT,
        username: configService.env.PG_USERNAME,
        password: configService.env.PG_PASSWORD,
        database: configService.env.PG_DATABASE,
        entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
        autoLoadEntities: true,
        synchronize: true, // never use in production!
      }),
    }),
    StatisticModule,
  ],
})
export class AppModule {}
