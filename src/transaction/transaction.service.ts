import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { BankService } from 'src/bank/bank.service';
import { CategoryService } from 'src/category/category.service';
import { PaginationData } from 'src/shared/decorators/pagination';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private readonly bankService: BankService,
    @Inject(forwardRef(() => CategoryService))
    private categoryService: CategoryService,
  ) {}
  async create(createTransactionDto: CreateTransactionDto) {
    const { categoryNames } = createTransactionDto;

    const categories = await this.categoryService.findIfExistOrCreate(
      categoryNames,
    );

    const transaction = new Transaction();
    transaction.amount = createTransactionDto.amount;
    transaction.type = createTransactionDto.type;
    transaction.bank_id = createTransactionDto.bankId;
    transaction.categories = categories;
    await this.transactionRepository.save(transaction);

    await this.bankService.updateBalance(createTransactionDto.bankId);
  }

  async findAll(
    pagination: PaginationData,
    transaction?: Partial<Transaction>,
  ) {
    const where = transaction ? { ...transaction } : {};
    const [transactions, count] = await this.transactionRepository.findAndCount(
      {
        where,
        relations: { categories: true },
        skip: pagination.offset,
        take: pagination.limit,
        order: { createdAt: 'DESC' },
      },
    );
    return {
      count,
      transactions: transactions.map((transaction) =>
        plainToInstance(Transaction, transaction),
      ),
    };
  }

  async remove(id: string) {
    const { bank_id: bankId } =
      (await this.transactionRepository.findOne({
        where: { id },
      })) || {};

    await this.transactionRepository.delete(id);
    await this.bankService.updateBalance(bankId);
  }
}
