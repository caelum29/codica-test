import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({ example: 1000, description: 'amount' })
  @IsNumber()
  amount: number;

  @ApiProperty({
    enum: ['income', 'expense'],
    example: 'income',
    description: 'type',
  })
  @IsEnum(['income', 'expense'])
  type: string;

  @ApiProperty({ example: ['salary', 'car'], description: 'description' })
  @IsArray()
  @IsString({ each: true })
  categoryNames: string[];

  @ApiProperty({ example: 1, description: 'bankId' })
  @IsNumber()
  bankId: number;
}
