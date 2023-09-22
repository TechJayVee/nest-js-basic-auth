import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}
  async create(createRoleDto: CreateRoleDto) {
    return await this.prisma.role.create({
      data: { ...createRoleDto },
    });
  }

  async findAll() {
    return await this.prisma.role.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.role.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    return await this.prisma.role.update({
      where: { id },
      data: { ...updateRoleDto },
    });
  }

  async remove(id: string) {
    return await this.prisma.role.delete({
      where: {
        id,
      },
    });
  }
}
