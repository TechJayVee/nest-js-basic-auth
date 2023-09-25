import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './utils';
import { JwtGuard } from './auth/guard';
import { APP_GUARD } from '@nestjs/core';
import { QueryModule } from './query/query.module';
import { RoleModule } from './role/role.module';
import { CaslModule } from './casl/casl.module';
import { AbilitiesGuard } from './casl/guard';
import { EventService } from './event/event.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    AuthModule,
    UserModule,
    BookmarkModule,
    PrismaModule,
    QueryModule,
    RoleModule,
    CaslModule,
    MailModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AbilitiesGuard,
    },
    EventService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
