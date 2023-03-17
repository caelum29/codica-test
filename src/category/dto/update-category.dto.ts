import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({ example: 'hose', description: 'Name of a category' })
  @IsOptional()
  @IsString()
  @Transform((o) => o.value.toLowerCase())
  name?: string;

  @ApiProperty({
    example: 'house spendings',
    description: 'description of a category',
  })
  @IsOptional()
  @IsString()
  @Transform((o) => o.value.toLowerCase())
  description?: string;
}
