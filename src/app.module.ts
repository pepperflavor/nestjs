import { Global, Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { CreatorModule } from './creator/creator.module';
// import { AdminModule } from './admin/admin.module';

import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './middlewears/logger.middleware';
import { EmailModule } from './email/email.module';
import { AdminModule } from './admin/admin.module';
import { FileS3Module } from './file-s3/file-s3.module';



@Module({

  imports: [UserModule, CreatorModule, AdminModule, EmailModule, FileS3Module,
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: `${process.env.NODE_ENV}.env`
    }),

  ],
  controllers: [],
  providers: [
    {
      
      provide : APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})


// 미들웨어 설정
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer):any{
      consumer.apply(LoggerMiddleware).forRoutes('/user_*');
    }
}

