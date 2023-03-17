import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateBankDto {
  @ApiProperty({
    example: 'PrivateBank',
    description: 'Name of a bank',
  })
  @IsNotEmpty()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'my private bank',
    description: 'description of a bank',
  })
  @IsOptional()
  @IsString()
  @Transform((o) => o.value.toLowerCase())
  description?: string;
}
