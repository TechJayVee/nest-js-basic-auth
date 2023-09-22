import { IsOptional, IsString, IsInt, IsEnum } from 'class-validator';
import { SortOrder } from '../enum/sort-order.enum';

export class QueryDto {
  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsEnum(SortOrder)
  sort: SortOrder;

  @IsOptional()
  @IsInt()
  page: number;

  @IsOptional()
  @IsInt()
  limit: number;
}
