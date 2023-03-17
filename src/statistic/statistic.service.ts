import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryStatisticDto } from 'src/statistic/dto/query-statistic.dto';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StatisticService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}
  async findAll(query: QueryStatisticDto) {
    const {
      categoryIds = [null],
      toPeriod = new Date(),
      fromPeriod = new Date(null),
    } = query;

    const transactions = await this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.categories', 'category')
      .where('transaction.createdAt BETWEEN :fromPeriod AND :toPeriod', {
        fromPeriod,
        toPeriod,
      })
      .andWhere('category.name IN (:...categoryIds)', { categoryIds })
      .getMany();

    return this.categorizeTransactions(transactions);
  }

  categorizeTransactions(transactions: Transaction[]): Record<string, number> {
    const result = {};
    for (const transaction of transactions) {
      const { amount, categories } = transaction;
      const transactionType = transaction.type === 'income' ? 1 : -1;
      for (const category of categories) {
        const categoryName = category.name;
        if (!result[categoryName]) {
          result[categoryName] = 0;
        }
        result[categoryName] += transactionType * amount;
      }
    }
    return result;
  }
}
