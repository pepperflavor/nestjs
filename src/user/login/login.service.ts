import { Injectable, Body, HttpStatus, HttpException, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { userLoginDto } from '../user_dto/user-login.dto';
import { PrismaService } from '../../prisma.service';


@Injectable()
export class UserLoginService {
 
    // PrismaService 이걸 지정해야하는게 아닌감 // PrismaClient 이었음 처음에
    constructor(private readonly prisma: PrismaService){}

    // 지갑주소로 유저 찾기(가입한 유저인지 확인), 로그인 할 때 사용
    // 특정유저 찾아서 결과 return
   async findOne(userwallet: string): Promise<any>{
            const result = await this.prisma.user.findUnique({ 
                where :
                {
                    user_wallet : userwallet,
                },
            });

            if(result == null || undefined ){
                throw new HttpException('아이디가 존재하지 않습니다.', HttpStatus.BAD_REQUEST); // 오류번호 수정예정
            }
            return result;
    }

    getUser(userwallet: string): Promise<User>{
        try {
            const result = this.prisma.user.findUnique({ where :{
                user_wallet : userwallet,
                },
            });
            return result;
        } catch (error) {
            throw new HttpException('아이디가 존재하지 않습니다.', HttpStatus.BAD_REQUEST); // 오류번호 수정예정   
        }
    }

}