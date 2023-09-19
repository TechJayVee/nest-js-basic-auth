import { Controller, Get, UseGuards, Patch, Body } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { edithUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Patch()
  edithUser(@GetUser('id') userId: number, @Body() dto: edithUserDto) {
    console.log('userId', userId);

    return this.userService.editUser(userId, dto);
  }
}
