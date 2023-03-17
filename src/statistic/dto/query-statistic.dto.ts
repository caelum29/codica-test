import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';
import moment from 'moment';

const dateFormat = 'YYYY-MM-DDTHH:mm:ss';
export class QueryStatisticDto {
  @ApiProperty({
    example: 'salary,house',
    description: 'categories, should be comma separated',
    required: true,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  @Transform(({ value }) => value.split(','))
  categoryIds: string[];

  @ApiProperty({
    example: '2023-01-29T10:30:00',
    description: 'period from',
    required: false,
  })
  @IsString()
  @Transform((o) =>
    o.value ? moment(new Date(o.value)).format(dateFormat) : null,
  )
  @IsOptional()
  fromPeriod: string;

  @ApiProperty({
    example: '2023-10-29T10:30:00',
    description: 'period to',
    required: false,
  })
  @IsString()
  @Transform((o) =>
    o.value ? moment(new Date(o.value)).format(dateFormat) : null,
  )
  @IsOptional()
  toPeriod: string;
}
