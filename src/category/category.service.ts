import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Category } from 'src/category/entities/category.entity';
import { TransactionService } from 'src/transaction/transaction.service';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @Inject(forwardRef(() => TransactionService))
    private transactionService: TransactionService,
  ) {}
  async create(createCategories: CreateCategoryDto): Promise<Category> {
    const { generatedMaps } = await this.categoryRepository
      .createQueryBuilder()
      .insert()
      .into(Category)
      .values(createCategories)
      .returning('*')
      .execute();

    return plainToInstance(Category, generatedMaps[0]);
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.categoryRepository.find();
    return plainToInstance(Category, categories);
  }

  async findOne(name: string): Promise<Category> {
    return plainToInstance(
      Category,
      await this.categoryRepository.findOneBy({ name }),
    );
  }

  async findIfExistOrCreate(categories: string[]): Promise<Category[]> {
    const existed = await this.categoryRepository
      .createQueryBuilder('category')
      .where('category.name IN (:...categories)', { categories })
      .getMany();

    const notExisted = categories
      .filter((name) => !existed.find((category) => category.name === name))
      .map((name) => ({ name, description: null, transactions: null }));

    if (notExisted.length > 0) {
      await this.categoryRepository
        .createQueryBuilder()
        .insert()
        .into(Category)
        .values(notExisted)
        .returning('*')
        .execute();
      return [...existed, ...notExisted];
    }

    return existed;
  }

  async update(
    name: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<number> {
    const { affected } = await this.categoryRepository
      .createQueryBuilder()
      .update(Category)
      .set(updateCategoryDto)
      .where('name = :name', { name })
      .returning('*')
      .execute();
    if (affected === 0) {
      throw new Error('No category found');
    }

    return affected;
  }

  async remove(name: string): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { name },
      relations: { transactions: true },
    });

    if (category.transactions.length === 0) {
      await this.categoryRepository.remove(category);
    } else {
      throw new HttpException(
        'Category has transactions',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
