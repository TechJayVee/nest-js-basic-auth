import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class RoleService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}
  async create(createRoleDto: CreateRoleDto) {
    return await this.prisma.role.create({
      data: { ...createRoleDto },
    });
  }

  async findAll() {
    const dto = 'mockDTO';
    this.eventEmitter.emit('fetching.all', { dto });
    return await this.prisma.role.findMany();
  }

  async findOne(id: string) {
    const dto = 'One';
    const result = await this.eventEmitter.emitAsync('fetching.one', { dto }); //return a promise
    console.log('result of emiiter', result);

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
