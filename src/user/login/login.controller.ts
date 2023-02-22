import { Controller, Post, Request, UseGuards, Get, Body, Res, Headers } from '@nestjs/common';
import {Response} from 'express'
import { AuthService } from '../../auth/auth.service';
import { LocalAuthGuard } from '../../auth/local-auth.guard';
import { userLoginDto } from '../user_dto/user-login.dto';
import { PrismaService } from '../../prisma.service';


@Controller('/user')
export class UserLoginController {
    constructor(private authService: AuthService, private prisma: PrismaService){}
    
    @Post('/login')
    async login(@Body() userLoginForm: userLoginDto, @Res() res:Response, @Headers() headers: any){
        const token = await this.authService.validateUser(userLoginForm); // passport
        const data = await this.authService.postUserinfo(userLoginForm.user_wallet);
        //res.header('Authorization', `Bearer ${token}`);
        res.json({data: data, token: token });
    }

    @Get('')
    async getinfo(){
        const data = await this.prisma.user.findFirst({
            where:{
                user_grade: 1
            }
        })
        return data
    }

}
