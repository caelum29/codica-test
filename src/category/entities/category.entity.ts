import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryColumn({ unique: true })
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @ManyToMany(() => Transaction, (t) => t.categories)
  transactions: Transaction[];
}
