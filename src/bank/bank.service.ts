import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Bank } from 'src/bank/entities/bank.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Repository } from 'typeorm';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';

@Injectable()
export class BankService {
  constructor(
    @InjectRepository(Bank) private bankRepository: Repository<Bank>,
  ) {}
  async create(banks: CreateBankDto): Promise<Bank> {
    const { generatedMaps } = await this.bankRepository
      .createQueryBuilder()
      .insert()
      .into(Bank)
      .values(banks)
      .returning('*')
      .execute();

    return plainToInstance(Bank, generatedMaps[0]);
  }

  async updateBalance(bankId: number): Promise<void> {
    const balanceQuery = this.bankRepository
      .createQueryBuilder('bank')
      .leftJoinAndSelect('bank.transactions', 'transaction')
      .select(
        `SUM(CASE WHEN transaction.type = 'income' THEN transaction.amount ELSE 0 END)`,
        'income',
      )
      .addSelect(
        `SUM(CASE WHEN transaction.type = 'expense' THEN transaction.amount ELSE 0 END)`,
        'expense',
      )
      .where('bank.id = :id', { id: bankId })
      .getRawOne();

    const { income, expense } = await balanceQuery;

    const balance = income - expense;

    await this.bankRepository.update(bankId, { balance });
  }

  async findAll(): Promise<Bank[]> {
    const banks = await this.bankRepository.find();
    return plainToInstance(Bank, banks);
  }

  async findOne(id: number): Promise<Bank> {
    return plainToInstance(
      Bank,
      await this.bankRepository.findOneBy({ id: id }),
    );
  }

  async update(id: number, updateBankDto: UpdateBankDto): Promise<Bank> {
    const { generatedMaps } = await this.bankRepository
      .createQueryBuilder()
      .update(Bank)
      .set(updateBankDto)
      .where('id = :id', { id: id })
      .returning('*')
      .execute();
    return plainToInstance(Bank, generatedMaps[0]);
  }

  async remove(id: number): Promise<void> {
    const bankWithTransaction = await this.bankRepository
      .createQueryBuilder('bank')
      .where('bank.id = :id', { id })
      .leftJoinAndSelect(
        (qb) => qb.select().from(Transaction, 't'),
        'transaction',
        'transaction.bank_id = bank.id',
      )
      .getRawOne();

    if (bankWithTransaction.id) {
      throw new HttpException('Bank has transactions', HttpStatus.BAD_REQUEST);
    } else {
      await this.bankRepository.delete(id);
    }
  }
}
