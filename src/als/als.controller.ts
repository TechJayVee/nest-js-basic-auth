import { Controller, Get } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Controller('als')
export class AlsController {
  constructor(private readonly als: AsyncLocalStorage<any>) {}

  @Get()
  getAls() {
    return this.als.getStore();
  }
}
