import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SignUpModule } from './signup/signup.module';
import { LoginModule } from './login/login.module';
import { MypageModule } from './mypage/mypage.module';



@Module({
  imports:[SignUpModule, LoginModule, AuthModule, MypageModule],
  controllers: [],
  providers: [],
  exports: []
})
export class UserModule {}
