import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from './dto';

@Injectable()
export class QueryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllWithQuery<T>(
    modelName: string,
    query: QueryDto,
    sortByField: string,
    searchFields: string[],
  ): Promise<[T[], number]> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const { search, sort } = query;
    const skip = (page - 1) * limit;

    let where: any = undefined;

    if (search) {
      where = {
        OR: searchFields.map((field) => ({
          [field]: { contains: search, mode: 'insensitive' },
        })),
      };
    }

    const orderBy: any = sort
      ? {
          [sortByField]: sort,
        }
      : undefined;

    const entities = await this.prisma[modelName].findMany({
      where,
      orderBy,
      skip,
      take: limit,
    });

    const total = await this.prisma[modelName].count({ where });

    return [entities as T[], total];
  }
}
