import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  Action,
  CaslAbilityFactory,
} from '../casl/casl-ability.factory/casl-ability.factory';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { Role as RoleClass } from 'src/casl/entity';
import { ForbiddenError } from '@casl/ability';
import { CheckAbility } from './../auth/decorator';

@Controller('role')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private abilityFactory: CaslAbilityFactory,
  ) {}

  @Post()
  create(@GetUser() user: User, @Body() createRoleDto: CreateRoleDto) {
    const ability = this.abilityFactory.defineAbility(user);

    ForbiddenError.from(ability).throwUnlessCan(Action.Create, RoleClass);
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @CheckAbility({ action: Action.Read, subject: RoleClass })
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @CheckAbility({ action: Action.Delete, subject: RoleClass })
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }
}
