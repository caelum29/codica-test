import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bank } from 'src/bank/entities/bank.entity';
import { Category } from 'src/category/entities/category.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TransactionService } from 'src/transaction/transaction.service';
import { BankService } from 'src/bank/bank.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Transaction, Bank])],
  controllers: [CategoryController],
  providers: [CategoryService, TransactionService, BankService],
  exports: [CategoryService],
})
export class CategoryModule {}
