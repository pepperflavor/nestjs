import { Controller, Post, Request, UseGuards, Get, Body, Res, Headers } from '@nestjs/common';
import { VerifyEamilDto } from '../../email/verifyEamil.dto';
import {Response} from 'express'
import { CreatorLoginDto } from '../creator_dto/creator-login.dto';
import { AuthService } from '../../auth/auth.service';
import { LocalAuthGuard } from '../../auth/local-auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('creator')
export class CreatorLoginController {
    constructor(private authService: AuthService){}

   
    @Post('/login')
    async creatorLogin(@Body() creatorLoginDto: CreatorLoginDto, @Res() res:Response, @Headers() headers: any){
        const token = await this.authService.validateUser(creatorLoginDto); // passport
        const data = await this.authService.postUserinfo(creatorLoginDto.user_wallet);
        //res.header('Authorization', `Bearer ${token}`);
        res.json({data: data, token: token});
    }

}
