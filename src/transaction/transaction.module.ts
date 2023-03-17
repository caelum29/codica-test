import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankModule } from 'src/bank/bank.module';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { WebhookController } from './webhook.controller';
import { CategoryService } from 'src/category/category.service';
import { Category } from 'src/category/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Category]), BankModule],
  controllers: [TransactionController, WebhookController],
  providers: [TransactionService, CategoryService],
  exports: [TransactionService],
})
export class TransactionModule {}
