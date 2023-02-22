import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { resourceLimits } from 'worker_threads';

@Injectable()
export class MypageService {
    constructor(private prisma : PrismaService){}

    // 카테고리, 음원명, 총 발행량, 목표금액, 펀딩기간, 상태만 뽑아주기
    // 여기에 funding 테이블에서 shin_no에 해당하는 fund_state도 같이 뽑아주기
    async getmypage(creatorAddress: string){
        const result = await this.prisma.shinchunghada.findMany({
            where: {
                shin_creator_address : creatorAddress,
            },
            include:{
                funding: {
                    select: {
                        fund_state: true,
                    }
                },
            },
        })

        // 닉네임가능하면 던져주기
        return result;
    }

    async getfundState(){
        const result = this.prisma.funding.findMany()
    }
}
