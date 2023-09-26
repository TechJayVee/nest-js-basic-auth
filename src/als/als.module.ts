import { Module } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { AlsController } from './als.controller';

@Module({
  providers: [
    {
      provide: AsyncLocalStorage,
      useValue: new AsyncLocalStorage(),
    },
  ],
  controllers: [AlsController],
  exports: [AsyncLocalStorage],
})
export class AlsModule {}
