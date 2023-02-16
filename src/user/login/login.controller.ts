import { Controller, Post, Request, UseGuards, Get, Body, Res, Headers } from '@nestjs/common';
import {Response} from 'express'
import { AuthService } from '../../auth/auth.service';
import { LocalAuthGuard } from '../../auth/local-auth.guard';
import { userLoginDto } from '../user_dto/user-login.dto';


@Controller('user')
export class UserLoginController {
    constructor(private authService: AuthService){}

    //UseGuards : 경비역할을 하는 미들웨어
    //LocalAuthGuard에 적용한 설정 사용
    // @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Body() userLoginForm: userLoginDto, @Res() res:Response, @Headers() headers: any){
        console.log("로그인 시도 ")
        const token = await this.authService.validateUser(userLoginForm); // passport
        const data = await this.authService.postUserinfo(userLoginForm.user_wallet);
        res.header('Authorization', `Bearer ${token}`);
        res.json(data);
    }

}
